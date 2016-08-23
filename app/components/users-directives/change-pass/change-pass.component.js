angular.module('app').directive('userChangePass', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/change-pass/change-pass.html',
    controllerAs: 'userChangePass',
    scope : {
        callback : '@'
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.root = $rootScope;
        $scope.view = {state : 'notEditable'};
        /*******************
        ******NEW PASS******
        *******************/
        $scope.saveNewPassword = function(actualPass, newPass, newPassRepeated){
            //todo
            LoginService.encryptPassword($rootScope.actualUser, actualPass).then(function(actualPassEncrypted){
                if(newPass == newPassRepeated){
                    if($scope.root.actualUser.pass == actualPassEncrypted.data.content){
                        LoginService.changePassword($scope.root.actualUser, newPass).then(function(response){
                            console.log(response);
                            if(response.data.status == 'success'){
                                console.log(response.data.content); //all OK 

                                if(typeof $scope.callback == 'function'){$scope.callback();} 
                                
                                LoginService.encryptPassword($rootScope.actualUser, newPass).then(function(responseEncrypt){
                                    if(responseEncrypt.data.status == 'success'){
                                        $rootScope.actualUser.pass = responseEncrypt.data.content;
                                        //guardamos a localStorage
                                        LoginService.setStorageUser($rootScope.actualUser);
                                        $scope.view = {state : 'success'};
                                    }else{
                                        console.log(response.data.content);
                                    }

                                });                  
                            }else{
                                console.log(response.data.content);//user no exist o pass incorrecta
                            }
                        });
                    }else{
                       console.log('Error', 'pass incorrecta'); 
                    }
                }else{
                    console.log('las passwornd no son iguales');
                }                
            });

        }; 
    }
  };
});
