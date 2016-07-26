angular.module('app').directive('nyuListColumns', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-columns/list-columns.html',
    controllerAs: 'nyuListColumns',
    scope:{
    	entity: '@'
    },
    controller: function ($scope, $http, EntitiesService, DataService, $rootScope, $state) {
        $scope.root = $rootScope;
    	$scope.items = [];
    	$scope.leftColumn = [];
    	$scope.rightColumn = [];
        var lastLen = 0;
    	var results = [];
    	$scope.leftHeight = 0;
    	$scope.rightHeight = 0;
        $rootScope.change = 0;
        $scope.allPostsFound = 0;
        $scope.allPostsShowed = {
            total : 0,
            actual : 0
        };
        var dataFile = $scope.entity;
        if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
            dataFile = $scope.subentity;
        }

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
        
        /*DataService.all($scope.entity, "all", 0, true).then(function(posts){
            DataService.setPosts(posts, $state.current.url);
            $scope.allPostsFound = posts.length;
            //results = posts;
            //placeItemInColumn(results.shift());
        });*/

        DataService.allNoEmbed(dataFile, 'all', 0).then(function(posts){
            $scope.allPostsShowed.total = posts.length;
            $scope.allPostsShowed.actual = posts.length;
        }); 
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
        var printed = true;
        var filteredBefore = false;
        $scope.postShowed = DataService.postsCountStart;
        $scope.loadMore = function(){
            /*$scope.postShowed += DataService.postsCountStart;
            DataService.postsToShow($state.current.url, $scope.postShowed);*/
            //console.log("loadingmore");
            if($scope.loadText == 'LOAD MORE' && printed){
                printed = false;
                $scope.loadText = 'LOADING...';
                $scope.postShowed += DataService.postsCountStart;
                getMoreItem();
                DataService.postsToShow(dataFile, $scope.postShowed);
                results = [];
            }
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
                    type : dataFile,
                    toShow : DataService.postsCountStart
                };
                filter = DataService.getFilter(filter);
                var postsController = DataService.getPostsFiltered(filter);
                if(results.length === 0 || filter.db !== ''){
                    if(filter.db){
                        if(!filteredBefore) resetColumns();
                        filteredBefore = true;
                        DataService.all(dataFile, 'all', 0, true, filter.db).then(function(filtered){
                            $scope.items = filtered.slice(0, filter.toShow);
                            $scope.allPostsShowed.actual = filtered.length;
                            if(filter.text !== ''){
                                angular.forEach($scope.items, function(postItem, j){
                                    var searchCtrl = DataService.searchWord(filter.text, postItem);
                                    if(searchCtrl.found) $scope.items[j] = searchCtrl.post;
                                });
                                
                            }
                            results = $scope.items;
                            placeItemInColumn(results.shift());
                        });
                    }else{
                        if(filteredBefore) resetColumns();
                        filteredBefore = false;
                        //$scope.items = (dataFile == 'books') ? postsController.total : postsController.filter; //utilizamos el stgring db para los nuevos 
                        //$scope.items = (postsController.total.length >= DataService.postsCountStart) ? postsController.total.slice(filter.toShow-DataService.postsCountStart, filter.toShow) : postsController.total;
                        $scope.items = postsController.total;
                        $scope.allPostsShowed.actual = $scope.allPostsShowed.total;
                        results = $scope.items;
                        placeItemInColumn(results.shift());
                    }                    
                }

                

            });
        function resetColumns(){
            $scope.leftColumn = [];
            $scope.rightColumn = [];
            $scope.leftHeight = 0;
            $scope.rightHeight = 0;
        }
        function searchRepeated(item, array){
            var found = false; 
            angular.forEach(array, function(itemArray){
                if(itemArray.id == item.id) found = true;
            });
            return found;
        }
        function placeItemInColumn(item){
            var found;
        	if(typeof item !== "undefined"){
	        	if($scope.leftHeight <= $scope.rightHeight){
                    found = searchRepeated(item, $scope.leftColumn) || searchRepeated(item, $scope.rightColumn);
	        		if(!found){
                        $scope.leftColumn.push(item);
                        setupColumnItem(item,"left");
                    }else{
                        placeItemInColumn(results.shift());
                    }
	        		
	        	}else{
                    found = searchRepeated(item, $scope.leftColumn) || searchRepeated(item, $scope.rightColumn);
                    if(!found){
                        $scope.rightColumn.push(item);
                        setupColumnItem(item,"right");
                    }else{
                        placeItemInColumn(results.shift());
                    }

	        	}
			}

        }

        function setupColumnItem(item, column){
    		item.finishRendered = function(height){
    			if(item.picture !== ""){
    				height += 300;
    			}
    			$scope[column+"Height"] += height;
                placeItemInColumn(results.shift());
                if(results.length === 0) printed = true;
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
