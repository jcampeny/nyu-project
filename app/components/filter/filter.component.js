angular.module('app').directive('nyuFilter', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/filter/filter.html',
    controllerAs: 'nyuFilter',
    scope: {
    	entity: '@'
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService) {
    	$scope.root = $rootScope;
    	$scope.entitiesService = EntitiesService;
    	$scope.filterData = {};

    	$scope.clearFilters = function(){
			$scope.filterData = {
	    		targetAudience: [],
	    		topic: [],
	    		country: [],
	    		language: [],
	    		yearFrom: "",
	    		yearTo: ""
	    	};
    	};
    	$scope.clearFilters();

    	$scope.dataSRC = {
    		targetAudience: [
	    		{id: 1, text: "Instructors"},
	    		{id: 2, text: "Researchers"},
	    		{id: 3, text: "Professors"},
	    		{id: 4, text: "Students"}
	    	],
	    	topic: [
	    		{id: 1, text: "Business Leaders"},
	    		{id: 2, text: "Modality"},
	    		{id: 3, text: "Commodity"},
	    	],
	    	country: [
	    		{id: 1,  text: "Argentina"},
	    		{id: 2,  text: "Australia"},
	    		{id: 3,  text: "Austria"},
	    		{id: 4,  text: "Chile"},
	    		{id: 5,  text: "China"},
	    		{id: 6,  text: "Dominica"},
	    		{id: 7,  text: "Dominican Republic"},
	    		{id: 8,  text: "United Arab Emirates"},
	    		{id: 9,  text: "United States"},
	    		{id: 10, text: "United Kingdom"}
	    	],
	    	language: [
	    		{id: 1, text: "English"},
	    		{id: 2, text: "Spanish"},
	    		{id: 3, text: "Chinese"},
	    	],
	    	years: []
    	};

    	var todayYear = (new Date()).getFullYear();
    	for(var i=1990 ; i<=todayYear ; i++){
    		$scope.dataSRC.years.push(i);
    	}

    	$scope.filterAutocomplete = function(query, field){
    		var deferred = $q.defer();
		    deferred.resolve( $filter('filter')($scope.dataSRC[field], query));
		    return deferred.promise;
    	};

    }
  };
});
