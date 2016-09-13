angular.module('app').directive('userInformation', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/information/information.html',
    controllerAs: 'userInformation',
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.root = $rootScope;
        $scope.state = {isEditable : false};
        /*******************
        ***NEW USER INFO****
        *******************/
        $scope.saveOtherInfo = function(){
            //todo
            console.log('to do');
        };

    }
  };
});
