angular.module('app').directive('cageSelectDistanceVaribles', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/cage-select-distance-varibles/cage-select-distance-varibles.html',
    controllerAs: 'cageSelectDistanceVaribles',
    scope : {
    	variables : '=',
        result : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {

        $scope.dropDownCollapsed = [];
        $scope.subSectionCollapsed = [];
        
        /*************************
        ***Logarithm controller***
        *************************/
        $scope.toggleCollapsed = function(scopeKey, newValue){
            $scope.dropDownCollapsed[scopeKey] = newValue; 
        };

        $scope.onCheck = function(item){
            if(item.default){
                $scope.result.push(item);
            }else{
                angular.forEach($scope.result, function(selectedItem, index){
                    if(angular.equals(selectedItem, item)){
                        $scope.result.splice(index, 1);  
                    }
                });
            }
        }

    }
  };
});
