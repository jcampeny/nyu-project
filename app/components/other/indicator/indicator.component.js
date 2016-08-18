angular.module('app').directive('indicator', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/indicator/indicator.html',
    controllerAs: 'indicator',
    scope : {
    	variables : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {

    }
  };
});
