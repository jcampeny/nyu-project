angular
    .module('app')
    .service('PaypalService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){
        

        return {
            sendPayment : sendPayment
        };
        
        function sendPayment(user, subId, subRenew){
        	var item = {
        		name : user.name,
        		pass : user.pass,
        		sub_id  : subId,
        		sub_renew  : subRenew
        	};
            return $http.post('php/woocommerce/send-payment.php', item);
        }
       
    }]);

