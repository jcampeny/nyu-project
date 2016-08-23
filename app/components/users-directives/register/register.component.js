angular.module('app').directive('userRegister', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/register/register.html',
    controllerAs: 'userRegister',
    controller: function ($scope, LoginService, $http) {

        $scope.register = {};
        //obtenemos la información del localStorage

        /*******************
        ******NEW USER******
        *******************/
        $scope.registerUser = function(isValid){
            if(isValid){
                LoginService.createUser($scope.register).then(function(response){
                    if(response.data.status == 'success'){
                        console.log(response.data.content);
                        //$scope.logIn(response.data.content.username, $scope.register.pass);                        
                    }else{
                        console.log(response.data.content);
                    }

                });
            }else{
                console.log('falta algo');
            }
        };  
    }
  };
});
