angular.module('app').directive('selectTagInput', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/select-tag-input/select-tag-input.html',
    controllerAs: 'selectTagInput',
    scope : {
    	variables : '=',
        result : '=',
        dataType : '@'
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        
        /**************
        ****COUNTRY****
        **************/
        $scope.selectedItems = [];

        $scope.getArrayFromCountries = function(query){
            var countriesArray = [];
            angular.forEach($scope.variables, function(countryZone){
                angular.forEach(countryZone, function(countryItem){
                    if(countryItem.name.toLowerCase().indexOf(query.toLowerCase()) > -1 && 
                        countriesArray.indexOf(countryItem.name) == -1){
                        countriesArray.push(countryItem.name);
                    }
                });
            });
            return countriesArray;
        };

        $scope.$watch(function(){return $scope.selectedItems.length;},function(){
            angular.forEach($scope.selectedItems, function(selectedItem){
                $scope.result.items.push(selectedItem.text);
            });
        });

    }
  };
});
