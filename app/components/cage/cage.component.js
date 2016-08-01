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
        $scope.user = LoginService.getStorageUser() || angular.copy(emptyUser);

        //console.log($scope.user);
        //LOGIN
        $scope.logIn = function(name, pass){
            if(!$scope.user.logged && name && pass){
                LoginService.loginUser(name, pass)
                    .then(function(response){
                        console.log(response);
                        $scope.user.name = response.data.user_display_name;
                        $scope.user.email = response.data.user_email;
                        $scope.user.nicename = response.data.user_nicename;
                        $scope.user.logged = true;
                        $scope.user.other = "";
                        $scope.user.pass = pass;

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
            $scope.user = angular.copy(emptyUser);
            LoginService.resetStorageUser();
            $scope.register = {};
            $scope.csv = initCSV();
        };

        //User Information
        function getUserInfo(){
            LoginService.getUserInfo($scope.user).then(function(userInfo){
                console.log(userInfo);
                if(typeof userInfo.data == 'object'){
                    $scope.user.other = userInfo.data;
                    LoginService.setStorageUser($scope.user);
                }else{
                    console.error(userInfo);
                }
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
                    LoginService.changePassword($scope.user, newPass).then(function(response){
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
            LoginService.resetPassword(user, randomstring).then(function(message){
                //console.log(randomstring);
                if(message.data.status == 'success'){
                    console.log(message.data.content);
                }else{
                    console.log(message.data);
                }
                //$scope.logIn('jordicq', randomstring);
            });
        }; 

        //CSV
        $scope.csv = initCSV();

        $scope.saveCSV = function(){
            LoginService.setCSV($scope.user, $scope.csv).then(function(response){console.log(response);
                if(response.data.status == "success"){
                    console.log(response.data.content);
                }else{
                    console.log(response.data.content);
                }
            }); 
        };
        $scope.getCSV = function(){
            LoginService.getCSV($scope.user).then(function(response){
                if(response.data.status == "success"){
                    console.log(response.data.content);
                }else{
                    console.log(response.data.content);
                }
            }); 
        };
        function initCSV(){
            return {
                content: null,
                header: false,
                headerVisible: false,
                separator: ';',
                separatorVisible: false,
                result: null,
                //encoding: 'ISO-8859-1',
                //encodingVisible: true
            };
        }
    }
  };
});
