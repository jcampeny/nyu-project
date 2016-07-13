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
        var filesSearch = [];
    	$scope.root = $rootScope;
    	$rootScope.mobileShowFilters = false;
    	$scope.entitiesService = EntitiesService;
        $scope.entityLabels = EntitiesService.getEntityLabels();
        $scope.loadText = 'LOAD MORE';

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
        //var filter = DataService.getFilter(dataFile);
        function getFiles(posts){
            angular.forEach(posts, function(postItem, i){
                DataService.getPdfXls(postItem).then(function(item){
                    //if(i == posts.length-1){
                        DataService.setPosts(posts, dataFile, true);
                        $rootScope.change++;
                    //}
                });                    
            });
        }
        getMoreItem();
        function getMoreItem(){
            var actualPage =  ($scope.postShowed / DataService.postsCountStart) || 1;
            var perPage = DataService.postsCountStart;
            if(dataFile == 'books'){
                actualPage = 1;
                perPage = 100;
            }
            DataService.all(dataFile, perPage, actualPage, true).then(function(posts){
                $scope.allPostsFound += posts.length;
                DataService.setPosts(posts, dataFile, false, true);
                $rootScope.change++;
                getFiles(posts); 
                $scope.loadText = 'LOAD MORE';
            });   

        }
        $scope.allPostsShowed = {
            total : 0,
            actual : 0
        };
        DataService.allNoEmbed(dataFile, 'all', 0).then(function(posts){
            $scope.allPostsShowed.total = posts.length;
            $scope.allPostsShowed.actual = posts.length;
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
                    type : dataFile,
                    toShow : DataService.postsCountStart
                };
                filter = DataService.getFilter(filter);
                var postsController = DataService.getPostsFiltered(filter);
                if(filter.db){
                    DataService.all(dataFile, 'all', 0, true, filter.db).then(function(filtered){
                        $scope.items = filtered.slice(0, filter.toShow);
                        $scope.allPostsShowed.actual = filtered.length;
                        if(filter.text !== ''){
                            angular.forEach($scope.items, function(postItem, j){
                                var searchCtrl = DataService.searchWord(filter.text, postItem);
                                if(searchCtrl.found) $scope.items[j] = searchCtrl.post;
                            });
                            
                        }
                    });
                }else{
                    //$scope.items = (dataFile == 'books') ? postsController.total : postsController.filter; //utilizamos el stgring db para los nuevos  
                    if(dataFile == "globepresentations" || dataFile == "globenotes") {
                        $scope.items = postsController.total.slice(0, 1);
                    }else{
                        $scope.items = postsController.total;
                    }
                    
                    $scope.allPostsShowed.actual = $scope.allPostsShowed.total;
                }
               
                //inciamos al principio i nunca mas sin el embed
            });

        $scope.postShowed = (dataFile == 'books') ? 100 :  DataService.postsCountStart;
        $scope.loadMore = function(){
            if($scope.loadText == 'LOAD MORE'){
                $scope.loadText = 'LOADING...';
                $scope.postShowed += 5;
                getMoreItem();
                DataService.postsToShow(dataFile, $scope.postShowed);
            }

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
