angular.module('app').directive('nyuGlobecourse', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/globecourse/globecourse.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope, EntitiesService) {
    	$scope.entity = "globecourse";

        $scope.entityLabels = EntitiesService.getEntityLabels(); 

        $scope.groupItems = function(){
            return EntitiesService.groupItems($scope.entity);
        };
    }
  };
});
