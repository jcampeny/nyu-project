angular.module('app').directive('userLogin', function (errorService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/login/login.html',
    controllerAs: 'userLogin',
    scope: {
        callback : "="
    },
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
        $scope.loading = false;
        $scope.showForgot = false;
        $scope.errorHandler = new errorService.errorHandler();

        $rootScope.actualUser = LoginService.getStorageUser() || angular.copy(emptyUser);

        /*******************
        *******LOGIN*******
        *******************/
        $scope.logIn = function(name, pass){
            $scope.loading = true;
            $rootScope.actualUser = LoginService.getStorageUser() || angular.copy(emptyUser);
            if(!$rootScope.actualUser.logged && name && pass){
                LoginService.loginUser(name, pass)
                    .then(function(response){
                        //console.log(response);
                        $rootScope.actualUser.name = response.data.user_display_name;
                        $rootScope.actualUser.email = response.data.user_email;
                        $rootScope.actualUser.nicename = response.data.user_nicename;
                        $rootScope.actualUser.logged = true;
                        $rootScope.actualUser.other = "";

                        LoginService.encryptPassword($rootScope.actualUser, pass).then(function(response){
                            //console.log(response);

                            if(response.data.status == 'success'){
                                $rootScope.actualUser.pass = response.data.content;
                                //guardamos a localStorage
                                LoginService.setStorageUser($rootScope.actualUser);
                                //$scope.getCSV(); llamar los csv des del service
                                if(typeof $scope.callback == 'function'){$scope.callback();}
                                getUserInfo();   
                                                           
                            }else{
                                $scope.errorHandler.setError(response.data.content);
                            }
                            $scope.loading = false;
                        });

                    })
                    .catch( function( error ) {
                        $scope.errorHandler.setError(error.data.message);
                        $scope.loading = false;
                    });                   
            }else{
                $scope.errorHandler.setError('not filled');
                $scope.loading = false;
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
