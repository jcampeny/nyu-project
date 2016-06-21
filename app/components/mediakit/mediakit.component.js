angular.module('app').directive('nyuMediakit', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/mediakit/mediakit.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope, $window, EntitiesService) {
    	$scope.resourceSelected = "null";
    	$scope.entity = "mediakit";
    	$scope.resources = [
    		{label: "1", file: "mediakit_1.png"},
    		{label: "2", file: "mediakit_2.png"},
    		{label: "3", file: "mediakit_3.png"},
    		{label: "4", file: "mediakit_4.png"},
    		{label: "5", file: "mediakit_5.png"},
    		{label: "6", file: "mediakit_6.png"},
    		{label: "7", file: "mediakit_7.png"},
    		{label: "8", file: "mediakit_8.png"},
    		{label: "9", file: "mediakit_9.png"},
    		{label: "10", file: "mediakit_10.png"},
    		{label: "World 3.0 Cover Image", file: "mediakit_11.png"},
    		{label: "Full Biography", file: "mediakit_12.png"},
    		{label: "Advance praise for World 3.0", file: "mediakit_13.png"}
    	];
    	
    	$scope.selectResource = function(r){
    		$scope.resourceSelected = r;
    	};

    	$scope.downloadResource = function(){
    		if($scope.resourceSelected !== 'null'){
    			$window.open("/localdata/img/"+$scope.resourceSelected,"_blank");
    		}
    	};

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
