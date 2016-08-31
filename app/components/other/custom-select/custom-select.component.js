angular.module('app').directive('customSelect', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/custom-select/custom-select.html',
    controllerAs: 'customSelect',
    scope : {
    	options : '=',
        selected : '=',
        onSelect : '=',
        isTemporal : '@'
    },
    controller: function ($scope) {
        $scope.selected = $scope.selected || $scope.options[0];

        $scope.select = function(value){
            if($scope.isTemporal){
                $scope.selected.name = value.name;
                $scope.selected.id = value.id;                
            }else{
                $scope.selected = value;
            }
            if(typeof $scope.onSelect == 'function') $scope.onSelect(value.id);
            
        };
        
    }
  };
});
