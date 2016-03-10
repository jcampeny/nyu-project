
angular.module('app').service("AjaxService",['$http', 'UserService', function( $http, UserService ) {
	    return({
				getUserData: getUserData,
				getInfographicData: getInfographicData,
			});

			function getUserData(data){
				var userInfo = UserService.getUser();
				data.session = userInfo.session;
	    	return $http({
            method: "POST",
            url: "/php/auth.php",
            data: {
                'action':'getUserData',
                'data':data
            }
        });
	    }

			function getInfographicData(data){
				var userInfo = UserService.getUser();
				data.session = userInfo.session;
				return $http({
						method: "POST",
						url: "/php/auth.php",
						data: {
								'action':'getInfographicData',
								'data':data
						}
				});
			}
	}]);
