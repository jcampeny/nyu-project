angular.module('app').directive('userChangePass', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/change-pass/change-pass.html',
    controllerAs: 'userChangePass',
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.root = $rootScope;

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
