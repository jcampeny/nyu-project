
angular.module('app')
    .service('ContactService', ['$http' , function($http) {
        return {
            sendContact : sendContact
        };

        function sendContact (data){
            return $http
                .post('/php/xhr-contact-form.php', data)
                .then( function(response) {
                    return response.data;
                });
        }
    }]);