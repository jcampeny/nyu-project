angular
    .module('app')
    .service('LoginService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){
        
        var woopath = "http://nyu.com/wordpress/wp-json/wc/v1/products";
        var apiHost = "http://nyu.com/wordpress/wp-json";

        return {
            createUser : createUser,
            loginUser  : loginUser,
            setStorageUser : setStorageUser,
            getStorageUser : getStorageUser,
            resetStorageUser : resetStorageUser,
            getUserInfo : getUserInfo,
            changePassword : changePassword,
            resetPassword : resetPassword,
            setCSV : setCSV,
            getCSV : getCSV
        };

        function setCSV(){

        }
        function getCSV(){
            /*var user = {
                name : 'jordicq',
                pass : 'asd'
            };
            return $http.post('/php/woocommerce/validate-user.php', user);*/
        }
        function loginUser(username, password){
            return $http.post( apiHost + '/jwt-auth/v1/token', {
                username : username,
                password : password
            });
        }

        function getUserInfo(user){
            return $http.post('/php/woocommerce/info-user.php', user);
        }

        function createUser(user){
            return $http.post('/php/woocommerce/create-user.php', user);
        }
        /*PASSWORD MANAGER*/
        function changePassword(user, pass){
            var item = {
                user : user,
                pass : pass
            };
            return $http.post('/php/woocommerce/change-password.php', item);
        }
        function resetPassword(user, pass){
            var item = {
                user : user,
                pass : pass
            };
            return $http.post('/php/woocommerce/reset-password.php', item);
        }
        /*END PASSWORD MANAGER*/
        /*STORAGE MANAGER*/
        function setStorageUser(user){
            $localStorage.user = user;
        }
        function getStorageUser(){
            return $localStorage.user;
        }
        function resetStorageUser(){
            delete $localStorage.user;
        }
        /*END STORAGE MANAGER*/
    }]);

