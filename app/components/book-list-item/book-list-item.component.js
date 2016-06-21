angular.module('app').directive('nyuBookListItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/book-list-item/book-list-item.html',
    controllerAs: 'nyuBookListItem',
    scope: {
    	last 			: '@',
    	item 			: '='
    },
    controller: function ($scope) {
    }
  };
});
