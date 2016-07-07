angular.module('app').directive('nyuListItem', function ($timeout) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-item/list-item.html',
    controllerAs: 'nyuListItem',
    scope: {
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
        type           : '@',
		calbackrender	: '='

    },
    link: function(scope, element, attrs, controller, transcludeFn) {

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

    },controller: function ($scope, $timeout) {
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
    	$scope.audioPlaying = false;
    	$scope.toggleAudio = function(id){
            $animation = $('#'+id);
            var pause = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
            var play = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";
    		$scope.audioPlaying = !$scope.audioPlaying;
            $animation.attr({
               "from": $scope.audioPlaying ? pause : play,
               "to": $scope.audioPlaying ? play : pause
            }).get(0).beginElement();
    	};

    	$scope.getTitleUrl = function(){
    		return window.encodeURIComponent($scope.title).replace(/%20/g,'+');
    	};
    }
  };
});
