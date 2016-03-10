angular.module('app')
    .service("AuthService", ['$q', 'ArrayService', '$http',
    function( $q, ArrayService, $http) {
        function login(username, password){
          var deffered = $q.defer();

          $http({
              method: "POST",
              url: "/php/auth.php",
              data: {'action':'login','data':{username: username, password: password}}
          }).then(function(result){
            if(typeof result.data !== "undefined" && typeof result.data.status !== "undefined" && result.data.status === "OK"){
              deffered.resolve(result.data.data);
            }else{
              deffered.reject('INVALID_USER');
            }

          }, function (error){
            deffered.reject(error);
          });

          return deffered.promise;
        }

        function logout(){
          $http({method: "POST",url: "/php/auth.php",data: {'action':'logout'}});
        }

        return {
            login: login,
            logout: logout
        };
    }])
    .service("LogService", ['API_CONFIG', '$firebaseArray', '$firebaseObject', 'UserService', function(API_CONFIG, $firebaseArray, $firebaseObject, UserService) {
      function registerLog(infograph){
        var user = UserService.getUser();
        var now = new Date();

        var infoCase = getInfographCase(infograph).split("_");
        var layoutConfig = infoCase[0]+" datapoints:";
        if(infograph.whoTheyAre.age){layoutConfig = layoutConfig+" Age";}
        if(infograph.whoTheyAre.gender){layoutConfig = layoutConfig+" Gender";}
        if(infograph.whoTheyAre.genderAge){layoutConfig = layoutConfig+" Gender&Age";}

        if(infograph.howTheyListen !== null && infograph.howTheyListen !== "null" && infograph.howTheyListen !== ""){
          layoutConfig = layoutConfig+" // "+infograph.howTheyListen;
        }

        if(infograph.WhatTheyAreStreaming){
          layoutConfig = layoutConfig+" // Genre";
        }

        var newLog = {user: user.username, timestamp: +now, segment: infograph.segmentName, layout: layoutConfig};
        var logs = $firebaseArray(new Firebase(API_CONFIG.BASE_URL+"logs"));
        logs.$add(newLog);
      }

      return {registerLog: registerLog};
    }]);
