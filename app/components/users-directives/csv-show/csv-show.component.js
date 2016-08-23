angular.module('app').directive('csvShow', function () {
    return {
        restrict: 'E',
        templateUrl: '../app/components/users-directives/csv-show/csv-show.html',
        controllerAs: 'csvShow',
        controller: function ($scope, CsvService, $http, $rootScope) {
            $scope.root = $rootScope;

            //GET CSV FROM DATABASE
            $scope.getCSV = function(){
                CsvService.getCSV($scope.root.actualUser).then(function(response){
                    $scope.csvArray = [];
                    if(response.data.status == "success"){
                        var items = response.data.content;
                        angular.forEach(items ,function(csvItem, i){
                            var obj = {
                                csv : items[i].csv,
                                id : items[i].id,
                                title : items[i].title,
                                content : angular.copy($scope.createCSV.content(items[i].csv, $scope.createCSV.fieldSeparator)),
                                header : angular.copy($scope.createCSV.header(items[i].csv, $scope.createCSV.fieldSeparator)),
                                fieldSeparator : angular.copy($scope.createCSV.fieldSeparator)
                            };
                            items[i] = obj;
                            $scope.csvArray.push(items[i]);
                        });
                        console.log(response.data.content);
                    }else{
                        console.log(response.data.content);
                    }
                }); 
            };
            //Llamamos a la función cuando el usuario hace login
            $scope.getCSV();
            //EXPORT
            //Objeto CSV (se autogenera el contenido y el header)
            $scope.createCSV = {
                fieldSeparator : ';',
                header : function(csv, fieldSeparator){
                    return csv.split(/\n/g).shift().split(fieldSeparator);
                },
                content : function (csv, fieldSeparator){
                    var theContent = csv.split(/\n/g);
                    var header = theContent/*.shift()*/[0].split(fieldSeparator);
                    var contentReturn = [];
                    for (var i = 0; i < theContent.length; i++) {
                        var contentArray = theContent[i].split(fieldSeparator);
                        var row = {};
                        for (var j = 0; j < contentArray.length; j++) {
                            row[header[j]] = contentArray[j];
                        }
                        contentReturn.push(row);
                    }
                    return contentReturn;
                }
            };
            //Activar CSV 
            $scope.viewCSV = function(csv){
                CsvService.activeCSV(csv);
            };
            //Delete CSV
            $scope.deleteCSV = function(csv){
                CsvService.deleteCSV($scope.root.actualUser, csv).then(function(response){
                    if(response.data.status == "success"){
                        console.log(response.data.content);
                        $scope.getCSV();
                        $scope.viewCSV($scope.csvArray[0]);
                    }else{
                        console.log(response.data.content);
                    }
                    
                });
            };
            //get Event al activar un CSV
            $rootScope.$on('activeCSV', function(event, data){
                $scope.activeCSV = data.csv;
                $scope.getCSV();
            });
        }
    };
});
