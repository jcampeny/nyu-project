/**
 * The BlogService retrieves and processes the json response from WP-API into a form that Angular can use.
 *
 * @param $http
 * @param $sce
 * @param config
 * @returns {{allPosts: allPosts, allPostsByTag: allPostsByTag, allPostsBySearchTerm: allPostsBySearchTerm, featuredPosts: featuredPosts, post: post}}
 * @constructor
 */
 angular
    .module('app')
    .service('LoginService', ['$http', '$sce'/*, 'config'*/,'$state', '$q', '$rootScope', 'deviceDetector', '$localStorage', function($http, $sce/*, config*/, $state, $q, $rootScope, deviceDetector, $localStorage){
        
        var woopath = "http://nyu.com/wordpress/wp-json/wc/v1/products";

        return {
            getDataWoo : getDataWoo,
            createUser : createUser

        };

        function getDataWoo() {
            var items ={};
            return $http
                //.get('/php/woocommerce/create-user.php', items)
                .get('/wordpress/wp-content/themes/twentysixteen/ajax-login.php', items)
                .then(function(response){
                    console.log(response);
                    return response.data;
                });
        }

        function createUser(){
            var user = {
                id : Math.random(1)*100,
                name : 'pepito',
                pass : 'xxx',
                permissions : 'all'
            };
            //console.log($localStorage.LocalMessage);
            $localStorage.LocalMessage = user;
            //console.log($localStorage.LocalMessage);
            //console.log($localStorage.id);
        }
        
    }]);

