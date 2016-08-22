
angular.module('app').service("ChartsService",[function() {
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
