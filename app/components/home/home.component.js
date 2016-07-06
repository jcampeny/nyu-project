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
            $scope.featured = {
                title : '',
                content : '',
                img : '',
                link : '',
                label : ''
            };
            DataService.all('home', '', '', false, '?_embed').then(function(homePages){
                angular.forEach(homePages, function(homeItem, i){
                    if(homeItem.home_favorite == 'on'){
                        $scope.featured = {
                            title : homeItem.title,
                            content : homeItem.content,
                            img : homeItem._embedded['wp:featuredmedia'][0].source_url,
                            link : DataService.htmlToPlaintext(homeItem.excerpt.rendered),
                            label : homeItem.home_label
                        };
                        //console.log($scope.featured);
                    }
                });

            });
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

angular.module('app').directive('sliderDirectiveLatestMobile', function (DataService, slideService, $timeout){
        return{
            restrict: 'C',
            link : function(s, e, a){
                var item = a.item;
                DataService.all('latest', "all", 0, true).then(function(obj){
                    s.latestmobile = {
                        items : obj,
                        length : obj.length,
                        actual : 0,
                        name : item,
                        move : function (d){
                            this.actual = slideService.getDataSlide(this, d);
                        }
                    };
                    $timeout(function(){
                        var name = s.latestmobile.name;
                        var len = s.latestmobile.items;
                        var h = $('.latestmobile-item').height();
                        
                        angular.forEach(len, function(book, i){
                            var hContainer = $('[slider-id-mobile="'+name+'-'+i+'"]').height();
                            h = (hContainer > h) ? hContainer : h;
                        });
                        $('[slider-id="'+name+'-'+0+'"]').css({left: '0%'});
                        $('.slide-container-mobile').css({ height : h + 'px' });
                        

                    },500);
                }); 
            }
        };
    });