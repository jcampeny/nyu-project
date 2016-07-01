angular.module('app').directive('nyuList', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list/list.html',
    controllerAs: 'nyuList',
    scope:{
    	entity: '@',
    	subentity: '@'
    },

    controller: function ($scope, $rootScope, $http, $window, EntitiesService, DataService, $state) {
    	$scope.root = $rootScope;
    	$rootScope.mobileShowFilters = false;
    	$scope.entitiesService = EntitiesService;

        $scope.entityLabels = EntitiesService.getEntityLabels();

        var dataFile = $scope.entity;
        if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
            dataFile = $scope.subentity;
        }

        $scope.allPostsFound = 0;
        $scope.items = [];
        $rootScope.change = 0;
        //var filter = DataService.getFilter($state.current.url);

        DataService.all(dataFile, "all", 0, true).then(function(posts){
            $scope.allPostsFound = posts.length;
            DataService.setPosts(posts, $state.current.url);
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
                    text : "",
                    type : $state.current.url,
                    toShow : DataService.postsCountStart
                };
                filter = DataService.getFilter(filter);
                $scope.items = DataService.getPostsFiltered(filter);

            });

        $scope.postShowed = DataService.postsCountStart;
        $scope.loadMore = function(){
            $scope.postShowed += 5;
            DataService.postsToShow($state.current.url, $scope.postShowed);
            //console.log("loadingmore");
        };




    	//$http.get("/localdata/content/" + dataFile + ".json", { cache: true })
        //    .then(function(response) {
        //        $scope.items = response.data.results;
        //    });


        
        $scope.getTopTitle = function(){
            var title = $scope.entityLabels[$scope.entity].name;
            
            if($scope.entity === "globecourse" && dataFile !== $scope.entity){
                angular.forEach($scope.entityLabels[$scope.entity].suboptions, function(option){
                    if(option.id == dataFile){
                        title = option.name;
                    }
                });
            }

            return title;
        };

		$scope.hasTopImg = function(){
    		return EntitiesService.hasTopImg(dataFile);
    	};

    	$scope.groupItems = function(){
    		return EntitiesService.groupItems($scope.entity);
    	};
    }
  };
});
