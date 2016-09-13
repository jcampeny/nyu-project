angular.module('app').directive('userSubType', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/sub-type/sub-type.html',
    controllerAs: 'userSubType',
    controller: function ($scope, LoginService, $http, $rootScope, rolesGetData) {
        $scope.validUser = {
            accountSettings : true
        }
        rolesGetData.checkRole($scope.root.actualUser, 'account_settings_general').then(function(response){console.log(response);
            if(response.data.status == 'success') 
                $scope.validUser.accountSettings = response.data.content;
        });
    }
  };
});
