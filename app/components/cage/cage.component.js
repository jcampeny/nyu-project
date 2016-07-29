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
            logged : false,
            pass : ""
        };
        $scope.register = {};
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
                            other : "",
                            pass : pass
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
                $scope.register = {};
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
                if($scope.user.pass == actualPass){
                    LoginService.changePassword($scope.user, newPass).then(function(message){
                        if(response.data.status == 'success'){
                            console.log(response.data.content);                      
                        }else{
                            console.log(response.data.content);
                        }
                    });
                }else{
                   console.log('Error', 'pass incorrecta'); 
                }
            }else{
                console.log('las passwornd no son iguales');
            }
        };

        //newUser
        $scope.registerUser = function(isValid){
            if(isValid){
                LoginService.createUser($scope.register).then(function(response){
                    if(response.data.status == 'success'){
                        console.log(response.data.content);
                        $scope.logIn(response.data.content.username, $scope.register.pass);                        
                    }else{
                        console.log(response.data.content);
                    }

                });
            }else{
                console.log('falta algo');
            }
        };  
        //forgot Password
        $scope.resetPassword = function(email){
            var randomstring = Math.random().toString(36).slice(-8);
            var user = {
                email : email,
                name : ''
            };
            LoginService.changePassword(user, randomstring).then(function(message){
                //console.log(randomstring);
                if(message.data.status == 'success'){
                    console.log(message.data.content);
                }else{
                    console.log(message.data);
                }
                //$scope.logIn('jordicq', randomstring);
            });
        }; 
    }
  };
});
