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

	function getCartogramYears(code, iso){
		return $http.post('/php/woocommerce/cartogram-get-data.php', {
			user : $rootScope.actualUser,
			item : {
				code : code,
				iso : iso,
				reason : 'years'
			}
		});
	}

	function getCartogramIndicators(iso){
		return $http.post('/php/woocommerce/cartogram-get-data.php', {
			user : $rootScope.actualUser,
			item : {
				iso : iso,
				reason : 'indicators'
			}
		});
	}

	return {
		getCartogramIndicator  : getCartogramIndicator,
		getCartogramYears      : getCartogramYears,
		getCartogramIndicators : getCartogramIndicators
	};
}]);
   