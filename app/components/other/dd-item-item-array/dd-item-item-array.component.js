angular.module('app').directive('ddItemItemArray', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/dd-item-item-array/dd-item-item-array.html',
    controllerAs: 'ddItemItemArray',
    scope : {
    	variables : '=',
        result : '=',
        selectType : '@'
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.dropDownCollapsed = [];
        
        $scope.toggleSelection = function(item) {
            var customItem = {
                name : item,
                parent : ''
            };

            if ($scope.result.items.indexOf(customItem) > -1) {
                $scope.result.items.splice($scope.result.items.indexOf(customItem), 1);
            }
            else {
                $scope.result.items.push(customItem);
            }
        };

        $scope.toggleCollapsed = function(scopeKey, newValue){
            $scope[scopeKey] = newValue; 
        };
    }
  };
});
