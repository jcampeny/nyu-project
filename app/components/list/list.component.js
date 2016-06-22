angular.module('app').directive('nyuList', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list/list.html',
    controllerAs: 'nyuList',
    scope:{
    	entity: '@',
    	subentity: '@'
    },

    controller: function ($scope, $rootScope, $http, EntitiesService) {
    	$scope.root = $rootScope;
    	$rootScope.mobileShowFilters = false;
    	$scope.entitiesService = EntitiesService;


    	$scope.items = [];
    	var dataFile = $scope.entity;
    	if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
    		dataFile = $scope.subentity;
    	}


    	/*$http.get("/localdata/content/" + dataFile + ".json", { cache: true })
            .then(function(response) {
                $scope.items = response.data.results;
            });*/

        DataService.all(dataFile, "all", 0, true).then(function(posts){
            $scope.items = posts;
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
