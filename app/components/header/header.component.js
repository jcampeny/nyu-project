angular.module('app').directive('ngHeader', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/header/header.html',
    controllerAs: 'header',
    controller: function ($scope) {
    	//code
    }
  };
});
