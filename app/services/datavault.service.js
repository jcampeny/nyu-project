angular.module('app')
.service('DataVaultService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope){

	function getCartogramIndicator(code, iso, year){
		return $http.post('/php/woocommerce/data-vault.php', {
			user : $rootScope.actualUser,
			item : {
				code : code,
				iso : iso,
				year : year
			}
		});
	}

	return {
		getCartogramIndicator: getCartogramIndicator
	};
}]);
   