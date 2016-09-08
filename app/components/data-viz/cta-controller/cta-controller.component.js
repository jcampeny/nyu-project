angular.module('app').directive('ctaController', function () {
  return {
    restrict: 'E',
    require : '^^nyuDataViz',
    templateUrl : '../app/components/data-viz/cta-controller/cta-controller.html',
    controllerAs: 'ctaController',
    scope: {
        viewController: '=',
        popUp: '=',
        temporal: '=',
        selected: '=',
        metaData : '@'
    },
    controller: function ($scope) {
        $scope.countryUpdate = function(){
            $scope.temporal.name = $scope.popUp.name;
            $scope.temporal.items = $scope.popUp.items;

            if($scope.viewController.lastPopUpState() == 'closed'){
                $scope.selected.name  = $scope.temporal.name;
                $scope.selected.items = $scope.temporal.items;                
            }
 
            $scope.viewController.goBack();
        };

        $scope.indicatorsUpdate = function(){
            $scope.temporal.items = $scope.popUp.items;

            if($scope.viewController.lastPopUpState() == 'closed'){
                $scope.selected.items = $scope.temporal.items;                
            }

            $scope.viewController.goBack();
        };
        $scope.anotherColorCancel = function(){
            $scope.temporal.indicators.items = $scope.selected.indicators.items;
            
            $scope.temporal.country.items = $scope.selected.country.items;
            $scope.temporal.country.name  = $scope.selected.country.name;
            
            $scope.temporal.years.start = $scope.selected.years.start;
            $scope.temporal.years.end   = $scope.selected.years.end;
            
            $scope.viewController.goBack();
        };

        $scope.yearsUpdate = function(){
            $scope.temporal.start = $scope.popUp.start; 
            $scope.temporal.end = $scope.popUp.end;

            if($scope.viewController.lastPopUpState() == 'closed'){
                $scope.selected.start = $scope.temporal.start;
                $scope.selected.end = $scope.temporal.end;
            }

            $scope.viewController.goBack();
        };

    },
    link: function (s, e, a){
    }
  };
});
