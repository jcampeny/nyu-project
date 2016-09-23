angular.module('app').directive('userInformation', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/information/information.html',
    controllerAs: 'userInformation',
    controller: function ($scope, LoginService, $http, $rootScope, errorService) {
        $scope.root = $rootScope;
        $scope.state = {isEditable : false};
        $scope.loading = false;

        $scope.user = angular.copy($scope.root.actualUser.other.billing);
        $scope.user.newsletter = angular.copy($scope.root.actualUser.newsletter);

        $scope.errorHandler = new errorService.errorHandler();
        /*******************
        ***NEW USER INFO****
        *******************/
        $scope.saveOtherInfo = function(){
            var user = $scope.root.actualUser;
            $scope.loading = true;

            LoginService.updateUserInfo(user, $scope.user).then(function(response){
                if(response.data.status == 'success'){
                    var updatedUser = $scope.user;
                    var newsletter = response.data.content.user.newsletter;

                    delete updatedUser.newsletter;

                    $rootScope.actualUser.email         = angular.copy(updatedUser.email);
                    $rootScope.actualUser.other.email   = angular.copy(updatedUser.email);
                    $rootScope.actualUser.other.billing = angular.copy(updatedUser);
                    $rootScope.actualUser.newsletter    = angular.copy(newsletter);
                    
                    $scope.user.newsletter  = newsletter;
                    $scope.state.isEditable = false;
                }else{
                    $scope.errorHandler.setError(response.data.content);
                }
                $scope.loading = false;
            });
            
        };

    }
  };
});
