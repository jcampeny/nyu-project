angular.module('app').directive('nyuFilter', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/filter/filter.html',
    controllerAs: 'nyuFilter',
    scope: {
    	entity: '@'
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService, DataService, $state, deviceDetector) {
    	$scope.root = $rootScope;
    	$scope.entitiesService = EntitiesService;
        $scope.totalPosts = 0;
    	//$scope.filterData = {}; //getfilternormla
        $scope.loadedSearch = true;
        var dataFile = $scope.entity;
        if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
            dataFile = $scope.subentity;
        }
        /**/
        function ekdHighLight(word, theString){
        	var rgxp = new RegExp(word, 'gi');
        	var position = theString.search(rgxp);
        	var output = [
        		theString.slice(0, position), 
        		'<span class="highlight-class">', 
        		theString.slice(position, position+word.length), 
        		'</span>', 
        		theString.slice(position+word.length)
        		].join('');
        	return output;
        }
        /**/
        $scope.searchIt = function(){
            //DataService.searchOnPosts($scope.filterData);
            $rootScope.change++;//possible comment
            $scope.itemsFound = (DataService.getPostsFiltered($scope.filterData)) ? DataService.getPostsFiltered($scope.filterData).total.length : 0;

        };

        $scope.searchBefore = function(){
            return $scope.filterData.db || !deviceDetector.isMobile();
        };
        $scope.isMobile = function(){
            return deviceDetector.isMobile();
        };
		$scope.filterData = {
    		targetAudience: [],
    		topic: [],
    		country: [],
    		language: [],
    		yearFrom: "",
    		yearTo: "",
            toShow : DataService.postsCountStart,
    		text : (dataFile == 'search') ? DataService.getGlobalSearch() : "",
    		type : dataFile,
            db : ''
    	};//app.search

    	$scope.filterData = DataService.getStateFilter($scope.filterData);
    	$scope.itemsFound = 0;
    	$scope.clearFilters = function(){
			$scope.filterData = {
	    		targetAudience: [],
	    		topic: [],
	    		country: [],
	    		language: [],
	    		yearFrom: "",
	    		yearTo: "",
                toShow : DataService.postsCountStart,
	    		text : (dataFile == 'search') ? DataService.getGlobalSearch() : "",
	    		type : dataFile
	    	};
	    	DataService.resetFilter($scope.filterData);
	    	$rootScope.change++;//possible comment
	    	$scope.itemsFound = (DataService.getPostsFiltered($scope.filterData)) ? DataService.getPostsFiltered($scope.filterData).total.length : 0;
    	};
    	//$scope.clearFilters();
    	//Get all targetAudience
    	DataService.all('audience', 'all', 0, false).then(function(tags){
    		angular.forEach(tags, function(tag){
    			var tag_audience = {
    				id : tag.id,
    				text : tag.name
    			};
    			$scope.dataSRC.targetAudience.push(tag_audience);
    		});
    	});

    	//Get Topicmedia?page=1&per_page=1&filter[taxonomy]=header-media
    	DataService.all('topic', 'all', 0, false).then(function(tags){
    		angular.forEach(tags, function(tag){
    			var tag_topic = {
    				id : tag.id,
    				text : tag.name
    			};
    			$scope.dataSRC.topic.push(tag_topic);
    		});
    	});

    	//Get Country
    	DataService.all('country', 'all', 0, false).then(function(tags){
    		angular.forEach(tags, function(tag){
    			var tag_country = {
    				id : tag.id,
    				text : tag.name
    			};
    			$scope.dataSRC.country.push(tag_country);
    		});
    	});

    	//Get Language
    	DataService.all('language', 'all', 0, false).then(function(tags){
    		angular.forEach(tags, function(tag){
    			var tag_language = {
    				id : tag.id,
    				text : tag.name
    			};
    			$scope.dataSRC.language.push(tag_language);
    		});
    	});

        $scope.$watch(
        	function (){
        		if(!$scope.filterData){
        			return -1;
        		}else{
	        		return  $scope.filterData.country.length + 
	        				$scope.filterData.targetAudience.length +
	        				$scope.filterData.language.length + 
	        				$scope.filterData.topic.length +
	        				$scope.filterData.yearFrom +
	        				$scope.filterData.yearTo +
	        				$scope.filterData.text +
                            $scope.filterData.toShow + 
	        				DataService.getPosts().length +
                            DataService.getGlobalSearch().length;
        			}
        	},
            function(value){
                $scope.loadedSearch = false;
                $scope.filterData.text = (dataFile == 'search') ? DataService.getGlobalSearch() : $scope.filterData.text;
            	DataService.setFilter($scope.filterData);
            	$rootScope.change++;//possible comment
                //var lengthPosts = (DataService.getPostsFiltered($scope.filterData)) ? DataService.getPostsFiltered($scope.filterData).total.length : 0;
                /*if(DataService.getPostsFiltered($scope.filterData)) {
                    $scope.totalPosts = (lengthPosts > $scope.totalPosts) ? lengthPosts : $scope.totalPosts; 
                }*/
                //$scope.itemsFound = (DataService.getPostsFiltered($scope.filterData)) ? DataService.getPostsFiltered($scope.filterData).total.length : 0;
                $scope.filterData.db = DataService.getFilterDB($scope.filterData);
                if($scope.filterData.type != 'globalization-index-reports' && 
                    $scope.filterData.type != 'working-papers' &&
                    $scope.filterData.type.indexOf('globe-course') == -1 && 
                    $scope.filterData.type != 'cases-teaching-notes' &&
                    $scope.filterData.type != 'globalization-notes' &&
                    $scope.filterData.type != 'other-teaching-materials' 
                    ){
                    if($scope.filterData.db){
                        DataService.all($scope.filterData.type, 'all', 0, true, $scope.filterData.db).then(function(filtered){
                            $scope.itemsFound = filtered.length;
                            $scope.loadedSearch = true;
                        });   
                    }else{
                        DataService.allNoEmbed($scope.filterData.type, 'all', 0).then(function(posts){
                            $scope.itemsFound = posts.length;
                            $scope.loadedSearch = true;
                        }); 
                    }
                }
            });

    	$scope.dataSRC = {
    		targetAudience: [
	    		/*{id: 1, text: "Instructors"},
	    		{id: 2, text: "Researchers"},
	    		{id: 3, text: "Professors"},
	    		{id: 4, text: "Students"}*/
	    	],
	    	topic: [
	    		/*{id: 1, text: "Business Leaders"},
	    		{id: 2, text: "Modality"},
	    		{id: 3, text: "Commodity"},*/
	    	],
	    	country: [
	    		/*{id: 1,  text: "Argentina"},
	    		{id: 2,  text: "Australia"},
	    		{id: 3,  text: "Austria"},
	    		{id: 4,  text: "Chile"},
	    		{id: 5,  text: "China"},
	    		{id: 6,  text: "Dominica"},
	    		{id: 7,  text: "Dominican Republic"},
	    		{id: 8,  text: "United Arab Emirates"},
	    		{id: 9,  text: "United States"},
	    		{id: 10, text: "United Kingdom"}*/
	    	],
	    	language: [
	    		/*{id: 1, text: "English"},
	    		{id: 2, text: "Spanish"},
	    		{id: 3, text: "Chinese"},*/
	    	],
	    	years: []
    	};

    	var todayYear = (new Date()).getFullYear();
    	for(var i=1990 ; i<=todayYear ; i++){
    		$scope.dataSRC.years.push(i);
    	}

    	$scope.filterAutocomplete = function(query, field){
    		var deferred = $q.defer();
		    deferred.resolve( $filter('filter')($scope.dataSRC[field], query));
		    return deferred.promise;
    	};
    }
  };
});
