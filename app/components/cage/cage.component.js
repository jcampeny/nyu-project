angular.module('app').directive('nyuCage', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http) {
        var emptyUser = {
            name : "",
            email : "",
            nicename : "",
            other : "",
            logged : false,
            pass : ""
        };
        $scope.register = {};
        //obtenemos la información del localStorage
        $scope.user = LoginService.getStorageUser() || angular.copy(emptyUser);

        /*******************
        *******LOGIN*******
        *******************/
        $scope.logIn = function(name, pass){
            if(!$scope.user.logged && name && pass){
                LoginService.loginUser(name, pass)
                    .then(function(response){
                        console.log(response);
                        $scope.user.name = response.data.user_display_name;
                        $scope.user.email = response.data.user_email;
                        $scope.user.nicename = response.data.user_nicename;
                        $scope.user.logged = true;
                        $scope.user.other = "";
                        $scope.user.pass = pass;
                        $scope.getCSV();
                        //guardamos a localStorage
                        LoginService.setStorageUser($scope.user);
                        getUserInfo();
                    })
                    .catch( function( error ) {
                        console.log('Error', error.data.message);
                    });                   
            }else{
                console.error('not filled');
            }
        };

        /*******************
        *******LOGOUT******
        *******************/
        $scope.logOut = function(){
            $scope.user = angular.copy(emptyUser);
            LoginService.resetStorageUser();
            $scope.register = {};
            $scope.csv = initCSV();
            $scope.csvArray = [];
        };

        /*******************
        ******USER INFO******
        *******************/
        function getUserInfo(){
            LoginService.getUserInfo($scope.user).then(function(userInfo){
                console.log(userInfo);
                if(typeof userInfo.data == 'object'){
                    $scope.user.other = userInfo.data;
                    LoginService.setStorageUser($scope.user);
                }else{
                    console.error(userInfo);
                }
            });
        }

        /*******************
        ***NEW USER INFO****
        *******************/
        $scope.saveOtherInfo = function(){
            //todo
        };

        /*******************
        ******NEW PASS******
        *******************/
        $scope.saveNewPassword = function(actualPass, newPass, newPassRepeated){
            //todo
            if(newPass == newPassRepeated){
                if($scope.user.pass == actualPass){
                    LoginService.changePassword($scope.user, newPass).then(function(response){
                        console.log(response);
                        if(response.data.status == 'success'){
                            console.log(response.data.content); //all OK                    
                        }else{
                            console.log(response.data.content);//user no exist o pass incorrecta
                        }
                    });
                }else{
                   console.log('Error', 'pass incorrecta'); 
                }
            }else{
                console.log('las passwornd no son iguales');
            }
        };

        /*******************
        ******NEW USER******
        *******************/
        $scope.registerUser = function(isValid){
            if(isValid){
                LoginService.createUser($scope.register).then(function(response){
                    if(response.data.status == 'success'){
                        console.log(response.data.content);
                        $scope.logIn(response.data.content.username, $scope.register.pass);                        
                    }else{
                        console.log(response.data.content);
                    }

                });
            }else{
                console.log('falta algo');
            }
        };  

        /*******************
        ****FORGOT PASS****
        *******************/
        $scope.resetPassword = function(email){
            var randomstring = Math.random().toString(36).slice(-8);
            var user = {
                email : email,
                name : ''
            };
            LoginService.resetPassword(user, randomstring).then(function(message){
                //console.log(randomstring);
                if(message.data.status == 'success'){
                    console.log(message.data.content);
                }else{
                    console.log(message.data);
                }
                //$scope.logIn('jordicq', randomstring);
            });
        }; 

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
            LoginService.setCSV($scope.user, $scope.csv, otherSet).then(function(response){console.log(response);
                if(response.data.status == "success"){
                    console.log(response.data.content);
                    $scope.getCSV();
                }else{
                    console.log(response.data.content);
                }
            });
        };
        
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
