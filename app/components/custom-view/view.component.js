angular.module('app').directive('customView', function ($stateParams, DataService, $state, $sce) {
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
            DataService.getFriendlyUrl().then(function(posts){
                angular.forEach(posts, function(postItem){
                    if($sce.valueOf(postItem.title) == $stateParams.id){
                        found =  true;
                        state.title = postItem.postsrelated[0].post_title;
                        state.type = postItem.postsrelated[0].post_type;
                        state.id = postItem.postsrelated[0].ID;  
                    }
                });
                if(found) {
                    $state.go("app."+state.type+'item', {id: state.id, title: state.title});
                }else{
                    $state.go("app.notfound");
                }
            });
        }
    };
});
