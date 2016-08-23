angular.module('app').directive('cageSelectDistanceVaribles', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/cage-select-distance-varibles/cage-select-distance-varibles.html',
    controllerAs: 'cageSelectDistanceVaribles',
    scope : {
    	variables : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {

        console.log($scope.variables[0]);
        $scope.collapsed = "";

        /*************************
        ***Logarithm controller***
        *************************/
        $scope.toggleCollapsed = function(scopeKey, newValue){
            $scope[scopeKey] = newValue; 
        };

    }
  };
});
