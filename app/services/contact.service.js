
angular.module('app')
    .service('ContactService', ['$http' , function($http) {
        return {
            sendContact : sendContact,
            sendFiles : sendFiles
        };

        function sendContact (data){
            return $http
                .post('/php/xhr-contact-form.php', data)
                .then( function(response) {
                    return response.data;
                });
        }

        function sendFiles(email, zip){
            var items = {
                email : email,
                zip : zip
            };
            return $http
                .post('/php/send-file.php', items)
                .then(function(response){
                    console.log(response);
                    return response.data;
                });

        }
    }]);