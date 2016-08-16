angular.module('app').directive('userLogin', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/login/login.html',
    controllerAs: 'userLogin',
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

        $rootScope.actualUser = LoginService.getStorageUser() || angular.copy(emptyUser);

        /*******************
        *******LOGIN*******
        *******************/
        $scope.logIn = function(name, pass){
            $rootScope.actualUser = LoginService.getStorageUser() || angular.copy(emptyUser);
            if(!$rootScope.actualUser.logged && name && pass){
                LoginService.loginUser(name, pass)
                    .then(function(response){
                        console.log(response);
                        $rootScope.actualUser.name = response.data.user_display_name;
                        $rootScope.actualUser.email = response.data.user_email;
                        $rootScope.actualUser.nicename = response.data.user_nicename;
                        $rootScope.actualUser.logged = true;
                        $rootScope.actualUser.other = "";

                        LoginService.encryptPassword($rootScope.actualUser, pass).then(function(response){
                            console.log(response);

                            if(response.data.status == 'success'){
                                $rootScope.actualUser.pass = response.data.content;
                                //guardamos a localStorage
                                LoginService.setStorageUser($rootScope.actualUser);
                                $scope.getCSV();

                                getUserInfo();                                
                            }else{
                                console.log(response.data.content);
                            }

                        });

                    })
                    .catch( function( error ) {
                        console.log('Error', error.data.message);
                    });                   
            }else{
                console.error('not filled');
            }
        };

        /*******************
        ****FORGOT PASS****
        *******************/
        $scope.resetPassword = function(email){
            var user = {
                email : email,
                name : ''
            };
            LoginService.resetPassword(user).then(function(message){
                if(message.data.status == 'success'){
                    console.log(message.data.content);
                }else{
                    console.log(message.data);
                }
                //$scope.logIn('jordicq', randomstring);
            });
        }; 

        /*******************
        ******USER INFO******
        *******************/
        function getUserInfo(){
            
            LoginService.getUserInfo($rootScope.actualUser).then(function(userInfo){
                if(typeof userInfo.data == 'object'){
                    $rootScope.actualUser.other = userInfo.data;
                    LoginService.setStorageUser($rootScope.actualUser);
                }else{
                    console.error(userInfo);
                }
            });
        }
    }
  };
});
