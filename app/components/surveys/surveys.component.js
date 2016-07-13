angular.module('app').directive('nyuSurveys', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/surveys/surveys.html',
    controllerAs: 'nyuSurveys',
    controller: function ($scope, $rootScope, $http, $window, EntitiesService, DataService, $state) {
    	$scope.entity = "surveys";
        $scope.groupItems = function(){
            return EntitiesService.groupItems($scope.entity);
        };
        /*MEDIA CONTROLLER*/
        $scope.picture = '';
        $scope.picture = DataService.getMediaHeader($scope.entity);
        $rootScope.$on('mediaLoaded', function(event, data) {
            if(!$scope.picture){
                $scope.picture = DataService.getMediaHeader($scope.entity);
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
        $scope.entityLabels = EntitiesService.getEntityLabels();
    }
  };
});
