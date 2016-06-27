
 angular
    .module('app')
    .service('slideService', ['$timeout', function($timeout){
        var animateOn = false;
        var slideController = {
            actual : 0,
            last : 0,
            direction : 0
        };
        return {
            getDataSlide : getDataSlide,
            createSlide : createSlide
        };

        function getDataSlide(item, direction){

            if(!animateOn){
                var last = item.actual;
                var d = 0;
                switch(direction) {
                    case 'right':
                        item.actual = (item.actual >= item.length - 1) ? 0 : item.actual + 1;
                        d = -1;
                        break;
                    case 'left':
                        item.actual = (item.actual <= 0) ? item.length - 1 : item.actual - 1;
                        d = 1;
                        break;
                }  
                slideController = {
                    actual : item.actual,
                    last : last,
                    direction : d
                };
                refreshPosition(item.name);              
            }
            return item.actual; 
        }

        function refreshPosition(name){
            animateOn = true;
            var time = 500;
            $('[slider-id="'+name+'-'+slideController.actual+'"]').css({left: -100*slideController.direction +'%', opacity : -3});
            $('[slider-id="'+name+'-'+slideController.last+'"]').animate({ left : 100*slideController.direction + '%', opacity: -3},time);
            $('[slider-id="'+name+'-'+slideController.actual+'"]').animate({left : '0%', opacity: 1},time, function(){animateOn = false;});
        }

        function createSlide(item, e){
            $timeout(function(){
                if (item){
                    var name = item.name;
                    var len = item.items;
                    var h = $(e).find('.'+name+'-item').height();

                    angular.forEach(len, function(book, i){
                        var hContainer = $(e).find('[slider-id="'+name+'-'+i+'"]').height();
                        h = (hContainer > h) ? hContainer : h;
                    });
                    $('[slider-id="'+name+'-'+0+'"]').css({left: '0%'});
                    $(e).find('.slide-container').css({ height : h + 'px' });
                }
            },500);
        }
    }]);




