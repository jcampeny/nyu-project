angular.module('app').directive('appTestWorldbank', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/test-worldbank/test-worldbank.html',
    controllerAs: 'testWorldbank',
    controller: function ($scope, FiltersService, ApiService) {
    	//code
    	$scope.countries = [];
    	$scope.years = FiltersService.getWBYears();
    	$scope.topics = [];
    	$scope.indicators = [];
    	$scope.topic = null;

    	$scope.filters = {
			country 	: null,
			yearFrom    : (new Date()).getFullYear()-1,
			yearTo      : (new Date()).getFullYear(),
			indicator 	: null
    	};

    	FiltersService.getWBCountries().then(function(countries){
    		$scope.countries = countries;
    	},function(error){console.log(error);});  	

		FiltersService.getWBTopics().then(function(topics){
    		$scope.topics = topics;
    	},function(error){console.log(error);}); 

    	FiltersService.getWBIndicators().then(function(indicators){
    		$scope.indicators = indicators;
    	},function(error){console.log(error);}); 

		$scope.data = [];
		$scope.showLoading = false;

    	$scope.getData = function(){
    		$scope.data = [];
    		$scope.showLoading = true;

    		ApiService.worldBank($scope.filters).then(function(result){
    			$scope.data = result;
    			$scope.showLoading = false;
    		},function(error){
    			alert(error);
    		});
    	};
    }
  };
}).filter('filterByTopic',function(){
	return function(list, topic){
		var filtered = [];

		if(typeof topic === "undefined" || topic === null || topic === ""){
			filtered = list;
		}else{
			angular.forEach(list, function(indicator){
				angular.forEach(indicator.topics, function(indTopic){
					if(indTopic.id === topic){
						filtered.push(indicator);
					}
				});
			});
		}

		return filtered;
	};
});
