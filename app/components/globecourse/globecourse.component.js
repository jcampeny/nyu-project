angular.module('app').directive('nyuGlobecourse', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/globecourse/globecourse.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope, $rootScope, $http, $window, EntitiesService, DataService, $state, $sce) {
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
        /*MEDIA CONTROLLER*/
        $scope.picture = '';
        $scope.picture = DataService.getMediaHeader('globecourse');
        $rootScope.$on('mediaLoaded', function(event, data) {
            if(!$scope.picture){
                $scope.picture = DataService.getMediaHeader('globecourse');
                fadeInTitle();
            }
        });
        function fadeInTitle(){
            if($scope.picture){
                setTimeout(function(){
                    $('.gradient').delay(400).animate({
                        opacity : '1'
                    },500);
                    $('.line-title').delay(600).animate({
                        opacity : '1',
                        y : '20px'
                    },500);    
                },300);            
            }
        }
        $rootScope.$on('$stateChangeSuccess',function(){fadeInTitle();});
        fadeInTitle();
        /*END MEDIA CONTROLLER*/
    }
  };
});
