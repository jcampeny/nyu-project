angular.module('app').directive('nyuListItem', function ($timeout, DataService, $sce, $document) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-item/list-item.html',
    controllerAs: 'nyuListItem',
    scope: {
        item            : '@',
        id              : '@',
    	last 			: '@',
    	entity 			: '@',
    	subentity 		: '@',
		author       	: '@',
		title        	: '@',
		subtitle     	: '@',
		contentShort	: '@',
		content      	: '@',
		publicationType	: '@',
		publication 	: '@',
		publisher		: '@',
		date			: '@',
		pages			: '@',
		other 			: '@',
		mainctatext  	: '@',
		mainctatext2 	: '@',
		otherCta 		: '@',
		extLink 		: '@',
		pdfLink 		: '@',
		xlsLink 		: '@',
		otherLink		: '@',
		picture 		: '@',
		audio 			: '@',
		share 			: '@',
        type            : '@',
        pdflinkextra    : '@',
		calbackrender	: '='

    },
    link: function(scope, element, attrs, controller, transcludeFn) {
        scope.audioDuration = '0:00';
        scope.actualTime = '0:00';            
        var timeController = {
                total : 0,
                current : 0
            };
        scope.audioPlaying = false;
        if(scope.entity == 'podcasts'){
            var aItem = {
                id : scope.id,
                audio : scope.audio
            };                    
            DataService.getPdfXls(aItem).then(function(itemW){
                scope.audio = itemW.audio;
                if(scope.audio){
                    var audioElement = document.createElement('audio');
                    var sourceElement = document.createElement('source');
                    sourceElement.src = scope.audio;
                    audioElement.id = 'audio-'+scope.id;
                    audioElement.appendChild(sourceElement);
                    $('#audio-here'+scope.id).append(audioElement);
                    $('#audio-'+scope.id).bind('canplay', function(){
                        $('.audio-block'+scope.id).removeClass('audio-block');
                        scope.audioDuration = getMinutes(this.duration);
                        timeController.total = this.duration;
                    });
                    $('#audio-'+scope.id).bind('play', function(){
                        this.currentTime = timeController.current;
                    });
                    $('#audio-'+scope.id).bind("timeupdate", function(){
                        scope.actualTime = getMinutes(this.currentTime);
                        timeController.current = this.currentTime;
                        updateBarTime(timeController.current, timeController.total);
                        scope.$apply();
                    });
                    $('#play-bar-'+scope.id).on('mousedown', function(event) {
                      event.preventDefault();
                      $('#audio-'+scope.id).trigger('pause');
                      scope.audioPlaying = true;
                      scope.toggleAudio('animation-'+scope.id);
                      startX = event.offsetX;
                      updateBarTime(event.offsetX, $(this).width());
                      $document.on('mousemove', mousemove);
                      $document.on('mouseup', mouseup);
                    });
                }
            });
        }
        function mousemove(event){
            var total = $('#play-bar-'+scope.id).width();
            var current = event.offsetX;
            if(current > total) current = total;
            updateBarTime(current, total);
        }
        function mouseup(event){
            scope.audioPlaying = false;
            scope.toggleAudio('animation-'+scope.id);
            $('#audio-'+scope.id).trigger('play');
            var total = $('#play-bar-'+scope.id).width();
            var current = event.offsetX;
            if(current > total) current = total;
            updateBarTime(current, total);
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        }
        function updateBarTime(actual, total){
            var progressBar = (100 * actual) / total;
            timeController.current = (timeController.total * progressBar) / 100;
            $('#control-time-'+scope.id).css({width : progressBar + '%'});
        }

        scope.toggleAudio = function(id){
            if(scope.audioDuration !== '0:00'){
                $animation = $('#'+id);
                var pause = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
                var play = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";
                scope.audioPlaying = !scope.audioPlaying;
                $animation.attr({
                   "from": scope.audioPlaying ? play : pause,
                   "to": scope.audioPlaying ? pause : play
                }).get(0).beginElement();
                var player = (scope.audioPlaying) ? 'play' : 'pause' ;
                $('#audio-'+scope.id).trigger(player);                
            }

        };
        function getMinutes(time){
            var minutes = Math.floor(time / 60);
            var seconds = Math.floor(time - minutes * 60);
            if(seconds < 10){
                seconds = '0' + seconds;
            }
            return minutes + ':' + seconds;
        }
    	function checkHeight(){
            if(scope.type == 'videos'){
                $timeout(function(){

                    var height = $(element).children()[0].offsetHeight;

                    $(element).animate({opacity:1},300);
                    if(height > 0){
                        if(typeof scope.calbackrender !== "undefined"){
                            scope.calbackrender(height);    
                        }
                    }else{
                        checkHeight();
                    }
                },300);
            }

    	}
    	checkHeight();

    },controller: function ($scope, $timeout, $sce) {
    	var breakMobile = 768;
    	//code
    	$scope.hasItemInfo = function(){
    		return $scope.publicationType !== "" ||
    				$scope.publication !== "" ||
    				$scope.publisher !== "" ||
    				$scope.date !== "" ||
    				$scope.pages !== "" ||
    				$scope.other !== "";
    	};
        $scope.videoEmbed = '';
        $scope.isEmbedYT = function(){
            var embedInfo;
            var isYT = false;
            if($scope.extLink){
                embedInfo = $scope.extLink.split("::");
                if(embedInfo[0] == 'youtube'){
                    isYT = true;
                    $scope.videoEmbed  = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + embedInfo[1]);
                }
            }
            //https://www.youtube.com/watch?v=6lP0efK8imk&feature=youtu.be
            return isYT;
        };
    	$scope.getTitleUrl = function(){
            var title = DataService.htmlToPlaintext($scope.title);
    		return window.encodeURIComponent(title).replace(/%20/g,'+');
    	};

    }
  };
});
