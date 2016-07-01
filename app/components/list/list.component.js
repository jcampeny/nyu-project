angular.module('app').directive('nyuList', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list/list.html',
    controllerAs: 'nyuList',
    scope:{
    	entity: '@',
    	subentity: '@'
    },

    controller: function ($scope, $rootScope, $http, $window, EntitiesService, DataService) {
    	$scope.root = $rootScope;
    	$rootScope.mobileShowFilters = false;
    	$scope.entitiesService = EntitiesService;
        $scope.entityLabels = EntitiesService.getEntityLabels();

    	$scope.items = [];
    	var dataFile = $scope.entity;
    	if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
    		dataFile = $scope.subentity;
    	}


    	$http.get("/localdata/content/" + dataFile + ".json", { cache: true })
            .then(function(response) {
                $scope.items = response.data.results;
            });

        // DataService.all(dataFile, "all", 0, true).then(function(posts){
        //     $scope.items = posts;
        // });
        
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
