
 angular
    .module('app')
    .service('FiltersService', ['$http', '$q', function($http, $q){
        var minComtradeYear = 1990;
        var minWBYear = 1960;
        var minIMFYear = 2009;
        var proxyIMF = "/php/curl-proxy.php";

        return {
            getComtradeCountries : getComtradeCountries,
            getComtradeYears     : getComtradeYears,
            getBEC               : getBEC,
            getHS                : getHS,
            getSITC              : getSITC,
            getTypes             : getTypes,
            getWBCountries       : getWBCountries,
            getWBYears           : getWBYears,
            getWBTopics          : getWBTopics,
            getWBIndicators      : getWBIndicators,
            getIMFYears          : getIMFYears,
            getIMFDatasets       : getIMFDatasets,
            getIMFParamList      : getIMFParamList,
            getIMFParam          : getIMFParam
        };       
       
        /* COMTRADE */
        function getComtradeCountries() {
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

        function getComtradeYears(){
            var years = [];
            var todayYear = (new Date()).getFullYear();

            for(var i=minComtradeYear ; i<=todayYear ; i++){
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

        /* WORLD BANK */
        function getWBYears(){
            var years = [];
            var todayYear = (new Date()).getFullYear();

            for(var i=minWBYear ; i<=todayYear ; i++){
                years.push(i);
            }
            return years;
        }

        function getWBCountries() {
            var deferred = $q.defer();

            $http
                .get("/localdata/wb_countries.json", 
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

        function getWBTopics() {
            var deferred = $q.defer();

            $http
                .get("/localdata/wb_topics.json", 
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

        function getWBIndicators() {
            var deferred = $q.defer();

            $http
                .get("/localdata/wb_indicators.json", 
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

        /* IMF */
        function getIMFYears(){
            var years = [];
            var todayYear = (new Date()).getFullYear();

            for(var i=minIMFYear ; i<=todayYear ; i++){
                years.push(i);
            }
            return years;
        }

        function getIMFDatasets(request){
            var url = "http://dataservices.imf.org/REST/SDMX_JSON.svc/Dataflow/";
            var deferred = $q.defer();

            $http
                .post(proxyIMF, {url: url},{ cache: true })
                .then(function(response) {
                    if(response.status == 200){
                        if(response.data.Structure.KeyFamilies.KeyFamily.length > 0){
                            deferred.resolve(response.data.Structure.KeyFamilies.KeyFamily);
                        }
                    }else {
                        deferred.reject(response.statusText);
                    }
                });
            return deferred.promise;
        }

        function getIMFParamList(dataset){
            var url = "http://dataservices.imf.org/REST/SDMX_JSON.svc/DataStructure/"+dataset;
            var deferred = $q.defer();

            $http
                .post(proxyIMF, {url: url},{ cache: true })
                .then(function(response) {
                    if(response.status == 200){
                        if(response.data.Structure.KeyFamilies.KeyFamily.Components.Dimension.length > 0){
                            deferred.resolve(response.data.Structure.KeyFamilies.KeyFamily.Components.Dimension);
                        }
                    }else {
                        deferred.reject(response.statusText);
                    }
                });
            return deferred.promise;
        }
        
        function getIMFParam(param) {
            var url = "http://dataservices.imf.org/REST/SDMX_JSON.svc/CodeList/"+param;
            var deferred = $q.defer();

            $http
                .post(proxyIMF, {url: url},{ cache: true })
                .then(function(response) {
                    if(response.status == 200){
                        if(response.data.Structure.CodeLists.CodeList.Code.length > 0){
                            deferred.resolve(response.data.Structure.CodeLists.CodeList);
                        }
                    }else {
                        deferred.reject(response.statusText);
                    }
                });
            return deferred.promise;
        }
    }]);




