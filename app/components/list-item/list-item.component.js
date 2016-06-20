angular.module('app').directive('nyuListItem', function ($timeout) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/list-item/list-item.html',
    controllerAs: 'nyuListItem',
    scope: {
    	last 			: '@',
    	entity 			: '@',
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
		calbackrender	: '='

    },
    link: function(scope, element, attrs, controller, transcludeFn) {

    	function checkHeight(){
			$timeout(function(){
			    var height = $(element).children()[0].offsetHeight;
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
    	$scope.toggleAudio = function(){
    		$scope.audioPlaying = !$scope.audioPlaying;
    	};

    	$scope.getTitleUrl = function(){
    		return window.encodeURIComponent($scope.title).replace(/%20/g,'+');
    	};
    }
  };
});
