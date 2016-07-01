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

        DataService.allCustomPosts( "all", 0, true).then(function(posts){
            angular.forEach(DataService.customPosts, function(customPost, i){
                posts[customPost].then(function(post){
                    $scope.allItems[customPost] = post;
                    //console.log($scope.allItems[customPost]);
                });
            });   

        });

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
                    }  
                    break;
                default:
                    $scope.items = [];
            }
        }

        $scope.$watch(function(){return Object.keys($scope.allItems).length;},
            function(){
                decoratePosts();
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
                    type : $state.current.url
                };
                filter = DataService.getFilter(filter);
                $scope.items = DataService.getPostsFiltered(filter);
        });
      
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
