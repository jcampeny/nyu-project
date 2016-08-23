angular
    .module('app')
    .service('LoginService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){
        //var apiHost = "http://nyu.com/wordpress/wp-json";
        //var apiHost = "http://test-nyu.elkanodata.com/wordpress/wp-json";

        var apiHost = "/wordpress/wp-json";

        return {
            createUser : createUser,
            loginUser  : loginUser,
            setStorageUser : setStorageUser,
            getStorageUser : getStorageUser,
            resetStorageUser : resetStorageUser,
            getUserInfo : getUserInfo,
            encryptPassword : encryptPassword,
            changePassword : changePassword,
            resetPassword : resetPassword,

        };

        /*******************
        ****USER MANAGER****
        *******************/
        /*
        -- Logea el usuario al woocommerce --
        InPut   : username@String,  pass@String
        Return  : error@String || user{username, email, user_nicename}
        */ 
        function loginUser(username, password){
            return $http.post( apiHost + '/jwt-auth/v1/token', {
                username : username,
                password : password
            });
        }
        /*
        -- Obtiene toda la información del usuario --
        InPut   : user {username@String, pass@String}
        Return  : error@String || user{...}
        */ 
        function getUserInfo(user){
            return $http.post('/php/woocommerce/info-user.php', user);
        }

        /*
        -- Crea un usuario nuevo --
        Checks  : usuario no existe en DB + email no existe en DB
        InPut   : user {username@String, pass@String}
        Return  : response {
                    status@String('error' || 'success'), 
                    content(error@String || user{...})}
        */ 
        function createUser(user){
            return $http.post('/php/woocommerce/create-user.php', user);
        }

        /*******************
        **PASSWORD MANAGER**
        *******************/
        /*
        -- Encripta la password para guardarla en el localStorage --
        Checks  : usuario existe + Pass correcta  
        InPut   : user {username@String, pass@String}, pass@String
        Return  : response {
                    status@String('error' || 'success'), 
                    content@String}
        */ 
        function encryptPassword(user, pass){
            var item = {
                user : user,
                pass : pass
            };
            return $http.post('/php/woocommerce/encrypt-password.php', item);
        }
        /*
        -- Cambiar la password y envia un mensaje al usuario con la nueva password --
        Checks  : usuario existe + Pass antigua correcta  
        InPut   : user {username@String, pass@String}, pass@String
        Return  : response {
                    status@String('error' || 'success'), 
                    content@String}
        */ 
        function changePassword(user, pass){
            var item = {
                user : user,
                pass : pass
            };
            return $http.post('/php/woocommerce/change-password.php', item);
        }
        /*
        -- Resetea la password y envia un mail con la nueva password --
        TODO    : CREAR LA NUEVA PASSWORD EN EL SERVIDOR
        Checks  : usuario existe 
        InPut   : user {username@String, pass@String}, pass@String
        Return  : response {
                    status@String('error' || 'success'), 
                    content@String}
        */ 
        function resetPassword(user, pass){
            var item = {
                user : user
            };
            return $http.post('/php/woocommerce/reset-password.php', item);
        }



        /*******************
        **STORAGE MANAGER**
        *******************/
        function setStorageUser(user){
            $localStorage.user = user;
        }
        function getStorageUser(){
            return $localStorage.user;
        }
        function resetStorageUser(){
            delete $localStorage.user;
        }
    }]);

