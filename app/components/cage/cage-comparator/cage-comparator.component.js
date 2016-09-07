angular.module('app').directive('nyuCageComparator', function (deviceDetector, $window, $rootScope, $state, mapVariablesService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage-comparator/cage-comparator.html',
    controllerAs: 'nyuCageComparator',
    controller: function ($scope, LoginService, $http) {
        $scope.root = $rootScope;

        $scope.analysisGenerated = false;

        $scope.selectedDistanceVariables = {
            items : {}
        };
        $scope.temporalDistanceVariables = {
            items : {}
        };
        $scope.distanceAnalysisToShow = {
            items : {
                "Cultural" : {}
            }
        };
        $scope.countries = mapVariablesService.getData('country');
        $scope.selectedCountry1 = {
            name : 'Afghanistan'
        };
        $scope.selectedCountry2 = {
            name : 'Albania'
        };
        $http({
          url: 'localdata/content/distance-variables.json',
          method: 'GET'
        }).then(function(response){
            
            angular.forEach(response.data, function(section, key){
                $scope.selectedDistanceVariables.items[key] = {};
                angular.forEach(section, function(subSection){
                    var itemItem = {
                        "classvar": subSection.classvar,
                        "name": subSection.name,
                        "varname": subSection.varname,
                        "default": subSection.default,
                        "value" : Math.round(Math.pow(2,((Math.random())*6) - 3) * Math.pow(10 , 3)) / Math.pow(10,3)
                    };
                    if(typeof $scope.selectedDistanceVariables.items[key][subSection.source] == "undefined"){
                        $scope.selectedDistanceVariables.items[key][subSection.source] = [];
                    }
                    $scope.selectedDistanceVariables.items[key][subSection.source].push(itemItem);
                });
            });
            $scope.temporalDistanceVariables = angular.copy($scope.selectedDistanceVariables);
            $scope.distanceAnalysisToShow = angular.copy($scope.selectedDistanceVariables);

            parseDistanceVariables();
        });
        /*************************
        ****TABLE PARSE + CONTROLLER****
        *************************/
        function parseDistanceVariables (){
            var randomValue = ['No', 'Yes', '503', '1.5'];
            var randomInfo = ['Source: CEPII', 'Various, Year: 2007', 'Source: CEPII, Year: 2002', 'Source: CIA World Factbook, Year: 2008 '];
            angular.forEach($scope.distanceAnalysisToShow.items, function(itemCultural, aKey){
                angular.forEach(itemCultural, function(itemCepii, bKey){
                    angular.forEach(itemCepii, function(item, cKey){
                        item.comparatorValue = randomValue[Math.floor(Math.random() * randomValue.length)];
                        item.comparatorInfo = randomInfo[Math.floor(Math.random() * randomInfo.length)];
                        
                    });
                });
            });
            $scope.temporalDistanceVariables = angular.copy($scope.distanceAnalysisToShow);
            $scope.selectedDistanceVariables = $scope.distanceAnalysisToShow;

            console.log($scope.distanceAnalysisToShow);
        }
        $scope.activatedOptions = function(items){
            var show = false;
            angular.forEach(items, function(itemArray){
                angular.forEach(itemArray, function(item){
                    if(item.default) show = true;
                });
            });
            return show;
        }
        //GENERATE DISTANCE ANALYSIS
        $scope.generateDistanceAnalysis = function(){
            $scope.analysisGenerated = true;
            console.log($scope.selectedCountry1, $scope.selectedCountry2);
        };

    },
    link: function(s, e, a){
        function PopService(state, open, popUpState, popUpSize){
            this.state = state || 'selection';
            this.open = open || false;
            this.popUpState = popUpState || '';
            this.popUpSize = popUpSize || 'big'; //big, normal, sm
            this.lastPopUpState = popUpState || '';

            /*
            * show@boolean: Mostrar o no el popup
            * toPopUpState@String : Determina el contenido a mostrar en el popUp
            * toState@String : Determina el estado de la página (view || selection)
            * setPopUpSize@String : Determina el tamaño del popUp (enfocada a Desktop) (big || normal || sm)
            */
            this.toggleView = function(show, toPopUpState, toState, setPopUpSize){
                this.lastPopUpState = this.popUpState;
                this.open = show || false;
                this.popUpState = toPopUpState;
                this.state = toState || this.state;
                this.popUpSize = setPopUpSize || 'big'; //big, normal, sm
            };

            this.closePopUp = function(){
                this.open = false;
            };
        }

        s.viewController = new PopService('selection', false, 'test');
        //s.viewController.toggleView(true, 'distanceVariables', 'view');
        //s.viewController.toggleView(true, 'distanceVariables', 'selection');
        s.viewController.toggleView(false, '', 'selection');

        /************************
        **USER LOGIN CALLBACK**
        ***********************/
        s.userLoginCallback = function(){
            s.viewController.popUpController(true, 'userRegisterPremium', '', 'xs');
        };
        s.viewTerms = function(){
            s.viewController.popUpController(true, 'userRegisterTerms');
        };
    }
  };
});
