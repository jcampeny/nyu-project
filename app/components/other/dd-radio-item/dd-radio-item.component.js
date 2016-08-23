angular.module('app').directive('ddRadioItem', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/other/dd-radio-item/dd-radio-item.html',
    controllerAs: 'ddRadioItem',
    scope : {
    	variables : '=',
        result : '='
    },
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.dropDownCollapsed = {};
        $scope.radioCollapsed = "";
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
                            childValue.default = true;
                            s.result.items.push({
                                parent : key,
                                name   : childValue.name
                            });
                            s.dropDownCollapsed[parentKey] = true;
                        }
                    });
                });
            });                
        }
        function resetResult(){
            s.result.items = [];
            angular.forEach(s.variables, function(parentValue, parentKey){
                angular.forEach(parentValue, function(value, key){
                    angular.forEach(value, function(childValue, childKey){
                        childValue.default = false;
                        
                    });
                });
            });                
        }
        s.parentSelect = function(parentKey, key){
            var parentObj = $('input[name="'+key+'"]');
            var newState = !(!parentObj.prop("checked"));

            $('input[parent-dd-radio]').prop('checked', false);
            $('input[child-dd-radio]').prop('checked', false);
            
            
            resetResult();

            angular.forEach(s.variables[parentKey][key], function(itemValue, itemKey){
                $('input[name="'+key+itemValue.name+'"]').prop('checked', newState);
                itemValue.default = true;

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
                if($('input[name="'+ key + itemValue.name+'"]').prop('checked')){parentObj.prop('checked', true);}
                if($('input[name="'+ key + itemValue.name+'"]').prop('checked')){
                    $('input[parent-dd-radio="'+key+'"]').prop('checked', true);
                    s.radioCollapsed = key;
                }

                
            });

            if(parentClass.allChildSame() && !parentClass.childs[0]){
                parentObj.prop('checked', false);
            }

            
            refreshResult();
        };

    }
  };
});
