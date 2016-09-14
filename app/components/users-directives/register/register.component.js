angular.module('app').directive('userRegister', function (errorService, $rootScope, PaypalService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/register/register.html',
    controllerAs: 'userRegister',
    scope : {
        terms : "=",
        callback : "=", 
        type : "=",
        viewController : "="
    },
    controller: function ($scope, LoginService, $http) {
        $scope.root = $rootScope;
        $scope.register = {};
        $scope.subSelected = {
            radio : '',
            renew : false
        };
        //obtenemos la información del localStorage
        $scope.errorHandler = new errorService.errorHandler();
        /*******************
        *****PAYPAL*********
        *******************/
        $scope.sendPayment = function(){
            $scope.viewController.setLoading(true);
            PaypalService.sendPayment($scope.root.actualUser, $scope.subSelected.radio, $scope.subSelected.renew).then(function(response){
                $scope.viewController.setLoading(false);
                if(response.data.status == "success"){
                    window.location.replace(response.data.content);
                }else{
                    $scope.errorHandler.setError(response.data.content);
                }
            });
        };

        /*******************
        ******NEW USER******
        *******************/
        /* 
        * $scope.type = userRegister || userRegisterPremium || userUpgradePremium
        */
        $scope.registerViewController = new viewController();

        $scope.registerUser = function(registerForm){//console.log(registerForm, $scope.subSelected);
            if(registerForm.$valid){
                $scope.viewController.setLoading(true);
                LoginService.createUser($scope.register).then(function(response){
                    $scope.viewController.setLoading(false);
                    if(response.data.status == 'success'){
                        $rootScope.actualUser.name     =  response.data.content.user.username;
                        $rootScope.actualUser.email    =  response.data.content.user.email;
                        $rootScope.actualUser.nicename =  response.data.content.user.username;
                        $rootScope.actualUser.pass     =  response.data.content.pass;
                        $rootScope.actualUser.other    =  response.data.content.user.billing;
                        $rootScope.actualUser.logged   = true;
                        
                        $rootScope.$broadcast('userLogged', {
                            user : $rootScope.actualUser
                        });
                        LoginService.setStorageUser($rootScope.actualUser);

                        if($scope.type != 'userRegister' && $scope.subSelected.radio !== ''){
                            $scope.sendPayment();
                        }else if($scope.type == 'userRegister'){
                            if(typeof $scope.callback == 'function'){$scope.callback();} 
                        }                      
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
            $scope.viewController.setLoading(true);
            LoginService.getSubscriptions().then(function(response){
                $scope.viewController.setLoading(false);
                if(response.data.status == 'success'){
                    $rootScope.subscriptions = {'D' : [], 'W' : [], 'M' : [], 'Y' : []};
                    angular.forEach(response.data.content, function(subscriptions) {
                        $rootScope.subscriptions[subscriptions.type_cycle].push(subscriptions);
                    });
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
