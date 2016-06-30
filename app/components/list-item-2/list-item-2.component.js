angular.module('app').directive('nyuListItem2', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-item-2/list-item-2.html',
    controllerAs: 'nyuListItem2',
    scope: {
        id           : '@',
    	entity 		 : '@',
		author       : '@',
		title        : '@',
		subtitle     : '@',
		img          : '@',
		content      : '@',
		mainctatext  : '@',
		mainctatext2 : '@'
    },
    controller: function ($scope) {
    	$scope.getTitleUrl = function(){
    		return window.encodeURIComponent($scope.title).replace(/%20/g,'+');
    	};
    	
    }
  };
});
