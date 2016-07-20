
angular.module('app').directive('ngPopUp', function (ContactService, $rootScope, PopupService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/request-popup/request-popup.html',
    controllerAs: 'ngPopUp',
    controller: function ($scope) {

    	$scope.close = function () {
    		PopupService.openPopUp(false);
    	};
		$scope.msg = {
			name : '',
			organization : '',
			date : '',
			email : '',
			phone : '',
			msg : '',
			nature : ''
		};
	    var canSend = true;
		var allOk = true;
		$scope.requestSent = {
			request : false,
			contact : false
		};
		$scope.$watch('stateToShow',function(){
			
			$scope.btntxt = 'Send request';
			$scope.msg.nature = '';
		});
		$scope.$watch("myRecaptchaResponse", function(){
			if($scope.myRecaptchaResponse){
				$('div[vc-recaptcha]').css({'border' : '1px solid transparent'});
				$('div[vc-recaptcha]').fadeOut('slow');
			}
		});
	    $scope.submitForm = function(){
	        if(canSend){
	        	allOk = true;

	            $scope.btntxt = 'Sending...';
	            
	            var today = new Date();
	            today = Date.parse(today);
	            var dateForm = Date.parse($scope.msg.date);

	            if(!$scope.myRecaptchaResponse){ 
	            	toRed('div[vc-recaptcha]');allOk = false; 
	            }
				if($scope.msg.nature === '' && $scope.stateToShow == 'contact'){ 
					toRed('.nature'); allOk = false;		 
				}else{ 
					toNormal('.nature');
				}
				if($scope.msg.name === ''){ 
					toRed('.name'); allOk = false;		 
				}else{ 
					toNormal('.name');
				}
				if($scope.msg.name === ''){ 
					toRed('.name'); allOk = false;		 
				}else{ 
					toNormal('.name');
				}

				if(($scope.msg.date === '' /*|| isNaN(dateForm) || ((today - dateForm) > 86400000)*/)  && $scope.stateToShow == 'request'){ 
					toRed('.date'); allOk = false;		 
				}else{ 
					toNormal('.date');
				}

				if($scope.msg.email  === ''){ 
					toRed('.email'); allOk = false;		 
				}else{ 
					toNormal('.email');
				}

				if($scope.msg.phone === '' && $scope.stateToShow == 'request'){ 
					toRed('.phone'); allOk = false;		 
				}else{ 
					toNormal('.phone');
				}
				if(allOk){
					ContactService.sendContact($scope.msg).then(function(response){
					    if(response > 0){
					    	$scope.requestSent[$scope.stateToShow] = true;
					    	$('ng-pop-up').animate({ scrollTop: 0 }, 'slow');
					    }else{
					    	if(response == -1){
					    		toRed('.email');
					    	}
					    	canSend = true;
					    	allOk = false;
					    	$scope.btntxt = 'Retry';
					    }
					}); 
				}else{
					$scope.btntxt = 'Send request';
				}
	        }
		};

		function toRed(selector){
			$(selector).css({'border' : '1px solid #f95151'});
		}

		function toNormal(selector){
			$(selector).css({'border' : '1px solid #C9CCCB'});
		}

    },
    link : function(s, e, a){
    	s.stateToShow = '';
    	$rootScope.$on('openPopUp', function(event, data) {
    		s.stateToShow = data.view;
    		$(".name, .email, .organization, .date, .phone, .nature ").css({'border' : '1px solid #C9CCCB'});
    	    if(data.state){
    	    	$(e).addClass('show-pop-up');
    	    	$('.request-popup-container').css({opacity: 0});
    	    	setTimeout(function(){
    	    		$('body')
    	    			.addClass('overflow')
    	    			.find('#main-content > *:first-child')
    	    			.css({display : 'none'});
    	    			setTimeout(function(){
							$('.request-popup-container').animate({opacity: 1}, 400);
    	    			},400);
    	    	},800);
    	    }else{
    	    	$(e).removeClass('show-pop-up');
    	    	$('body')
    	    		.removeClass('overflow')
    	    		.find('#main-content > *:first-child')
    	    		.css({display : 'block'});
    	    }
    	});
    }
  };
});

