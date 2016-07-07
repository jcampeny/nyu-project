
angular.module('app').directive('ngBackToTop', function (screenService, $document, $state, $rootScope, deviceDetector) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/back-to-top/back-to-top.html',
    controllerAs: 'ngPopUp',
    controller: function ($scope) {

    },
    link : function(s, e, a){
    	s.backToTop = function(){
    		$('html, body').animate({ scrollTop: 0 }, 'slow');
    		$rootScope.$broadcast('backTop', {
    		    state: ''
    		});
    	};
    	var scrollHandling = {
            allow: true,
            reallow: function() {
                scrollHandling.allow = true;
            },
            delay: 50 //++ to improve performance
        };

        var element = $('footer');
        var footCtrl = {
        	left : ['books/:id/:title', 'globalization-index-reports/:id/:title', 'articles/:id/:title', 'working-papers/:id/:title', 'blog/:id/:title', 'podcasts/:id/:title', 'press/:id/:title', 'mediakit/:id/:title','globe-course/documents/:id/:title', 'globe-course/readings/:id/:title', 'globe-course/cases/:id/:title','cases-teaching-notes/:id/:title',' globalization-notes/:id/:title', 'other-teaching-materials/:id/:title'],
        	right : ['about','books','globalization-index-reports', 'articles', 'working-papers', 'blog', 'videos', 'podcasts', 'press', 'mediakit', 'globe-course','globe-course/documents', 'globe-course/readings', 'globe-course/cases', 'globe-course/notes', 'globe-course/presentations','cases-teaching-notes',' globalization-notes', 'other-teaching-materials', 'surveys/gap-survey']
        };  
        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        	footerCtrl();
        });
		footerCtrl();
        function footerCtrl(){
        	if($document.height() < 3500 || deviceDetector.isMobile()){
        		$(e).addClass('hide');
        	}else{
		        if(footCtrl.right.indexOf($state.current.url) > -1){
		        	$(e).addClass('right');$(e).removeClass('hide');$(e).removeClass('left');
		        }else if(footCtrl.left.indexOf($state.current.url) > -1){
					$(e).addClass('left');$(e).removeClass('hide');$(e).removeClass('right');
		        }else{
		        	$(e).addClass('hide');
		        }        		
        	}
        }

    	$document.bind('mousewheel DOMMouseScroll touchmove scroll', function(){
    		if(scrollHandling){
    			scrollHandling.allow = false;
    			setTimeout(function(){scrollHandling.reallow();},scrollHandling.delay);
    			footerCtrl();
		    	if(screenService.inScreen(element)){
		    		$(e).fadeIn(400);
		    	}else{
		    		$(e).fadeOut(400);
		    	}       
	
    		}
    	});
    }
  };
});

