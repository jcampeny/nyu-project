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
            share : true,
            help : true,
            download : false
        };
        //lanza un evento al rootScope, el name equivale al nombre de la scope
        //en el caso de share sera name = share
        //entonces cuando recojas este evento checkeas name == 'share'
        //esta hecho así por si necesitas el evento en cualquier otra directiva
        //los eventos se recogen en un switch cage.component.js y data-viz.component.js

        $scope.headerItemClick = function(name){
            $rootScope.$broadcast('userHeaderClick', {
                name : name
            });
        }

    }
  };
});
