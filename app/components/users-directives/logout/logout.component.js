angular.module('app').directive('userLogout', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/logout/logout.html',
    controllerAs: 'userLogout',
    scope : {
        onLogout : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        var emptyUser = {
            name : "",
            email : "",
            nicename : "",
            other : "",
            logged : false,
            pass : "",
            role : 0
        };

        /*******************
        *******LOGOUT******
        *******************/
        $scope.logOut = function(){
            $rootScope.actualUser = angular.copy(emptyUser);
            LoginService.resetStorageUser();
            if(typeof $scope.onLogout == 'function') $scope.onLogout();
        };

    }
  };
});
