angular.module('app').directive('selectTagInput', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/select-tag-input/select-tag-input.html',
    controllerAs: 'selectTagInput',
    scope : {
    	variables : '=',
        result : '=',
        dataType : '@',
        maxTags : "@"
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        
        /**************
        ****COUNTRY****
        **************/
        $scope.selectedItems = [];

        $scope.$watch(function(){return $scope.result.items.length;}, function(){
            $scope.selectedItems = [];
            angular.forEach($scope.result.items, function(item){
                var itemObj = {
                    text : item
                };
                $scope.selectedItems.push(itemObj);                  
            });            
        });


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
            if($scope.maxTags < $scope.selectedItems.length){
                $scope.selectedItems.pop();
            }
            $scope.result.items = [];
            angular.forEach($scope.selectedItems, function(selectedItem, k){
                //$scope.result.items[k] = selectedItem.text;
                $scope.result.items.push(selectedItem.text);
                $scope.result.name = selectedItem.text;                    
            });
        });

        $scope.$watch('result.name', function(){
            if($scope.result.name && $scope.result.items.length < 2){
                var itemObj = { text : $scope.result.name };
                $scope.selectedItems[0] = itemObj; 
                $scope.result.items[0] = itemObj.text;                 
            }
        });
    }
  };
});
