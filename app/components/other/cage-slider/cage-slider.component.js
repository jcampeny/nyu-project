angular.module('app').directive('cageSlider', function ($document) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/cage-slider/cage-slider.html',
    controllerAs: 'cageSlider',
    scope : {
    	name : '@',
    	value : '@'
    },
    controller: function ($scope, LoginService, $http, $rootScope) {

    	/*************************
    	***Logarithm controller***
    	*************************/

    	//Logaritmo de Y con base X
    	function getBaseLog (x, y) {
    		return Math.log(y) / Math.log(x);
    	}

    	$scope.fromPercentToLog = function (x, decimals) {
    		var logScale = ((x/100)*6) - 3;
    		var logResult = Math.pow(2,logScale);
    		if(decimals){
    			logResult = Math.round(logResult * Math.pow(10,decimals)) / Math.pow(10,decimals);
    		}
    		return logResult;
    	};

    	$scope.fromLogToPercent = function (x) {
    		var logScale = getBaseLog (2, x);
    		var percentResult = ((logScale + 3) / 6) * 100;
    		return percentResult;
    	};

    	//Seteamos el valor inicial del slider
    	$scope.range = $scope.fromLogToPercent($scope.value);

    	$scope.rangeValues = [
    		{text : "1/8", value : (0/6) * 100},
    		{text : "1/4", value : (1/6) * 100},
    		{text : "1/2", value : (2/6) * 100},
    		{text : "1",   value : (3/6) * 100},
    		{text : "2",   value : (4/6) * 100},
    		{text : "4",   value : (5/6) * 100},
    		{text : "8",   value : (6/6) * 100}
    	];

    	//watchear range i logValue(nuevo)

        $scope.logValue = $scope.value;

        $scope.$watch('range', function(){
            $scope.logValue = $scope.fromPercentToLog($scope.range, 3);
        });
        
        $scope.$watch('logValue', function(){
            $scope.range = $scope.fromLogToPercent($scope.logValue);
        });
    }
  };
});
