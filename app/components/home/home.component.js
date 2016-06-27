angular.module('app').
    directive('nyuHome', function (DataService) {
      return {
        restrict: 'E',
        templateUrl: '../app/components/home/home.html',
        controllerAs: 'nyuHome',
        controller: function ($scope, $timeout) {
        	$timeout(function(){
        		if(typeof twttr !== "undefined"){
        			twttr.widgets.load();		
        		}
        	},0);

        },
      };
    });
    /* How to use:
    *   ng-repeat="(key, book) in books.items" class="{{books.name}}-item" slider-id="{{books.name}}-{{key}}"
    *
    *
    *
    */
angular.module('app').directive('sliderDirective', function (DataService, slideService){
        return{
            restrict: 'C',
            link : function(s, e, a){
                var item = a.item;
                DataService.all(item, "all", 0, true).then(function(obj){

                    s.items = {
                        items : obj,
                        length : obj.length,
                        actual : 0,
                        name : item,
                        move : function (d){
                            this.actual = slideService.getDataSlide(this, d);
                        }
                    };
                    slideService.createSlide(s.items, e);
                }); 
            }
        };
    });

angular.module('app').directive('sliderDirectiveLatest', function (DataService, slideService){
        return{
            restrict: 'C',
            link : function(s, e, a){
                var item = a.item;
                DataService.all(item, "all", 0, true).then(function(obj){
                    s.latest = {
                        items : obj,
                        length : obj.length,
                        actual : 0,
                        name : item,
                        move : function (d){
                            this.actual = slideService.getDataSlide(this, d);
                        }
                    };
                    slideService.createSlide(s.latest, e);
                }); 
            }
        };
    });