angular.module('app').directive('nyuMediakit', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/mediakit/mediakit.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope, $window, EntitiesService, ContactService, DataService, $rootScope) {
    	$scope.resourceSelected = "null";
    	$scope.entity = "mediakit";
        $scope.sendMedia = 'SEND';
        var sending = false;
        var files = DataService.getMediaKit();
        $scope.zipFile = '';
        $rootScope.$on('mediaLoaded', function(event, data) {
            if(!files) $scope.picture = DataService.getMediaHeader($scope.entity);
            createResources();        
        });
    	$scope.resources = [];
    	function createResources(){
            angular.forEach(files, function(file){
                var resource = {
                    label : file.caption,
                    file : getTypeResource(file),
                    url : file.source_url
                };
                if(file.mime_type == 'application/zip'){
                    $scope.zipFile = file.source_url;
                }
                $scope.resources.push(resource);
            });
            function getTypeResource(file){
                if(file.mime_type == 'application/pdf'){return '/assets/img/pdf.png';}else
                if(file.mime_type == 'application/zip'){return '/assets/img/zip.png';}else
                if(file.mime_type.indexOf('video') > -1){return '/assets/img/vid.png';}else
                if(file.mime_type.indexOf('word') > -1){return '/assets/img/doc.png';}else
                if(file.mime_type.indexOf('sheet') > -1){return '/assets/img/exe.png';}else{
                    return file.source_url;
                }
            } 
        }

    	$scope.selectResource = function(r){
    		$scope.resourceSelected = r;
    	};

    	$scope.downloadResource = function(){
    		if($scope.resourceSelected !== 'null'){
    			$window.open(/*"/localdata/mediakit/"+*/$scope.resourceSelected,"_blank");
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
                ContactService.sendFiles(email, $scope.zipFile).then(function(response){
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
