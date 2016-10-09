angular.module('app').directive('ddItemArray', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/dd-item-array/dd-item-array.html',
    controllerAs: 'ddItemArray',
    scope : {
    	variables : '=',
        result : '=',
        selectType : '@'
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.dropDownCollapsed = [];

        $scope.toggleSelection = function(item) {
            if ($scope.result.items.indexOf(item) > -1) {
                $scope.result.items.splice($scope.result.items.indexOf(item), 1);
            }
            else {
                $scope.result.items.push(item);
            }
        };

        $scope.toggleCollapsed = function(scopeKey, newValue){
            $scope[scopeKey] = newValue; 
        };
    }
  };
});
