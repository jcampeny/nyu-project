angular.module('app').directive('nyuCage', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http) {
        var emptyUser = {
            name : "",
            email : "",
            nicename : "",
            other : "",
            logged : false
        };
        //obtenemos la información del localStorage
        $scope.user = LoginService.getStorageUser() || emptyUser;
        console.log($scope.user);
        //LOGIN
        $scope.logIn = function(name, pass){
            if(!$scope.user.logged && name && pass){
                LoginService.loginUser(name, pass)
                    .then(function(response){
                        console.log(response);
                        $scope.user = {
                            name : response.data.user_display_name,
                            email : response.data.user_email,
                            nicename : response.data.user_nicename,
                            logged : true,
                            other : ""
                        };
                        //guardamos a localStorage
                        LoginService.setStorageUser($scope.user);
                        getUserInfo();
                    })
                    .catch( function( error ) {
                        console.log('Error', error.data.message);
                    });                   
            }else{
                console.error('not filled');
            }
        };
        //LOGOUT
        $scope.logOut = function(){
            if($scope.user.logged){
                $scope.user = emptyUser;
                LoginService.resetStorageUser();
            }
        };

        //User Information
        function getUserInfo(){
            LoginService.getUserInfo($scope.user).then(function(userInfo){
                $scope.user.other = (typeof userInfo.data == 'object' ) ? userInfo.data : '';
                LoginService.setStorageUser($scope.user);
            });
        }

        //save Other user information
        $scope.saveOtherInfo = function(){
            //todo
        };

        //save Other user information
        $scope.saveNewPassword = function(actualPass, newPass, newPassRepeated){
            //todo
            if(newPass == newPassRepeated){
                LoginService.loginUser($scope.user.name, actualPass)
                .then(function(response){
                    LoginService.changePassword($scope.user, newPass).then(function(message){
                        console.log(message);
                        $scope.logOut();
                    });
                })
                .catch( function( error ) {
                    console.log('Error', error.data.message);
                }); 
            }else{
                console.log('las passwornd no son iguales');
            }
        };

    }
  };
});
