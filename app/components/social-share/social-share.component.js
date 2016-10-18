/*angular.module('app').directive('socialShare', function () {*/
angular.module('app').directive('socialShare', ['$state','$location', '$rootScope', function($state, $location, $rootScope){
    return {
        restrict: 'E',
        templateUrl: '../app/components/social-share/social-share.html',
        scope:{
            entity: '@',
            id : '@',
            title : '@',
            content : '@',
            picture : '@',
            type : '@',
            isDataViz : '@',
            shareLink : '@'
        },
        link : function (s, e, a){
            s.getUrl = function (){
                if(!s.isDataViz){
                    if(s.type == 'general'){
                           return $location.$$absUrl;
                    }else {
                        if(s.type == 'item'){
                            return $location.$$absUrl;  
                        }else{
                            return $location.$$absUrl + '/' + s.id + '/' + window.encodeURIComponent(s.title).replace(/%20/g,'+');                    
                        }                    
                    }                    
                }else{
                    return s.shareLink;
                }

            };
        }
    };
}]);
