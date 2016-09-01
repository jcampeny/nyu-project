angular.module('app').directive('fromTo', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/from-to/from-to.html',
    controllerAs: 'fromTo',
    scope : {
    	variables : '=',
        result : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        //check years
    }
  };
});
