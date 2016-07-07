angular.module('app')
    .service('screenService', [function(){

        var headerState = '';
        var scrollHandling = {
            allow: true,
            reallow: function() {
                var sc = this;
                setTimeout(function(){
                    sc.allow = true;
                }, sc.delay);
            },
            delay: 50 //++ to improve performance
        };
        return {
            inScreen : inScreen,
            setHeaderState : setHeaderState,
            getHeaderState : getHeaderState,
            inScreenHeader : inScreenHeader,
            setScrollHandling : setScrollHandling
        };

        function setScrollHandling(delay){
            var sc =  angular.copy(scrollHandling);
            sc.delay = delay || sc.selay;
            return sc;
        }
        function getHeaderState(){
            return headerState;
        }

        function setHeaderState(s){
            headerState = s;
        }

        function inScreen(element){
            var $window = $(window);
            var w_bottom = $window.scrollTop() + $window.height(); //distancia al top + altura del viewport = posición del bottom del content
            var top = element.offset().top; //posición a top independiente del scroll
            var height = element.height(); //su altura
            var bottom = top + height; //parte inferior
            return (top > $window.scrollTop() && top < w_bottom) || 
                   (bottom > $window.scrollTop() && bottom < w_bottom) ||
                   (height > $window.height() && top < $window.scrollTop() && bottom > w_bottom);
        }

        function inScreenHeader(element){
            var precision = 15;

            var $window = $(window);
            var w_bottom = ($window.scrollTop() + $window.height())-(($window.height()/precision)*(Math.ceil(precision/2))); //distancia al top + altura del viewport = posición del bottom del content
            var w_top = $window.scrollTop() + (($window.height()/precision)*(Math.ceil(precision/2)-1));
            var top = element.offset().top; //posición a top independiente del scroll
            var height = element.height(); //su altura
            var bottom = top + height; //parte inferior

            return (top >= w_top && top < w_bottom) || 
                   (bottom > w_top && bottom <= w_bottom) ||
                   (height > ($window.height()/precision) && top <= w_top && bottom >= w_bottom);
        }
    }]);