angular.module('app').directive('nyuCage', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.root = $rootScope;

        $scope.sliderSections = {
        	"Cultural" : {
        		items : [
		        	{name: "test"  , value : 0.125},
		        	{name: "test0" , value : 0.5},
					{name: "test1" , value : 1.5},
					{name: "test2" , value : 2.5},
					{name: "test3" , value : 3.5}
        		]
        	},
        	"Administrative" : {
        		items : [
		        	{name: "test"  , value : 0.125},
		        	{name: "test0" , value : 0.5},
					{name: "test1" , value : 1.5},
					{name: "test2" , value : 2.5},
					{name: "test3" , value : 3.5}
        		]
        	},
        	"Geographic" : {
        		items : [
		        	{name: "test"  , value : 0.125},
		        	{name: "test0" , value : 0.5},
					{name: "test1" , value : 1.5},
					{name: "test2" , value : 2.5},
					{name: "test3" , value : 3.5}
        		]
        	},
        	"Economic" : {
        		items : [
		        	{name: "test"  , value : 0.125},
		        	{name: "test0" , value : 0.5},
					{name: "test1" , value : 1.5},
					{name: "test2" , value : 2.5},
					{name: "test3" , value : 3.5}
        		]
        	}
        };
    }
  };
});
