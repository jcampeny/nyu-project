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
                var animateOn = false;
                s.bookNextPrev = function(direction){
                    if(!animateOn){
                        var last = s.books.actual;
                        switch(direction) {
                            case 'right':
                                s.books.actual = (s.books.actual >= s.books.length - 1) ? 0 : s.books.actual + 1;
                                refreshPosition(last, -1);
                                break;
                            case 'left':
                                s.books.actual = (s.books.actual <= 0) ? s.books.length - 1 : s.books.actual - 1;
                                refreshPosition(last, 1);
                                break;
                        }                        
                    }
                };

                DataService.all('books', "all", 0, true).then(function(books){
                    s.books.items = books;
                    s.books.length = books.length;
                    $timeout(function(){
                        if(typeof twttr !== "undefined"){
                            twttr.widgets.load();       
                        }

                        var h = $(e).find('.book-item').height();

                        angular.forEach(s.books.items, function(book, i){
                            var hBook = $(e).find('[book="'+i+'"]').height();
                            h = (hBook > h) ? hBook : h;
                        });

                        $(e).css({ height : h + 'px' });

                    },0);
                }); 

                function refreshPosition(last, direction){
                    animateOn = true;
                    var time = 500;
                    $('[book="'+s.books.actual+'"]').css({left: -100*direction +'%', opacity : -3});
                    $('[book="'+last+'"]').animate({ left : 100*direction + '%', opacity: -3},time);
                    $('[book="'+s.books.actual+'"]').animate({left : '0%', opacity: 1},time, function(){animateOn = false;});
                }
            }
        };
    });
