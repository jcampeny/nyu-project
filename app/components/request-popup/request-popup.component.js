angular.module('app')
.controller('nyuRequestPopup', ['$scope', '$uibModalInstance', 'ContactService', function ($scope, $uibModalInstance, ContactService) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
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

    $scope.submitForm = function(){
        if(canSend){
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
				        $( "form" ).fadeOut( "slow", function() {
					        $(".message-send").fadeIn("slow");
				        });
				    }else{
				    	canSend = true;
				    	allOk = false;
				    	$scope.btntxt = 'Retry';
				    }
				}); 
			}
        }
	};

	function toRed(selector){
		$(selector).css({'border' : '1px solid #f95151'});
	}

	function toNormal(selector){
		$(selector).css({'border' : '1px solid #C9CCCB'});
	}

}]);
