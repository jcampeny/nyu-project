angular.module('app').directive('nyuListColumns', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-columns/list-columns.html',
    controllerAs: 'nyuListColumns',
    scope:{
    	entity: '@'
    },
    controller: function ($scope, $http, EntitiesService, DataService, $rootScope, $state) {
    	$scope.items = [];
    	$scope.leftColumn = [];
    	$scope.rightColumn = [];
        var lastLen = 0;
    	var results = [];
    	$scope.leftHeight = 0;
    	$scope.rightHeight = 0;
        $rootScope.change = 0;
        $scope.allPostsFound = 0;

        $scope.picture = '';
        $scope.picture = DataService.getMediaHeader($scope.entity);
        $rootScope.$on('mediaLoaded', function(event, data) {
            if(!$scope.picture){
                $scope.picture = DataService.getMediaHeader($scope.entity);
            }
            fadeInTitle();
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
        
    	//$http.get("/localdata/content/" + $scope.entity + ".json", { cache: true })
        //    .then(function(response) {
        //		if(response.data.results.length > 0){
        //			results = response.data.results;
        //			placeItemInColumn(results.shift());
        //		}
        //    });
        DataService.all($scope.entity, "all", 0, true).then(function(posts){
            DataService.setPosts(posts, $state.current.url);
            $scope.allPostsFound = posts.length;
            //results = posts;
            //placeItemInColumn(results.shift());
        });

        $scope.postShowed = DataService.postsCountStart;
        $scope.loadMore = function(){
            $scope.postShowed += 5;
            DataService.postsToShow($state.current.url, $scope.postShowed);
            //console.log("loadingmore");
        };
        
        $rootScope.$watch('change',
            function(value){
                var filter = {
                    targetAudience: [],
                    topic: [],
                    country: [],
                    language: [],
                    yearFrom: "",
                    yearTo: "",
                    text: "",
                    type : $state.current.url,
                    toShow : DataService.postsCountStart
                };
                
                filter = DataService.getFilter(filter);

                var postsController = DataService.getPostsFiltered(filter);
                var items = postsController.filter;
                $scope.allPostsShowed = postsController.total.length; 

                if(lastLen != items.length){
                    lastLen = items.length;
                    results = items;
                    $scope.items = [];
                    $scope.leftColumn = [];
                    $scope.rightColumn = [];
                    $scope.leftHeight = 0;
                    $scope.rightHeight = 0;
                    placeItemInColumn(results.shift());                    
                }

            });

        function placeItemInColumn(item){
        	if(typeof item !== "undefined"){
	        	if($scope.leftHeight <= $scope.rightHeight){
	        		$scope.leftColumn.push(item);
	        		setupColumnItem(item,"left");
	        	}else{
	        		$scope.rightColumn.push(item);
	        		setupColumnItem(item,"right");
	        	}
	        	$scope.items.push(item);
			}
        }

        function setupColumnItem(item, column){
    		item.finishRendered = function(height){
    			if(item.picture !== ""){
    				height += 300;
    			}
    			$scope[column+"Height"] += height;
    			placeItemInColumn(results.shift());
	    	};
        }

    	$scope.hasTopImg = function(){
    		return EntitiesService.hasTopImg($scope.entity);
    	};

    	$scope.groupItems = function(){
    		return EntitiesService.groupItems($scope.entity);
    	};

    	$scope.entityLabels = EntitiesService.getEntityLabels(); 
    }
  };
});
