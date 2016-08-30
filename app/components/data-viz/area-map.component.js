angular.module('app').directive('nyuAreaMap', function (mapVariablesService) {
  return {
    restrict: 'E',
    require : '^^nyuDataViz',
    templateUrl : '../app/components/data-viz/templates/area-map.html',
    controllerAs: 'nyuAreaMap',
    scope: {
        viewController: '='
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService, DataService, $state, deviceDetector) {
        $scope.parent = $scope.$parent.$parent;

        /******************
        **** VARIABLES ****
        ******************/
        $scope.countries = $scope.parent.countries;
        $scope.indicators = $scope.parent.indicators;

        $scope.selectedCountry = $scope.parent.selectedCountry;
        $scope.selectedIndicators = $scope.parent.selectedIndicators;

        $scope.temporalCountry = $scope.selectedCountry;
        $scope.temporalIndicators = $scope.selectedIndicators;

        $scope.popUpCountry = angular.copy($scope.temporalCountry);
        $scope.popUpIndicators = angular.copy($scope.temporalIndicators);
        
    },
    link: function (s, e, a){
    }
  };
});
