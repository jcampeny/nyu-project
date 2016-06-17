angular.module('app').directive('nyuFilter', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/filter/filter.html',
    controllerAs: 'nyuFilter',
    scope: {
    	entity: '@'
    },
    controller: function ($scope) {

    	$scope.entityFilters = {
    		articles: {name: "Articles and Book Chapters", fields:["target","topic","country","date","language"]},
    		blog: {name: "Blog", fields:["topic","country","date","language"]},
    		videos: {name: "Videos", fields:["topic","country","date","language"]},
    		podcasts: {name: "Podcasts", fields:["topic","country","date","language"]},
    		press: {name: "Press", fields:["topic","country","date","language"]}
    	};

    	$scope.showFilter = function(){
    		return (typeof $scope.entityFilters[$scope.entity] !== "undefined");
    	};

    	$scope.hasFilter = function(field){
    		return $scope.entityFilters[$scope.entity].fields.indexOf(field) >= 0;
    	};
    }
  };
});
