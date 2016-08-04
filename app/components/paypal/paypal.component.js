angular.module('app').directive('paypalPayment', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/paypal/paypal.html',
    controllerAs: 'nyuPaypal',
    controller: function ($scope, LoginService, PaypalService) {

        $scope.user = LoginService.getStorageUser();

        $scope.sendPayment = function(){
            PaypalService.sendPayment($scope.user).then(function(response){
                if(response.data.status == "success"){
                    console.log(response.data.content);
                    window.location.replace(response.data.content);
                }else{
                    console.log(response.data.content+' La petición a Paypal no ha podido ser realizada');
                }
            });
        };

    },
    link : function (s, e, a){

    }
  };
});
