angular.module('app').directive('nyuAbout', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/about/about.html',
    controllerAs: 'nyuAbout',
    controller: function ($scope, PopupService) {
    	$scope.collapsedText = true;

    	$scope.showSpeakerPopup = function(){
			PopupService.showSpeakerPopup();
		};
    }
  };
});
