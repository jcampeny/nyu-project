angular.module('app').directive('nyuItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/item/item.html',
    controllerAs: 'nyuItem',
    scope: {
    	entity: '@'
    },
    controller: function ($scope) {
    	//code
    }
  };
});
