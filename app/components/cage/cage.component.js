angular.module('app').directive('nyuCage', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http, $rootScope) {
        
        $scope.root = $rootScope;

        var emptyUser = {
            name : "",
            email : "",
            nicename : "",
            other : "",
            logged : false,
            pass : "",
            role : 0
        };
        $scope.register = {};
        //obtenemos la información del localStorage
        $scope.user = LoginService.getStorageUser() || angular.copy(emptyUser); 


        /*******************
        ******** CSV *******
        *******************/
        
        //GET CSV FROM DATABASE
        $scope.getCSV = function(){
            LoginService.getCSV($scope.user).then(function(response){
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
                    $scope.viewCSV($scope.csvArray[0]);
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
            $scope.activeCSV = csv;
        };
        //Delete CSV
        $scope.deleteCSV = function(csv){
            LoginService.deleteCSV($scope.user, csv).then(function(response){
                if(response.data.status == "success"){
                    console.log(response.data.content);
                    $scope.getCSV();
                    $scope.viewCSV($scope.csvArray[0]);
                }else{
                    console.log(response.data.content);
                }
                
            });
        };

        /*******************
        *******PAYPAL*******
        *******************/
        $scope.testPOO = function(){
            function product(name) {
              this.name = name;
              this.getname = function(){
                return this.name;
              };
            }
            var p = new product('caca');
            console.log(p.getname());
        };
    }
  };
});
