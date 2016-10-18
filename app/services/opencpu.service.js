
angular.module('app').service("OpenCPUService",['$http', function( $http ) {
		var gmPath = "http://52.32.163.154/ocpu/library/cagecomparator/R/gravity.model/json";

	    return({
			gm: gm
		});

		function gm(data){
	    	return $http({
		        method: "POST",
		        url: gmPath,
		        data: data
        	});
	    }

	}]);
