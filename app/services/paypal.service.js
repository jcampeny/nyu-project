angular
    .module('app')
    .service('PaypalService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){
        

        return {
            sendPayment : sendPayment
        };
        
        function sendPayment(user){
            return $http.post('php/woocommerce/send-payment.php', user);
        }
       
    }]);

