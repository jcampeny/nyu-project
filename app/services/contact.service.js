
function ContactService($http, config) {
    function sendContact(data) {
        return $http
            .post('/php/xhr-contact-form.php', data)
            .then(function(response) {
                //console.log(response);
                return parseInt(response.data);
            });
    }

    return {
        sendContact: sendContact
    };
}

angular
    .module('app')
    .factory('ContactService', ContactService);
