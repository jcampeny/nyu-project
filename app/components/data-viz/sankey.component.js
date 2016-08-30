angular.module('app').directive('nyuSankey', function () {
  return {
    restrict: 'E',
    require : '^^nyuDataViz',
    template : 'aaaaa',
    controllerAs: 'nyuSankey',
    scope: {
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService, DataService, $state, deviceDetector) {
        $scope.parent = $scope.$parent.$parent;
    },
    link: function (s, e, a){
    }
  };
});
