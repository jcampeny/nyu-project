angular.module('app').directive('nyuItem', function ( $http, EntitiesService, ArrayService, DataService, $stateParams, $state, $timeout, $document, $sce) {
    return {
        restrict: 'E',
        templateUrl: '../app/components/item/item.html',
        controllerAs: 'nyuItem',
        scope: {
    		entity    : '@',
    		subentity : '@'
        },

        controller: function ($scope) {

        	$scope.item = null;
        	$scope.related = [];

        	var dataFile = $scope.entity;
        	if(typeof $scope.subentity !== "undefined" && $scope.subentity !== ""){
        		dataFile = $scope.subentity;
        	}
            $scope.realRelated = function(){
                var customPosts = ['articles','blog','press'];
                return customPosts.indexOf(dataFile) > -1;
            };
            var limitRelated = (dataFile == 'books') ? 20 : 3;
            //Si hay posts en el service
            postController = DataService.getPosts();
            console.log();
            if(postController.length > 0){
                angular.forEach(postController, function(postsItem){
                    if(postsItem.state == dataFile){
                        angular.forEach(postsItem.posts, function(aPost){
                            //var tagtest = aPost.tags.topic || aPost.tags.country || aPost.tags.language || aPost.tags.years || aPost.tags.audience;
                            if(aPost.id == $stateParams.id){
                                $scope.item = aPost;
                                if(dataFile != 'books'){
                                   $scope.related = DataService.getRelatedPost(aPost); 
                                }
                            }else if(dataFile == 'books'){
                                $scope.related.push(aPost);
                            }
                        });
                    }
                });
                if(!$scope.item) getItFromDB();
            }else{
                getItFromDB();
            }
            //petición si no hay posts en el service
            function getItFromDB(){
                DataService.all(dataFile + '/' +$stateParams.id, "all", 0, true).then(function(posts){
                    $scope.item = posts;
                    if(dataFile != 'books'){
                        $scope.related = DataService.getRelatedPost(posts);
                    }else{
                        DataService.all(dataFile, limitRelated , 1, true).then(function(posts){
                            angular.forEach(posts, function(aPostItem){

                                if(aPostItem.id != $stateParams.id && ($scope.related.length < limitRelated)){
                                    $scope.related.push(aPostItem);
                                }
                            });
                        });
                    }
                    
                }, function(){$state.go('app.notfound');});
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
        			
        	};//https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/263770273&amp;color=4b82f9&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false
            $scope.videoEmbed = '';
            $scope.isEmbedYT = function(){
                var embedInfo;
                var isYT = false;
                if($scope.item && $scope.item.ext_link){
                    embedInfo = $scope.item.ext_link.split("::");
                    if(embedInfo[0] == 'youtube'){
                        isYT = true;
                        $scope.videoEmbed  = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + embedInfo[1]);
                    }
                }
                
                return isYT;
            };
            $scope.audioEmbed = '';
            $scope.isPodcast = function(){
                var embedInfo;
                var isYT = false;
                if($scope.item && $scope.item.audio){
                    embedInfo = $scope.item.audio;
                        isYT = true;
                        $scope.audioEmbed  = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+ embedInfo +'&amp;color=4b82f9&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false');
                }
                
                return isYT;
            };
        },
        link: function(scope, element, attrs){
            scope.audioDuration = '0:00';
            scope.actualTime = '0:00';            
            var timeController = {
                    total : 0,
                    current : 0
                };
            scope.audioPlaying = false;
            scope.id = $stateParams.id;
            if(scope.entity == 'podcasts'){
                var aItem = {
                    id : scope.id,
                    audio : ''
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
            checkHeight();
        }
      };
});
