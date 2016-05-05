
angular.module('app').service("AjaxService",['$http', function( $http ) {
	    return({
			getData: getData
		});

		function getData(data){
	    	return $http({
		        method: "POST",
		        url: "",
		        data: {
		            'action':'',
		            'data':data
		        }
        	});
	    }

	}]);
