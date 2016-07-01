angular.module('app').directive('nyuMediakit', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/mediakit/mediakit.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope, $window, EntitiesService, ContactService) {
    	$scope.resourceSelected = "null";
    	$scope.entity = "mediakit";
        $scope.sendMedia = 'SEND';
        var sending = false;
    	$scope.resources = [
    		{label: "1", file: "mediakit_1.png", url: "1.jpg"},
    		{label: "2", file: "mediakit_2.png", url: "2.jpg"},
    		{label: "3", file: "mediakit_3.png", url: "3.jpg"},
    		{label: "4", file: "mediakit_4.png", url: "4.jpg"},
    		{label: "5", file: "mediakit_5.png", url: "5.jpg"},
    		{label: "6", file: "mediakit_6.png", url: "6.jpg"},
    		{label: "7", file: "mediakit_7.png", url: "7.jpg"},
    		{label: "8", file: "mediakit_8.png", url: "8.jpg"},
    		{label: "9", file: "mediakit_9.png", url: "9.jpg"},
    		{label: "10", file: "mediakit_10.png", url: "10.jpg"},
    		{label: "World 3.0 Cover Image", file: "mediakit_11.png", url: "world3.0.jpg"},
    		{label: "Full Biography", file: "mediakit_12.png", url: "Pankaj Ghemawat bio.doc"},
    		{label: "Advance praise for World 3.0", file: "mediakit_13.png", url: "Advance Praise for World 3 0.pdf"}
    	];
    	
    	$scope.selectResource = function(r){
    		$scope.resourceSelected = r;
    	};

    	$scope.downloadResource = function(){
    		if($scope.resourceSelected !== 'null'){
    			$window.open("/localdata/mediakit/"+$scope.resourceSelected,"_blank");
    		}
    	};

    	$scope.hasTopImg = function(){
    		return EntitiesService.hasTopImg($scope.entity);
    	};

    	$scope.groupItems = function(){
    		return EntitiesService.groupItems($scope.entity);
    	};

        $scope.sendFiles = function(){
            var email = $('#file-email').val();
            $scope.sendMedia = 'SENDING...';
            if(!sending && email !== ''){
                sending = true;
                ContactService.sendFiles(email).then(function(response){
                    if(response > 0){//todo
                        $('#file-email').fadeOut(1000);
                        $('.button-container').fadeOut(1000);
                    }else{
                        sending = false;
                        $scope.sendMedia = 'RETRY';
                    }
                });
            }

        };

    	$scope.entityLabels = EntitiesService.getEntityLabels();
    }
  };
});
