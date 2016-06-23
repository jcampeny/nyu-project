angular.module('app').
    directive('nyuHome', function (DataService) {
      return {
        restrict: 'E',
        templateUrl: '../app/components/home/home.html',
        controllerAs: 'nyuHome',
        controller: function ($scope, $timeout) {
        	/*$timeout(function(){
        		if(typeof twttr !== "undefined"){
        			twttr.widgets.load();		
        		}
        	},0);*/
        },
      };
    })
    .directive('sliderHomeBooks', function (DataService, $timeout){
        return{
            restrict: 'C',
            require: '^^nyuHome',
            transclude: false,
            link : function(s, e, a){
                s.books = {
                    items : [],
                    length : 0,
                    actual : 0
                };

                s.bookNextPrev = function(direction){
                    switch(direction) {
                        case 'right':
                            s.books.actual = (s.books.actual >= s.books.length - 1) ? 0 : s.books.actual + 1;
                            break;
                        case 'left':
                            s.books.actual = (s.books.actual <= 0) ? s.books.length - 1 : s.books.actual - 1;
                            break;
                    }
                    var position = -Math.abs(s.books.actual * 100);
                    $(e).css({left : position + '%'}); 
                };

                DataService.all('books', "all", 0, true).then(function(books){
                    s.books.items = books;
                    s.books.length = books.length;
                    $timeout(function(){
                        if(typeof twttr !== "undefined"){
                            twttr.widgets.load();       
                        }
                        $(e)
                            .css({width : 100*s.books.length + '%', left : s.books.actual*100 + '%'})
                            .find('.book-item')
                                .css({width : 100/s.books.length + '%'});
                        },0);
                }); 
            }
        };
    });
