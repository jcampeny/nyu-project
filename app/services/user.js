angular.module('app')
.service("UserService", [ 'AuthService', '$state', '$window', '$q', 'APPLICATION_CONFIG', function( AuthService, $state, $window, $q, APPLICATION_CONFIG) {
	var userInfo = null;

  function getUser(){
    return userInfo;
  }

  function setUser(newUserInfo){
    userInfo = newUserInfo;
    $window.localStorage[APPLICATION_CONFIG.NAME+".user_info"] = JSON.stringify(newUserInfo);
  }

  function isUserLogged(){
  	return userInfo !== null;
  }

  function login(username, password){
    var deffered = $q.defer();
  	AuthService.login(username, password).then(function(response){
      setUser(response);
      deffered.resolve('ok');

    },function(error){
      deffered.reject(error);
    });
    return deffered.promise;
  }

  function logout(){
    AuthService.logout();
	  userInfo = null;
    delete $window.localStorage[APPLICATION_CONFIG.NAME+".user_info"];
	  $state.go("app.login");
  }

  function init(){
    if(userInfo === null && typeof $window.localStorage[APPLICATION_CONFIG.NAME+".user_info"] !== "undefined" &&
				$window.localStorage[APPLICATION_CONFIG.NAME+".user_info"] !== "undefined"){
      userInfo = JSON.parse($window.localStorage[APPLICATION_CONFIG.NAME+".user_info"]);
    }
  }
  init();

  return {
    getUser: getUser,
    isUserLogged: isUserLogged,
    login: login,
    logout: logout
  };
}]);
