angular.module('app').directive('appTestComtrade', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/test-comtrade/test-comtrade.html',
    controllerAs: 'testComtrade',
    controller: function ($scope, FiltersService, ApiService) {
    	//code
    	$scope.countries = [];
    	$scope.bec = [];
    	$scope.years = FiltersService.getComtradeYears();
    	$scope.types = FiltersService.getTypes();

    	$scope.codificationType = [
			{id : "HS",	  text: "HS"},
			{id : "BEC",  text: "BEC"},
			{id : "SITC", text: "SITC"}
    	];
    	$scope.categories   = [];
    	$scope.categories_2 = [];
    	$scope.categories_3 = [];
    	$scope.categories_4 = [];

    	$scope.filters = {
			countryFrom : null,
			countryTo   : null,
			year        : (new Date()).getFullYear()-1,
			type 		: "C",
			codification: null,
			category	: null,
			category_2	: null,
			category_3	: null,
			category_4	: null
    	};

    	FiltersService.getComtradeCountries().then(function(countries){
    		$scope.countries = countries;
    	},function(error){console.log(error);});  	

		$scope.fillCategories = function(){
			$scope.categories   = [];
	    	$scope.categories_2 = [];
	    	$scope.categories_3 = [];
	    	$scope.categories_4 = [];
	    	$scope.filters.category = null;
	    	$scope.filters.category_2 = null;
	    	$scope.filters.category_3 = null;
	    	$scope.filters.category_4 = null;

			fillCategoryArray('', 'ALL');
		};

		$scope.fillCategories2 = function(){
			$scope.categories_2 = [];
	    	$scope.categories_3 = [];
	    	$scope.categories_4 = [];
	    	$scope.filters.category_2 = null;
	    	$scope.filters.category_3 = null;
	    	$scope.filters.category_4 = null;

	    	fillCategoryArray('_2', $scope.filters.category);
		};

		$scope.fillCategories3 = function(){
			$scope.categories_3 = [];
	    	$scope.categories_4 = [];
	    	$scope.filters.category_3 = null;
	    	$scope.filters.category_4 = null;

			fillCategoryArray('_3', $scope.filters.category_2);
		};

		$scope.fillCategories4 = function(){
	    	$scope.categories_4 = [];
	    	$scope.filters.category_4 = null;

			fillCategoryArray('_4', $scope.filters.category_3);
		};

		function fillCategoryArray(catArray, category){
			if(category !== null){
				if($scope.filters.codification === "BEC"){
					FiltersService.getBEC(category).then(function(bec){
	    				$scope['categories'+catArray] = bec;
	    			},function(error){console.log(error);});

				}else if($scope.filters.codification === "HS"){
					FiltersService.getHS(category).then(function(hs){
	    				$scope['categories'+catArray] = hs;
	    			},function(error){console.log(error);});  

				}else if($scope.filters.codification === "SITC"){
					FiltersService.getSITC(category).then(function(sitc){
	    				$scope['categories'+catArray] = sitc;
	    			},function(error){console.log(error);});  
				}
			}
		}

		$scope.data = [];
		$scope.showLoading = false;

    	$scope.getData = function(){
    		$scope.data = [];
    		$scope.showLoading = true;
    		var request = angular.copy($scope.filters);
    		request.code = getCodificationCategory();

    		ApiService.comtrade(request).then(function(result){
    			$scope.data = result;
    			$scope.showLoading = false;
    		},function(error){
    			alert(error);
    		});
    	};

    	function getCodificationCategory(){
    		var code = $scope.filters.category_4;
    		if(code === null){
    			code = $scope.filters.category_3;
    		}
    		if(code === null){
    			code = $scope.filters.category_2;
    		}
    		if(code === null){
    			code = $scope.filters.category;
    		}
    		if(code === null){
    			code = "ALL";
    		}
    		return code;
    	}
    }
  };
});

