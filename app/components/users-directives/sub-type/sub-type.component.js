angular.module('app').directive('userSubType', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/sub-type/sub-type.html',
    controllerAs: 'userSubType',
    scope : {
        viewController : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope, rolesGetData) {
        $scope.root = $rootScope;
        
        $scope.validUser = {
            accountSettings : true
        }

        $scope.viewController.setLoading(true);
        rolesGetData.checkRole($scope.root.actualUser, 'account_settings_general').then(function(response){
            $scope.viewController.setLoading(false);
            if(response.data.status == 'success') 
                $scope.validUser.accountSettings = response.data.content;
        });
    }
  };
});
