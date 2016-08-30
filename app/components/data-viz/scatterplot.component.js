angular.module('app').directive('nyuScatterplot', function () {
  return {
    restrict: 'E',
    require : '^^nyuDataViz',
    template : 'aaaaa',
    controllerAs: 'nyuScatterplot',
    scope: {
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService, DataService, $state, deviceDetector) {
        $scope.parent = $scope.$parent.$parent;
    },
    link: function (s, e, a){
    }
  };
});
