angular.module('app').directive('ngHeader', function ($rootScope, $window, PopupService, DataService, $state, scrollService, $document, $location) {
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
    	});
    	$('[ui-sref="'+$rootScope.currentState+'"]').addClass('active');
	    $scope.openRequest = function(){
    		PopupService.openPopUp(true);
    	};
	    angular.element($window).bind("scroll", function(e) {
	        if($window.scrollY > 87){
	        	$scope.headerFixed = true;
	        }else{
	        	$scope.headerFixed = false;
	        }
	        $scope.$apply();
	   	});

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

		$scope.searchSubmit = function(searchInput){
			$state.go('app.search');
			$scope.showSearch('close');
			DataService.setGlobalSearch(searchInput);
		};
		$scope.showSearch = function(toState){
			if(toState == 'open'){
				$('.search-input').animate({
					height : '190%'
				}, 400, function(){
					$('.input-container').animate({opacity : '1'}, 400);
				});
			}else{
				$('.input-container').animate({
					opacity : '0'
				}, 400, function(){
					$('.search-input').animate({height : '0%'}, 400);
				});
			}

		};
    },
    link: function (s,e,a){
    	$document.bind('touchmove', function(element){
    		var dir = scrollService.getDirectionOnTouchMove(element);
    		s.hideOnScroll = (dir == "down") ? true : false;
    	});
    	s.getUrl = function (){
    		return $location.$$absUrl;
    	};
    }
  };
});
