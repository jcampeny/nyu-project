angular.module('app').directive('ngFooter', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/footer/footer.html',
    controllerAs: 'footer',
    controller: function ($scope, PopupService) {
    	$scope.showSpeakerPopup = function(){
			PopupService.showSpeakerPopup();
		};
    }
  };
});
