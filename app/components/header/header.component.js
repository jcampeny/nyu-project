angular.module('app').directive('ngHeader', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/header/header.html',
    controllerAs: 'header',
    controller: function ($scope, $rootScope, $window, PopupService) {
    	$scope.headerFixed = false;
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
	    	if($rootScope.currentState == "app.about"){
	    		current = "about";

	    	}else if($rootScope.currentState == "app.books" || 
	    				$rootScope.currentState == "app.articles" || 
	    				$rootScope.currentState == "app.global" || 
	    				$rootScope.currentState == "app.working" || 
	    				$rootScope.currentState == "app.blog"){
	    		current = "publications";
	    	
	    	}else if($rootScope.currentState == "app.videos" || 
	    				$rootScope.currentState == "app.podcasts" || 
	    				$rootScope.currentState == "app.press" || 
	    				$rootScope.currentState == "app.mediakit"){
	    		current = "news";

	    	}else if($rootScope.currentState == "app.globecourse" || 
	    				$rootScope.currentState == "app.cases" || 
	    				$rootScope.currentState == "app.notes" || 
	    				$rootScope.currentState == "app.other" || 
	    				$rootScope.currentState == "app.surveys"){
	    		current = "teaching";
	    	}

	    	return current;
	    };


	    $scope.showSpeakerPopup = function(){
			PopupService.showSpeakerPopup();
		};
    }
  };
});
