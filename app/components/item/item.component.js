angular.module('app').directive('nyuItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/item/item.html',
    controllerAs: 'nyuItem',
    scope: {
		entity    : '@',
		subentity : '@'
    },

    controller: function ($scope, $http, EntitiesService, ArrayService, DataService, $stateParams) {
    	$scope.item = null;
    	$scope.related = [];

    	var dataFile = $scope.entity;
    	if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
    		dataFile = $scope.subentity;
    	}

    	$http.get("/localdata/content/" + dataFile + ".json", { cache: true })
            .then(function(response) {
        		if(response.data.results.length > 0){
    				$scope.item = response.data.results.shift();
        			$scope.related = response.data.results;
        		}
            });

        // DataService.all(dataFile, "all", 0, true).then(function(posts){
        //     var log = [];
        //     angular.forEach(posts, function(post, i){
        //         if($stateParams.id == post.id){
        //             console.log(post);
        //             $scope.item = post;
        //         }else{
        //             this.push(post);
        //         }
        //     }, log);
        //     $scope.related = log;
        // });

    	$scope.hasTopImg = function(){
    		return EntitiesService.hasTopImg($scope.entity);
    	};

    	$scope.groupItems = function(){
    		return EntitiesService.groupItems($scope.entity);
    	};

    	$scope.entityLabels = EntitiesService.getEntityLabels();

    	$scope.hasItemInfo = function(){
    		return $scope.item !== null && (
    				$scope.item.publicationType !== "" ||
    				$scope.item.publication !== "" ||
    				$scope.item.publisher !== "" ||
    				$scope.item.date !== "" ||
    				$scope.item.pages !== "" ||
    				$scope.item.other !== ""
    			);
    			
    	};
    }
  };
});
