angular.module('app').directive('appTestWorldbank', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/test-worldbank/test-worldbank.html',
    controllerAs: 'testWorldbank',
    controller: function ($scope) {
    	//code
    }
  };
});
