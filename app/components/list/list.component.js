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
        /*MEDIA CONTROLLER*/
        $scope.picture = '';
        $scope.picture = DataService.getMediaHeader($scope.entity);
        $rootScope.$on('mediaLoaded', function(event, data) {
            if(!$scope.picture){
                $scope.picture = DataService.getMediaHeader($scope.entity);
                fadeInTitle();
            }
        });
        function fadeInTitle(){
            if($scope.picture){
                setTimeout(function(){
                    $('.gradient').delay(400).animate({
                        opacity : '1'
                    },500);
                    $('.line-title').delay(600).animate({
                        opacity : '1',
                        y : '20px'
                    },500);    
                },300);            
            }
        }
        $rootScope.$on('$stateChangeSuccess',function(){fadeInTitle();});
        fadeInTitle();
        /*END MEDIA CONTROLLER*/
        $scope.allPostsFound = 0;
        $scope.items = [];
        $rootScope.change = 0;
        //var filter = DataService.getFilter($state.current.url);

        DataService.all(dataFile, "all", 0, true).then(function(posts){
            $scope.allPostsFound = posts.length;
            angular.forEach(posts, function(postItem, i){
                DataService.getPdfXls(postItem).then(function(item){
                    if(i == posts.length-1){
                        DataService.setPosts(posts, $state.current.url);
                    }
                });
            });
            
            
            
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
                var postsController = DataService.getPostsFiltered(filter);
                $scope.items = ($state.current.url == 'books') ? postsController.total : postsController.filter;
                $scope.allPostsShowed = postsController.total.length; 
            });

        $scope.postShowed = ($state.current.url == 'books') ? 20 :  DataService.postsCountStart;
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
