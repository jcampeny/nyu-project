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

    	//$http.get("/localdata/content/" + $scope.entity + ".json", { cache: true })
        //    .then(function(response) {
        //		if(response.data.results.length > 0){
        //			results = response.data.results;
        //			placeItemInColumn(results.shift());
        //		}
        //    });
        DataService.all($scope.entity, "all", 0, true).then(function(posts){
            DataService.setPosts(posts, $state.current.url);
            
            //results = posts;
            //placeItemInColumn(results.shift());
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
                    text: "",
                    type : $state.current.url
                };
                
                filter = DataService.getFilter(filter);

                var items = DataService.getPostsFiltered(filter);
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
