angular.module('app').directive('userRegister', function (errorService, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/register/register.html',
    controllerAs: 'userRegister',
    scope : {
        terms : "=",
        callback : "=", 
        type : "="
    },
    controller: function ($scope, LoginService, $http) {
        $scope.root = $rootScope;
        $scope.register = {};
        $scope.subSelected = {
            radio : ''
        };
        //obtenemos la información del localStorage

        /*******************
        ******NEW USER******
        *******************/
        /* 
        * $scope.type = userRegister || userRegisterPremium || userUpgradePremium
        */
        $scope.registerViewController = new viewController();
        $scope.errorHandler = new errorService.errorHandler();
        $scope.aaa = function(){console.log($scope.subSelected.radio);};
        $scope.registerUser = function(registerForm){console.log(registerForm);
            if(registerForm.$valid){
                LoginService.createUser($scope.register).then(function(response){
                    if(response.data.status == 'success'){
                        if(typeof $scope.callback == 'function'){$scope.callback();} 
                        //$scope.logIn(response.data.content.username, $scope.register.pass);                        
                    }else{
                        $scope.errorHandler.setError(response.data.content);
                    }
                });
            }else{
                $scope.errorHandler.setError('The information you entered is incorrect');
            }
        }; 

        if(!$rootScope.subscriptions) getSubscriptions();
        
        function getSubscriptions() {   
            LoginService.getSubscriptions().then(function(response){console.log(response);
                if(response.data.status == 'success'){
                    $rootScope.subscriptions = response.data.content;
                }
            });
        }

        function viewController(){
            this.state = '1';
            this.next = function () {
                this.state = (this.state == '1') ? '2' : '1' ;
            };
            this.back = function () {
                this.state = (this.state == '2') ? '1' : '2' ;
            }
        };
    }
  };
});
