angular.module('app').directive('nyuListItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-item/list-item.html',
    controllerAs: 'nyuListItem',
    scope: {
		author      : '@',
		title       : '@',
		subtitle    : '@',
		img         : '@',
		content     : '@',
		mainctatext : '@'
    },
    controller: function ($scope) {
    	//code
    }
  };
});
