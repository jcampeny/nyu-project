angular
    .module('app')
    .service('rolesGetData', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){

        return {
            checkRole : checkRole,

        };

        /*******************
        ****GENERAL****
        *******************/
        /*
        -- Pasa el usuario y para que se utilizará el rol --
        InPut   : user@rootUser,  for@String
        Return  : error@String || @boolean
        */ 
        function checkRole(user, reason){
            var item = {
                name : user.name,
                pass : user.pass,
                reason : reason
            };
            return $http.post('php/woocommerce/check-role.php', item);
        }
    }]);

