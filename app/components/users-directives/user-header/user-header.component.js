angular.module('app').directive('userHeader', function (LoginService, $http, $rootScope, $uibModal) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/user-header/user-header.html',
    controllerAs: 'userHeader',
    scope : {
        color : '@', //#282A39
        strokeWidth : '@'
    },
    controller: function ($scope) {
        $scope.root = $rootScope;
        $scope.validUser = {
            log : true,
            share : true,
            help : true,
            download : true
        };
        //lanza un evento al rootScope, el name equivale al nombre de la scope
        //en el caso de share sera name = share
        //entonces cuando recojas este evento checkeas name == 'share'
        //esta hecho así por si necesitas el evento en cualquier otra directiva
        //los eventos se recogen en un switch cage.component.js y data-viz.component.js

        $scope.headerItemClick = function(name){
            $rootScope.$broadcast('userHeaderClick', {
                name : name
            });
        }

        $scope.downloadPopup = function(){
            $uibModal.open({
                templateUrl: '../app/components/data-viz/templates/popup-download.html',
                controller: "popUpDownload",
                size: 's'
            });
        };

        $scope.sharePopup = function(){
            $uibModal.open({
                templateUrl: '../app/components/data-viz/templates/popup-share.html',
                controller: "sharePopup",
                size: 's'
            });
        };

    }
  };
});

angular.module('app').controller('popUpDownload', ['$scope', '$rootScope', '$uibModalInstance', 
    function($scope, $rootScope, $uibModalInstance) {
        $scope.root = $rootScope;

        $scope.exportPng = function(){
            saveSvgAsPng(document.getElementById("map"), $rootScope.exportedName);
            
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
]);

angular.module('app').controller('sharePopup', ['$scope', '$rootScope', '$uibModalInstance', 
    function($scope, $rootScope, $uibModalInstance) {
        $scope.root = $rootScope;

        $scope.root.shareLink = 'http://52.32.163.154/data-viz/area-map';
        $scope.title = 'Data Viz NYU';
        $scope.content = 'Data Viz Content';
        $scope.picture = 'http://52.32.163.154/assets/img/share_nyu.jpg';
        
        $scope.close = function () {
            $uibModalInstance.close();
        };
    }
]);