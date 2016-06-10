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
        
        var comtradeConfig = {
            max  : 5000,
            freq : "A"
        };

        var wbConfig = {
            max  : 5000
        };        

        var imfConfig = {
            proxyIMF : "/php/curl-proxy.php"
        };

        return {
            comtrade  : comtrade,
            worldBank : worldBank,
            imf       : imf
        };
       
        function comtrade(request) {
            var url = "http://comtrade.un.org/api/get?"+
                        "max="+comtradeConfig.max+
                        "&type="+request.type+
                        "&freq="+comtradeConfig.freq+
                        "&px="+request.codification+
                        "&ps="+request.year+
                        "&r="+request.countryFrom+
                        "&p="+request.countryTo+
                        "&cc="+request.code+
                        "&rg=all&fmt=json";

            var deferred = $q.defer();

            $http
                .get(url, { cache: true })
                .then(function(response) {
                    if(response.status == 200){
                        if(response.data.validation.status.value === 0){
                            deferred.resolve(response.data.dataset);    
                        }else{
                            deferred.reject(response.data.validation.status.description);    
                        }
                        
                    
                    }else {
                        deferred.reject(response.statusText);
                    }
                });
            return deferred.promise;
        }

        function worldBank(request){
            var url = "http://api.worldbank.org/countries/";

            if(request.country !== null){
                url += request.country+"/";
            }
                      
            url += "indicators/"+request.indicator+"?"+
                        "per_page="+wbConfig.max+
                        "&date="+request.yearFrom+":"+request.yearTo+
                        "&format=jsonp&prefix=JSON_CALLBACK";

            var deferred = $q.defer();

            $http
                .jsonp(url, { cache: true })
                .then(function(response) {
                    if(response.status == 200){
                        if(response.data[0].total > 0 && response.data[1] !== null){
                            deferred.resolve(response.data[1]);    
                        }else{
                            deferred.reject("NO DATA");    
                        }
                    }else {
                        deferred.reject(response.statusText);
                    }
                });
            return deferred.promise;
        }
        
        function imf(request){
            var url = "http://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/"+request.dataset+"/";
                      
            angular.forEach(request.params,function(pv){
                url += pv+".";
            });

            url += "?startPeriod="+request.yearFrom+"&endPeriod="+request.yearTo;

            var deferred = $q.defer();

            $http
                .post(imfConfig.proxyIMF, {url: url}, { cache: true })
                .then(function(response) {
                    if(response.status == 200){
                        if(typeof response.data.CompactData.DataSet.Series !== "undefined"){
                            if(Array.isArray(response.data.CompactData.DataSet.Series)){
                                angular.forEach(response.data.CompactData.DataSet.Series,function(serie){
                                    if(!Array.isArray(serie.Obs)){
                                        serie.Obs = [serie.Obs];
                                    }
                                });
                                deferred.resolve(response.data.CompactData.DataSet.Series);
                            }else{
                                if(!Array.isArray(response.data.CompactData.DataSet.Series.Obs)){
                                    response.data.CompactData.DataSet.Series.Obs = [response.data.CompactData.DataSet.Series.Obs];
                                } 
                                deferred.resolve([response.data.CompactData.DataSet.Series]);
                            }
                        }else{
                            deferred.reject("NO DATA");    
                        }
                    }else {
                        deferred.reject(response.statusText);
                    }
                });
            return deferred.promise;
        }
    }]);




