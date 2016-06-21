angular.module('app').directive('nyuItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/item/item.html',
    controllerAs: 'nyuItem',
    scope: {
		entity    : '@',
		subentity : '@'
    },
    controller: function ($scope, $http, EntitiesService, ArrayService) {
    	$scope.item = {};
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
