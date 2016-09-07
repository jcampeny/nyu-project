
angular.module('app').service("errorService",[function() {
	    return {
			errorHandler : errorHandler
		};

        function errorHandler(){
            this.error = '';
            this.haveError = false;
            this.setError = function (error) {
                this.error = error;
                this.haveError = (error === '') ? false : true;
            };
        }

	}]);
