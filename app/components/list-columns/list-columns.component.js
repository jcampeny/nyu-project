angular.module('app').directive('nyuListColumns', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-columns/list-columns.html',
    controllerAs: 'nyuListColumns',
    scope:{
    	entity: '@'
    },
    controller: function ($scope, $http) {
    	$scope.items = [];
    	$scope.leftColumn = [];
    	$scope.rightColumn = [];

    	var results = [];
    	$scope.leftHeight = 0;
    	$scope.rightHeight = 0;

    	$http.get("/localdata/content/" + $scope.entity + ".json", { cache: true })
            .then(function(response) {
        		if(response.data.results.length > 0){
        			results = response.data.results;
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


    	var entitiesImgTop = ["articles","blog","cases","global","globecourse","mediakit","notes","other","podcasts","press","surveys","videos","working"];
    	$scope.hasTopImg = function(){
    		return entitiesImgTop.indexOf($scope.entity) >= 0;
    	};

    	$scope.entityLabels = {
    		books:{name: "Books", group: "Publications", state: "app.books"},
    		global:{name: "Globalization Index Reports", group: "Publications", state: "app.global"},
    		articles:{name: "Articles & Book Chapters", group: "Publications", state: "app.articles"},
    		working:{name: "Working Papers", group: "Publications", state: "app.working"},
    		blog:{name: "Blog", group: "Publications", state: "app.blog"},

    		videos:{name: "Videos", group: "News & Media", state: "app.videos"},
    		podcasts:{name: "Podcasts", group: "News & Media", state: "app.podcasts"},
    		press:{name: "Press", group: "News & Media", state: "app.press"},
    		mediakit:{name: "Media Kit", group: "News & Media", state: "app.mediakit"},

    		globecourse:{name: "GLOBE Course", group: "Teaching Materials", state: "app.globecourse"},
    		cases:{name: "Cases & Teaching Notes", group: "Teaching Materials", state: "app.cases"},
    		notes:{name: "Globalization Notes", group: "Teaching Materials", state: "app.notes"},
    		surveys:{name: "Surveys", group: "Teaching Materials", state: "app.surveys"},
    		other:{name: "Other Teaching Materials", group: "Teaching Materials", state: "app.other"}

    	};

    	$scope.groupItems = function(){
    		var items = [];
    		var thisGroup = $scope.entityLabels[$scope.entity].group;

    		for (var item in $scope.entityLabels) {
			    if ($scope.entityLabels.hasOwnProperty(item) && $scope.entityLabels[item].group === thisGroup) {
			        items.push($scope.entityLabels[item]);
			    }
			}

    		return items;
    	};
    }
  };
});
