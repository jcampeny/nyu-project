angular.module('app').directive('ngHeader', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/header/header.html',
    controllerAs: 'header',
    controller: function ($scope, $window) {
    	$scope.headerFixed = false;
	    angular.element($window).bind("scroll", function(e) {
	       if($window.scrollY > 87){
	         $scope.headerFixed = true;
	       }else{
	         $scope.headerFixed = false;
	       }
	       $scope.$apply();
	   });
    }
  };
});
