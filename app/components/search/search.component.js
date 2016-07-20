angular.module('app').directive('nyuSearch', function () {
    return {
    restrict: 'E',
    templateUrl: '../app/components/search/search.html',
    controllerAs: 'nyuSearch',
    scope:{
        entity: '@',
        subentity: '@'
    },
    controller: function ($scope, $rootScope, $http, $window, EntitiesService, DataService, $state) {
        $scope.root = $rootScope;
        $rootScope.mobileShowFilters = false;
        $scope.entitiesService = EntitiesService;
        $scope.items = [];
        $scope.allItems = [];
        $rootScope.change = 0;
        $scope.order = 'relevant';
        $scope.allPostsFound = 0;
        $scope.loadText = 'LOAD MORE';
        $scope.allPostsShowed = {
            total : 0,
            actual : 0
        };
        $( ".input-container > input" ).val(DataService.getGlobalSearch());
        var dataFile = $scope.entity;
        if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
            dataFile = $scope.subentity;
        }


        function decoratePosts(){
            switch($scope.order){
                case 'relevant':
                    var temporalCP = [];
                    for (var key in $scope.allItems) {
                        for (var cp in $scope.allItems[key]){
                            temporalCP.push($scope.allItems[key][cp]);
                        }
                    }
                    if(Object.keys($scope.allItems).length == DataService.customPosts.length){
                        DataService.setPosts(temporalCP, $state.current.url);
                        $scope.allPostsFound = temporalCP.length;
                    }  
                    break;
                default:
                    $scope.items = [];
            }
        }
        $scope.postShowed = $scope.allPostsShowed.total;
        $scope.loadMore = function(){
            //$scope.postShowed += 5;
            DataService.postsToShow($state.current.url, $scope.allPostsShowed.total);
            //console.log("loadingmore");
        };
        $scope.$watch(function(){return Object.keys($scope.allItems).length;},
            function(){
                //decoratePosts();
            });
        $rootScope.$watch('change',
            function(value){
                var filter = {
                    targetAudience: [],
                    topic: [],
                    country: [],
                    language: [],
                    yearFrom: "",
                    yearTo: "",
                    text : DataService.getGlobalSearch(),
                    type : dataFile,
                    toShow : $scope.allPostsShowed.total
                };
                $scope.items = [];
                filter = DataService.getFilterDB(filter);
                $rootScope.searchGlobal = 0;
                $scope.allPostsShowed.total = 0;
                $scope.allPostsShowed.actual = 0;
                var temporalPosts = [];
                if(filter){
                    DataService.allCustomPosts( "all", 0, true, filter).then(function(posts){
                        var promiseDone = 0;
                        angular.forEach(DataService.customPosts, function(customPost, i){
                            posts[customPost].then(function(post){
                                //$scope.allItems[customPost] = post;
                                promiseDone++;
                                $scope.allPostsShowed.total += post.length;
                                $scope.allPostsShowed.actual += post.length;
                                angular.forEach(post, function(postItem, j){
                                    temporalPosts.push(postItem);
                                    var searchCtrl = DataService.searchWord(DataService.getGlobalSearch(), postItem);
                                    if(searchCtrl.found) temporalPosts[j] = searchCtrl.post; 
                                });
                                //TODO NADA FOUND
                                //console.log( temporalPosts);
                                if(promiseDone == DataService.customPosts.length){
                                    refreshItems(temporalPosts, true);
                                }else{
                                    refreshItems(temporalPosts, false);  
                                } 
                             
                            });
                        });
                    });                    
                }
                    


               // $scope.allPostsShowed.actual = $scope.allPostsShowed.total;

        });
        function refreshItems(temporalPosts, finished){
            temporalPosts.sort(compare);
            angular.forEach(temporalPosts, function(a){
                var found = false;
                angular.forEach($scope.items, function(b){
                    if(b.id == a.id){
                        found = true;
                    }
                });
                if(!found){
                    $scope.items.push(a);
                }
            });
            if(finished && $scope.items.length === 0){
                $rootScope.searchGlobal = -1;
            }else{
                $rootScope.searchGlobal = $scope.items.length;    
            }
            function compare(a,b) {
              if (a.relevance < b.relevance)
                return 1;
              if (a.relevance > b.relevance)
                return -1;
              return 0;
            }
        }
        $scope.hasTopImg = function(){
            return EntitiesService.hasTopImg($scope.entity);
        };

        $scope.groupItems = function(){
            return;
        };

        $scope.entityLabels = EntitiesService.getEntityLabels();
        }

    };
});
