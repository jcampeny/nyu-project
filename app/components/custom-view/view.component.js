angular.module('app').directive('customView', function ($stateParams, DataService, $state, $sce, $location) {
    return {
        restrict: 'E',
        template: '',
        link : function (s, e, a){
            var state = {
                title : '',
                type : '',
                id : ''
            };
            var found = false;
            var newUrl = '';
            DataService.getFriendlyUrl().then(function(posts){
                angular.forEach(posts, function(postItem){
                    if($sce.valueOf(postItem.title) == $stateParams.id){
                        found =  true;
                        
                        newUrl = DataService.htmlToPlaintext($sce.valueOf(postItem.content));

                        //state.title = postItem.postsrelated[0].post_title;
                        //state.type = postItem.postsrelated[0].post_type;
                        //state.id = postItem.postsrelated[0].ID;  
                    }
                });
                if(found) {
                    $location.path(newUrl.replace(/(\r\n|\n|\r)/gm,""));
                }else{
                    $state.go("app.notfound");
                }
            });
        }
    };
});
