angular.module('app').directive('csvUpload', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/users-directives/csv-upload/csv-upload.html',
    controllerAs: 'csvUpload',
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.root = $rootScope;
        /*******************
        ******** CSV *******
        *******************/
        $scope.csv = initCSV();

        function initCSV(){
            return {
                content: null,
                header: false,
                headerVisible: false,
                separator: ';',
                separatorVisible: false,
                result: null,
                //encoding: 'ISO-8859-1',
                //encodingVisible: true
            };
        }

        //SAVE CSV IN DATABASE
        $scope.saveCSV = function(titleSave){
            var otherSet = {
                title : titleSave || $scope.csv.result.filename
            };
            LoginService.setCSV($scope.root.actualUser, $scope.csv, otherSet).then(function(response){
                if(response.data.status == "success"){
                    console.log(response.data.content);
                }else{
                    console.log(response.data.content);
                }
            });
        };
    }
  };
});
