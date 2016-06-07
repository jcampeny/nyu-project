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
    .service('ApiService', ['$http', '$q', function($http, $q){
        var minYear = 1990;

        return {
            getCountries : getCountries,
            getBEC       : getBEC,
            getHS        : getHS,
            getSITC      : getSITC,
            getYears     : getYears,
            getTypes     : getTypes
        };
       
        function getCountries() {
            var deferred = $q.defer();

            $http
                .get("/localdata/comtrade_countries.json", 
                    { cache: true })
                .then(function(response) {
                    if (response.data.results instanceof Array) {
                        deferred.resolve(response.data.results);
                    } else {
                        deferred.reject("Data is not an arrray");
                    }
                });
            return deferred.promise;
        }

        function getBEC(parent) {
            var deferred = $q.defer();

            $http
                .get("/localdata/bec.json", { cache: true })
                .then(function(response) {
                    if (response.data.results instanceof Array) {
                        var categories = [];

                        angular.forEach(response.data.results,function(c){
                            if(typeof parent === "undefined" || c.parent === parent || (parent === "ALL" && c.parent === "#")){
                                categories.push(c);    
                            }
                        });
                        return deferred.resolve(categories);
                    } else {
                        deferred.reject("Data is not an arrray");
                    }
                });

            return deferred.promise;
        }

        function getHS(parent) {
            var deferred = $q.defer();

            $http
                .get("/localdata/hs.json", { cache: true })
                .then(function(response) {
                    if (response.data.results instanceof Array) {
                        var categories = [];

                        angular.forEach(response.data.results,function(c){
                            if(typeof parent === "undefined" || parent === "ALL"){
                                if(c.id.length < 3){
                                    categories.push(c);
                                }
                            }else if(c.id.indexOf(parent) === 0 && c.id.length == parent.length+2){
                                categories.push(c);
                            }
                        });
                        return deferred.resolve(categories);
                    } else {
                        deferred.reject("Data is not an arrray");
                    }
                });

            return deferred.promise;
        }

        function getSITC(parent) {
            var deferred = $q.defer();

            $http
                .get("/localdata/sitc.json", { cache: true })
                .then(function(response) {
                    if (response.data.results instanceof Array) {
                        var categories = [];

                        angular.forEach(response.data.results,function(c){
                            if(typeof parent === "undefined" || parent === "ALL"){
                                if(c.id.length < 2){
                                    categories.push(c);
                                }
                            }else if(parent.length < 3 && c.id.indexOf(parent) === 0 && c.id.length == parent.length+1){
                                categories.push(c);
                            }else if(parent.length === 3 && c.id.indexOf(parent) === 0 && c.id.length > parent.length){
                                categories.push(c);
                            }
                        });
                        return deferred.resolve(categories);
                    } else {
                        deferred.reject("Data is not an arrray");
                    }
                });

            return deferred.promise;
        }

        function getYears(){
            var years = [];
            var todayYear = (new Date()).getFullYear();

            for(var i=minYear ; i<=todayYear ; i++){
                years.push(i);
            }
            return years;
        }

        function getTypes(){
            return [
                {id:"C", text: "Comodity"},
                {id:"S", text: "Service"}
            ];
        }
        
    }]);




