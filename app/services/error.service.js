
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
            this.display = function (selector){
                if(this.haveError || this.error !== ''){
                    $(selector)
                        .text(this.error)
                        .css({'display' : 'block'});                    
                }
            };
            this.hide = function(selector){
                $(selector)
                    .text('')
                    .css({'display' : 'none'}); 
            }
        }

	}]);
