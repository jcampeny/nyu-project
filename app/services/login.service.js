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
            getCSV : getCSV,
            deleteCSV : deleteCSV
        };
        /*******************
        ****CSV MANAGER****
        *******************/
        function setCSV(user, csv, other){
            var item = {
                user : user,
                csv : csv,
                other : other
            };
            return $http.post('php/woocommerce/set-CSV.php', item);
        }
        function getCSV(user){
            return $http.post('php/woocommerce/get-CSV.php', user);
        }
        function deleteCSV(user, csv){
            var item = {
                user : user,
                csv_id : csv.id
            };
            return $http.post('php/woocommerce/delete-CSV.php', item);
        }
        /*******************
        ****USER MANAGER****
        *******************/
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

        /*******************
        **PASSWORD MANAGER**
        *******************/
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

