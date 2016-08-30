angular.module('app').directive('nyuFlowMap', function () {
  return {
    restrict: 'E',
    require : '^^nyuDataViz',
    template : 'aaaaa',
    controllerAs: 'nyuFlowMap',
    scope: {
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService, DataService, $state, deviceDetector) {
        $scope.parent = $scope.$parent.$parent;
    },
    link: function (s, e, a){
    }
  };
});
