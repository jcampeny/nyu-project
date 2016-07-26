angular.module('app').directive('nyuCage', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http) {
    	/*LoginService.getDataWoo().then(function(response){
            //console.log(response);
        });
        LoginService.createUser();*/
        //$('iframe').load(function(){
            //setTimeout(function(){console.log($('iframe')[0].contentWindow.localStorage.getItem('id')); },2000);
            
        //});
        var apiHost = 'http://nyu.com/wordpress/wp-json';

            $http.post( apiHost + '/jwt-auth/v1/token', {
                username: 'john.doe3',
                password: 'asd'
              } )

              .then( function( response ) {
                console.log( response.data );
              } )

              .catch( function( error ) {
                console.log( 'Error', error.data[0] );
              } );
    }
  };
});
