angular.module('app').directive('userHeader', function (LoginService, $http, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/user-header/user-header.html',
    controllerAs: 'userHeader',
    scope : {
        color : '@', //#282A39
        strokeWidth : '@'
    },
    controller: function ($scope) {
        $scope.root = $rootScope;
        $scope.validUser = {
            log : true,
            share : false,
            help : true,
            download : false
        };
        $scope.headerItemClick = function(name){
            $rootScope.$broadcast('userHeaderClick', {
                name : name
            });
        }

    }
  };
});
