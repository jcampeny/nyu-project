angular.module('app').directive('cageSelectDistanceVaribles', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/cage-select-distance-varibles/cage-select-distance-varibles.html',
    controllerAs: 'cageSelectDistanceVaribles',
    scope : {
    	variables : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {

        $scope.dropDownCollapsed = [];
        $scope.subSectionCollapsed = [];
        
        /*************************
        ***Logarithm controller***
        *************************/
        $scope.toggleCollapsed = function(scopeKey, newValue){
            $scope.dropDownCollapsed[scopeKey] = newValue; 
        };

    }
  };
});
