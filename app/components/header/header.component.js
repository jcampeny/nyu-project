angular.module('app').directive('ngHeader', function ($rootScope, $window, PopupService, DataService, $state, scrollService, $document, $location, deviceDetector) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/header/header.html',
    controllerAs: 'header',
    controller: function ($scope) {
    	$scope.headerFixed = false;
    	$scope.stateName = $state.current.url;
    	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    		$scope.stateName = $state.current.url;
    		var stateCurrent = $scope.getCurrentStateGroup();
    		$scope.toggleCollapsed(stateCurrent);
    		$('[ui-sref="'+fromState.name+'"]').removeClass('active');
    		$('[ui-sref="'+toState.name+'"]').addClass('active');
    		
    		if(toState.url != 'search'){
    			$scope.showSearch('close');    			
    		}

    	});
    	$('[ui-sref="'+$rootScope.currentState+'"]').addClass('active');
	    $scope.openRequest = function(view){
    		PopupService.openPopUp(true, view);
    	};
    	if(deviceDetector.isMobile()){
    		$scope.headerFixed = true;
    	}else{
		    angular.element($window).bind("scroll", function(e) {
		        if($window.scrollY > 87){
		        	$scope.headerFixed = true;
		        }else{
		        	$scope.headerFixed = false;
		        }
		        $scope.$apply();
		   	});    		
    	}


	    $rootScope.headerOpened = false;
	    $scope.toggleMenu = function(){
	    	$rootScope.headerOpened = !$rootScope.headerOpened;
	    };

	    $scope.collapsed = '';
	    $scope.toggleCollapsed = function(option){
	    	if($scope.collapsed !== option){
	    		$scope.collapsed = option;
	    	}else{
	    		$scope.collapsed = '';
	    	}
	    };

	    $scope.getCurrentStateGroup = function(){
	    	var current = "";
	    	if($rootScope.currentState == "app.home"){
	    		current = "home";

	    	}else if($rootScope.currentState == "app.about"){
	    		current = "about";

	    	}else if($rootScope.currentState == "app.search"){
	    		current = "search";

	    	}else if($rootScope.currentState == "app.books" || 
	    			 	$rootScope.currentState == "app.booksitem" || 
	    				$rootScope.currentState == "app.articles" || 
	    				$rootScope.currentState == "app.articlesitem" || 
	    				$rootScope.currentState == "app.global" || 
	    				$rootScope.currentState == "app.globalitem" || 
	    				$rootScope.currentState == "app.working" ||
	    				$rootScope.currentState == "app.workingitem" || 
	    				$rootScope.currentState == "app.blog" ||
	    				$rootScope.currentState == "app.blogitem"){
	    		current = "publications";
	    	
	    	}else if($rootScope.currentState == "app.videos" || 
	    				$rootScope.currentState == "app.videositem" || 
	    				$rootScope.currentState == "app.podcasts" || 
	    				$rootScope.currentState == "app.podcastsitem" || 
	    				$rootScope.currentState == "app.press" || 
	    				$rootScope.currentState == "app.pressitem" || 
	    				$rootScope.currentState == "app.mediakit"){
	    		current = "news";

	    	}else if($rootScope.currentState == "app.globecourse" || 
	    				$rootScope.currentState == "app.globedocuments" || 
	    				$rootScope.currentState == "app.globedocumentsitem" || 
	    				$rootScope.currentState == "app.globereadings" || 
	    				$rootScope.currentState == "app.globereadingsitem" || 
	    				$rootScope.currentState == "app.globecases" || 
	    				$rootScope.currentState == "app.globenotes" || 
	    				$rootScope.currentState == "app.globenotesitem" || 
	    				$rootScope.currentState == "app.globepresentations" || 
	    				$rootScope.currentState == "app.globepresentationsitem" || 
	    				$rootScope.currentState == "app.cases" || 
	    				$rootScope.currentState == "app.casesitem" || 
	    				$rootScope.currentState == "app.notes" || 
	    				$rootScope.currentState == "app.notesitem" || 
	    				$rootScope.currentState == "app.other" || 
	    				$rootScope.currentState == "app.otheritem" || 
	    				$rootScope.currentState == "app.surveys" ||
	    				$rootScope.currentState == "app.survey-gap" ||
	    				$rootScope.currentState == "app.markets-gap"){
	    		current = "teaching";
	    	}

	    	return current;
	    };
	    /*$scope.showSpeakerPopup = function(){
			PopupService.showSpeakerPopup();
		};*/
		var stateCurrent = $scope.getCurrentStateGroup();
		$scope.toggleCollapsed(stateCurrent);
		$rootScope.$watch('globalSearchReset', function(){
			$scope.searchInput = DataService.getGlobalSearch();
		});
		$scope.searchSubmit = function(searchInput){
			$state.go('app.search');
			//$scope.showSearch('close');
			$rootScope.change++;
			DataService.setGlobalSearch(searchInput);
		};
		$scope.showSearch = function(toState){
			$( ".input-container > input" ).focus();
			if(toState == 'open' && $('.input-container, .input-container-mobile').css('opacity') < 1){
				$('.search-input, .input-container-mobile').animate({
					height : '190%'
				}, 400, function(){
					$('.input-container, .input-container-mobile').animate({opacity : '1'}, 400);
				});
			}else/* if($state.current.url != 'search')*/{
				$('.input-container, .input-container-mobile').animate({
					opacity : '0'
				}, 400, function(){
					$('.search-input, .input-container-mobile').animate({height : '0%'}, 400);
				});
			}

		};
		$rootScope.$on('backTop', function(event, data){
			$scope.hideOnScroll = false;
		});
		$document.bind('touchmove', function(element){
			var dir = scrollService.getDirectionOnTouchMove(element);
			if(!$rootScope.headerOpened){
				$scope.hideOnScroll = (dir == "down") ? true : false;
				$scope.$apply();
			}
			
		});
    },
    link: function (s,e,a){

    	s.getUrl = function (){
    		return $location.$$absUrl;
    	};
    }
  };
});
