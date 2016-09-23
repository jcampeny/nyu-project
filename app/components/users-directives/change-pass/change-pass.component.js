angular.module('app').directive('userChangePass', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/change-pass/change-pass.html',
    controllerAs: 'userChangePass',
    scope : {
        callback : '@'
    },
    controller: function ($scope, LoginService, $http, $rootScope, errorService) {
        $scope.root = $rootScope;
        $scope.view = {state : 'notEditable'};

        $scope.loading = false;
        $scope.errorHandler = new errorService.errorHandler();
        /*******************
        ******NEW PASS******
        *******************/
        $scope.saveNewPassword = function(actualPass, newPass, newPassRepeated){
            $scope.loading = true;
            LoginService.encryptPassword($rootScope.actualUser, actualPass).then(function(actualPassEncrypted){
                if(newPass == newPassRepeated){
                    if($scope.root.actualUser.pass == actualPassEncrypted.data.content){
                        LoginService.changePassword($scope.root.actualUser, newPass).then(function(response){
                            if(response.data.status == 'success'){
                                $scope.errorHandler.setError('');

                                if(typeof $scope.callback == 'function'){$scope.callback();} 
                        
                                LoginService.encryptPassword($rootScope.actualUser, newPass).then(function(responseEncrypt){
                                    if(responseEncrypt.data.status == 'success'){
                                        $rootScope.actualUser.pass = responseEncrypt.data.content;
                                        //guardamos a localStorage
                                        LoginService.setStorageUser($rootScope.actualUser);
                                        $scope.view = {state : 'success'};
                                    }else{
                                        $scope.errorHandler.setError(response.data.content);
                                    }

                                });                  
                            }else{
                                console.log(response.data.content);//user no exist o pass incorrecta
                            }
                            $scope.loading = false;
                        });
                    }else{
                        $scope.errorHandler.setError('The new password is incorrect');
                        $scope.loading = false;  
                    }
                }else{
                    $scope.errorHandler.setError('The repeated password is incorrect');
                    $scope.loading = false;  
                }              
            });

        }; 
    }
  };
});
