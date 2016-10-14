angular.module('app').directive('ddItemItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/dd-item-item/dd-item-item.html',
    controllerAs: 'ddItemItem',
    scope : {
    	variables : '=',
        result : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.dropDownCollapsed = "";

        $scope.toggleCollapsed = function(scopeKey, newValue){
            $scope[scopeKey] = newValue; 
        };

    },
    link: function (s, e, a){

        function refreshResult(){
            s.result.items = [];
            angular.forEach(s.variables, function(parentValue, parentKey){
                angular.forEach(parentValue, function(value, key){
                    angular.forEach(value, function(childValue, childKey){
                        if($('input[name="'+key+childValue.name+'"]').prop('checked')){
                            childValue["default"] = true;
                            s.result.items.push({
                                parent : key,
                                name   : childValue.name,
                                code   : childValue.code
                            });
                        }
                        
                    });
                });
            });
        }

        s.parentSelect = function(parentKey, key){
            var parentObj = $('input[name="'+key+'"]');
            var newState = !(!parentObj.prop("checked"));

            angular.forEach(s.variables[parentKey][key], function(itemValue, itemKey){
                $('input[name="'+key+itemValue.name+'"]').prop('checked', newState);
            });

            parentObj.prop('checked', newState);
            refreshResult();
        };

        s.childSelect = function(parentKey, key){

            var parentObj = $('input[name="'+key+'"]');
            var parentClass = new ParentController();

            function ParentController (){
                this.childs = [];
                this.allChildSame = function () {
                    for(var i = 1; i < this.childs.length; i++)
                    {
                        if(this.childs[i] !== this.childs[0])
                            return false;
                    }
                    return true;
                };
            }  

            parentObj.prop({
                checked : false,
                indeterminate : false
            });


            angular.forEach(s.variables[parentKey][key], function(itemValue, itemKey){
                parentClass.childs.push($('input[name="'+ key + itemValue.name+'"]').prop('checked'));
            });

            if(parentClass.allChildSame()){
                parentObj.prop('checked', parentClass.childs[0]);
            }else{
                parentObj.prop('indeterminate', true);
            }
            
            refreshResult();
        };

    }
  };
});
