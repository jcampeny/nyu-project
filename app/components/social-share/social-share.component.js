/*angular.module('app').directive('socialShare', function () {*/
angular.module('app').directive('socialShare', ['$state','$location', function($state, $location){
    return {
        restrict: 'E',
        templateUrl: '../app/components/social-share/social-share.html',
        scope:{
            entity: '@',
            id : '@',
            title : '@',
            content : '@',
            picture : '@',
            type : '@'
        },
        link : function (s, e, a){
            s.getUrl = function (){
                if(s.type == 'general'){
                       return $location.$$absUrl;
                }else {
                    if(s.type == 'item'){
                        return $location.$$absUrl;  
                    }else{
                        return $location.$$absUrl + '/' + s.id + '/' + window.encodeURIComponent(s.title).replace(/%20/g,'+');                    
                    }                    
                }


            };
        }
    };
}]);
