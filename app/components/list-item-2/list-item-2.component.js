angular.module('app').directive('nyuListItem2', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-item-2/list-item-2.html',
    controllerAs: 'nyuListItem2',
    scope: {
		author       : '@',
		title        : '@',
		subtitle     : '@',
		img          : '@',
		content      : '@',
		mainctatext  : '@',
		mainctatext2 : '@'
    },
    controller: function ($scope) {
    	//code
    	
    }
  };
});
