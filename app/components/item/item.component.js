angular.module('app').directive('nyuItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/item/item.html',
    controllerAs: 'nyuItem',
    scope: {
		entity    : '@',
		subentity : '@'
    },

    controller: function ($scope, $http, EntitiesService, ArrayService, DataService, $stateParams, $state) {
    	$scope.item = null;
    	$scope.related = [];

    	var dataFile = $scope.entity;
    	if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
    		dataFile = $scope.subentity;
    	}


       postController = DataService.getPosts();
       if(postController.length > 0){
        angular.forEach(postController, function(postsItem){
          if(postsItem.state == dataFile){
            var found = false;
            angular.forEach(postsItem.posts, function(aPost){
              if(aPost.id == $stateParams.id){
                $scope.item = aPost;
                found = true;
              }else if($scope.related.length < 3 || dataFile == 'books'){
                $scope.related.push(aPost);
              }
            });
            if(!found) getItFromDB();
          }
        });
       }else{
        getItFromDB();
       }
      function getItFromDB(){
        DataService.all(dataFile + '/' +$stateParams.id, "all", 0, true).then(function(posts){
            $scope.item = posts;
        });
        DataService.all(dataFile, "4", 1, true).then(function(posts){
          angular.forEach(posts, function(aPostItem){
            if(aPostItem.id != $stateParams.id && $scope.related.length < 3){
              $scope.related.push(aPostItem);
            }
          });
        });
      }
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
