angular.module('app').directive('nyuSurveys', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/surveys/surveys.html',
    controllerAs: 'nyuSurveys',
    controller: function ($scope, EntitiesService) {
    	$scope.entity = "surveys";
        $scope.groupItems = function(){
            return EntitiesService.groupItems($scope.entity);
        };

        $scope.entityLabels = EntitiesService.getEntityLabels();
    }
  };
});
