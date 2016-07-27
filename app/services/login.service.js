angular
    .module('app')
    .service('LoginService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){
        
        var woopath = "http://nyu.com/wordpress/wp-json/wc/v1/products";
        var apiHost = "http://nyu.com/wordpress/wp-json";

        return {
            //getDataWoo : getDataWoo,
            createUser : createUser,
            loginUser  : loginUser,
            setStorageUser : setStorageUser,
            getStorageUser : getStorageUser,
            resetStorageUser : resetStorageUser,
            getUserInfo : getUserInfo,
            changePassword : changePassword
        };
        /*function getDataWoo() {
            var items ={};
            return $http
                .get('/php/woocommerce/create-user.php', items)
                //.get('/wordpress/wp-content/themes/twentysixteen/ajax-login.php', items)
                //john.doe
                .then(function(response){
                    console.log(response);
                    return response.data;
                });
        }*/

        function loginUser(username, password){
            return $http.post( apiHost + '/jwt-auth/v1/token', {
                username : username,
                password : password
            });
        }

        function getUserInfo(user){
            return $http.post('/php/woocommerce/info-user.php', user);
        }

        function createUser(){
            var user = {
                id : Math.random(1)*100,
                name : 'pepito',
                pass : 'xxx',
                permissions : 'all'
            };
            $localStorage.LocalMessage = user;
        }

        function changePassword(user, pass){
            var item = {
                user : user,
                pass : pass
            };
            return $http.post('/php/woocommerce/change-password.php', item);
        }
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

