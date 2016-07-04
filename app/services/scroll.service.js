
angular.module('app').service("scrollService",[ '$document','deviceDetector', function($document,deviceDetector) {
	var lastX = 0;
	var lastY = 0;
	$document.bind('touchstart', function(e){//primera posición para touchmove
		e = e.originalEvent;
       	lastY = e.changedTouches[0].clientY;
		lastX = e.changedTouches[0].clientX;
	});	
	return {
		getDirectionOnMouseWheel : getDirectionOnMouseWheel,
		getDirectionOnTouchMove : getDirectionOnTouchMove
	};

	function getDirectionOnMouseWheel(e){//mouseScroll up or down
        var delta = parseInt(e.wheelDelta || -e.detail);

        var sensitive = 20;
        var browser = deviceDetector.browser;

        if(browser == 'firefox'){delta = delta*40;}

        if(delta < sensitive*(-1)){return "down";}
        if(delta > sensitive){return "up";}

        return "";
	}
	function getDirectionOnTouchMove(e){//mobileTouchMove up down left right
		var direction = null;
		e = e.originalEvent;
		var currentY = e.changedTouches[0].clientY;
		var currentX = e.changedTouches[0].clientX;

		//Distancia recorrida
		var pathY = lastY - currentY;
		var pathX = lastX - currentX;

		//Ajustar la sensibilidad (0 siempre up/down, 1 muy sensible a left/right)
		var adjustment = 0;
		
		if(Math.abs(pathY) >= (Math.abs(pathX)*adjustment)){//vertical
			direction = (pathY < 0) ?  "up" :   "down";
		}else {											   //horizontal
			direction = (pathX < 0) ?  "left" :   "right";
		}

        lastX = currentX;
        lastY = currentY;
        return direction;

	}

}]);
