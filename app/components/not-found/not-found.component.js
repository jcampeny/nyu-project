
angular.module('app').directive('nyuNotFound', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/not-found/not-found.html',
    controllerAs: 'nyuNotFound',
    controller: function ($scope) {
	}
  };
});

