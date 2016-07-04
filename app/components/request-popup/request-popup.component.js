
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
			msg : ''
		};
		$scope.btntxt = 'Send request';
	    var canSend = true;
		var allOk = true;
		$scope.requestSent = false;

	    $scope.submitForm = function(){
	        if(canSend){
	        	allOk = true;
	            //canSend = false;
	            $scope.btntxt = 'Sending...';
	            

	            var today = new Date();
	            today = Date.parse(today);
	            var dateForm = Date.parse($scope.msg.date);

				if($scope.msg.name === ''){ 
					toRed('#name'); allOk = false;		 
				}else{ 
					toNormal('#name');
				}

				if($scope.msg.organization === ''){ 
					toRed('#organization');allOk = false; 
				}else{ 
					toNormal('#organization');
				}

				if($scope.msg.date === '' || isNaN(dateForm) || ((today - dateForm) > 86400000)){ 
					toRed('#date'); allOk = false;		 
				}else{ 
					toNormal('#date');
				}

				if($scope.msg.email  === ''){ 
					toRed('#email'); allOk = false;		 
				}else{ 
					toNormal('#email');
				}

				if($scope.msg.phone === ''){ 
					toRed('#phone'); allOk = false;		 
				}else{ 
					toNormal('#phone');
				}
				if(allOk){
					ContactService.sendContact($scope.msg).then(function(response){
					    if(response > 0){
					    	$scope.requestSent = true;
					    }else{
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
    	$rootScope.$on('openPopUp', function(event, data) {
    	    console.log(data);
    	    if(data.state){
    	    	$(e).addClass('show-pop-up');
    	    	$('body').addClass('overflow');
    	    }else{
    	    	$(e).removeClass('show-pop-up');
    	    	$('body').removeClass('overflow');
    	    }
    	});
    }
  };
});

