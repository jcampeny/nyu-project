angular.module('app').directive('appTestImf', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/test-imf/test-imf.html',
    controllerAs: 'testImf',
    controller: function ($scope, FiltersService, ApiService, ArrayService) {
    	//code
    	$scope.datasets = [];
    	$scope.parameters = [];
    	$scope.years = FiltersService.getIMFYears();

    	$scope.filters = {
			dataset 	: null,
			yearFrom    : (new Date()).getFullYear()-1,
			yearTo      : (new Date()).getFullYear(),
			params 		: []
    	};

    	FiltersService.getIMFDatasets().then(function(datasets){
    		$scope.datasets = datasets;
    	},function(error){console.log(error);});  	

    	$scope.getParameters = function(){
    		$scope.showLoading = true;
    		$scope.parameters = [];
    		$scope.filters.params = [];

    		FiltersService.getIMFParamList($scope.filters.dataset).then(function(parameters){
	    		var totalParams = parameters.length;
	    		var paramOrder = 0;

	    		angular.forEach(parameters, function(p){
	    			p.order = paramOrder++;

	    			FiltersService.getIMFParam(p['@codelist']).then(function(param){
	    				param.order = p.order;
	    				param.conceptRef = p['@conceptRef'];
	    				param.codelist = p['@codelist'];

			    		$scope.parameters.push(param);
			    		totalParams--;
			    		if(totalParams === 0){
			    			$scope.showLoading = false;
			    		}
			    	},function(error){console.log(error);});  
	    		});
	    	},function(error){console.log(error);});  	
    	};

		$scope.data = [];
		$scope.showLoading = false;

    	$scope.getData = function(){
    		$scope.data = [];
    		$scope.showLoading = true;

    		ApiService.imf($scope.filters).then(function(result){
    			$scope.data = result;
    			$scope.showLoading = false;
    		},function(error){
    			alert(error);
    		});
    	};

    	$scope.getSeriesParamValue = function(serie, param){
    		var value = serie["@"+param.conceptRef];
    		return ArrayService.getFromProperty(param.Code, "@value", value).Description['#text'];
    	};
    }
  };
});
