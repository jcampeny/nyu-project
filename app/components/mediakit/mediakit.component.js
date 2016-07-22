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
        $scope.resources = [];
        $scope.zipFile = '';
        $scope.picture = DataService.getMediaHeader($scope.entity);

        $rootScope.$on('mediaLoaded', function(event, data) {
            if(!files) {
                files = DataService.getMediaKit();
                $scope.picture = DataService.getMediaHeader($scope.entity);
            }
            $scope.picture = DataService.getMediaHeader($scope.entity);
            createResources(); 
            fadeInTitle();       
        });


        createResources();
        function fadeInTitle(){
            if($scope.picture){
                setTimeout(function(){
                    $('.gradient').delay(400).animate({
                        opacity : '1'
                    },500);
                    $('.line-title').delay(600).animate({
                        opacity : '1',
                        y : '20px'
                    },500);    
                },300);            
            }
        }
        $rootScope.$on('$stateChangeSuccess',function(){fadeInTitle();});
        fadeInTitle();
    	function createResources(){
            files = DataService.getMediaKit();
            angular.forEach(files, function(file){
                var resource = {
                    label : file.title.rendered,
                    file : getTypeResource(file),
                    url : file.source_url
                };
                if(file.mime_type == 'application/zip'){
                    $scope.zipFile = file.source_url;
                }else{
                    $scope.resources.push(resource);                    
                }

            });

        }
        function getTypeResource(file){
            if(file.mime_type == 'application/pdf'){return '/assets/img/pdf.png';}else
            if(file.mime_type == 'application/zip'){return '/assets/img/zip.png';}else
            if(file.mime_type.indexOf('video') > -1){return '/assets/img/vid.png';}else
            if(file.mime_type.indexOf('word') > -1){return '/assets/img/doc.png';}else
            if(file.mime_type.indexOf('sheet') > -1){return '/assets/img/exe.png';}else{
                return file.source_url;
            }
        } 
    	$scope.selectResource = function(r){
            if($scope.resourceSelected == r){
                $scope.resourceSelected = '';
            }else{
                $scope.resourceSelected = r;
            }
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
