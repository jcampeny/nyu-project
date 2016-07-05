angular.module('app').directive('nyuGlobecourse', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/globecourse/globecourse.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope, EntitiesService, DataService, $sce) {
    	$scope.entity = "globecourse";
        var slug = 'gloube-course';
        $scope.content = '';
        $scope.entityLabels = EntitiesService.getEntityLabels(); 
        DataService.all('pages', '', '', false, '?slug='+slug).then(function(page){
            $scope.content = page[0].content;
        });
        $scope.groupItems = function(){
            return EntitiesService.groupItems($scope.entity);
        };
    }
  };
});
