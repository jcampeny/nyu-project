angular.module('app').directive('nyuFilter', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/filter/filter.html',
    controllerAs: 'nyuFilter',
    scope: {
    	entity: '@'
    },
    controller: function ($scope, $rootScope, EntitiesService) {
    	$scope.root = $rootScope;
    	$scope.entitiesService = EntitiesService;

    }
  };
});
