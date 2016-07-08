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

       DataService.all(dataFile, "all", 0, true).then(function(posts){
           var log = [];
           angular.forEach(posts, function(post, i){
               if($stateParams.id == post.id){
                   $scope.item = post;
               }else if(this.length < 3 || $scope.entity == 'books'){
                   this.push(post);
               }
           }, log);
           $scope.related = log;
       });

    	$scope.hasTopImg = function(){
    		return EntitiesService.hasTopImg($scope.entity);
    	};

    	$scope.groupItems = function(){
    		return EntitiesService.groupItems($scope.entity);
    	};

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
