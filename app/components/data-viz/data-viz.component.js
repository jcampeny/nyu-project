//Controller general de las 6 vistas del data-viz
angular.module('app').directive('nyuDataViz', function($rootScope, $state, mapVariablesService, screenSize, CsvService, PopupService, DataVaultService){
    return {
        restrict : 'E',
        templateUrl : function(e, a){
            var url = '../app/components/data-viz/main.html';
            if(a.desktop){
                url = '../app/components/data-viz/main-desktop.html';
            }
            return url;
        },
        controller : function ($scope) {
            $scope.root = $rootScope;

            /**** TEST CSV IMPORTER ******/
            $rootScope.$on('userLogged', function(event, data){
                getCSV ();
            });
            
            function getCSV () {
                console.log($scope.root.actualUser);
                CsvService.getCSVFromDataImporter($scope.root.actualUser).then(function(response){
                    console.log(response.data);
                });         
            }

            $scope.selectedCountry = {name : "United States", items : ["United States"]};
            $scope.selectedIndicators = {items : [{name: 'Exports', parent: 'Merchandise Trade'}/*,{name: 'Imports', parent: 'Merchandise Trade'}*/]};
            $scope.selectedYears = {start: '2015', end: '2015'};
            

            // $scope.countries = mapVariablesService.getData('country');
            $scope.countries = {};
            DataVaultService.getCountries().then(function(result){
                $scope.countries = {
                    "Individual Countries" : result.data.content.individual,
                    "Region"               : result.data.content.region,
                    "Continent"            : result.data.content.continent,
                    "Income level"         : result.data.content.income,
                    "Development level"    : result.data.content.development
                };
            });

            $scope.indicators = mapVariablesService.getData('indicators');
            $scope.years = mapVariablesService.getData('years');
            $scope.colorByClassification = mapVariablesService.getData('colorByClassification');

            $scope.comparisonTooltips = {
                state : false
            };
            /*************
            ***AREA MAP***
            **************/
            $scope.selectedAreaMapGR ={ //General Radio
                size : 'scale', //(scale | no-scale)
                color : 'share', //(no-color | share | classification | another)
                marker : 'no-markers' // (no-markers | flags | bubbles)
            };
            $scope.selectedAreaMapScale = {
                percent : 20
            };
            $scope.selectedAreaMapCBC = {name : 'Region', id:'region'}; //ColorByClassification
            $scope.selectedAreaMapAC = { //Another Color Indicator
                country : {name : "Spain", items : ["Spain"]},
                indicators : {items : [{name: 'Exports', parent: 'Merchandise Trade'},{name: 'Imports', parent: 'Merchandise Trade'}]},
                years : {start: '2005', end: '2015'}
            };
            $scope.selectedAreaMapBubble = { //Bubbles Proportional to an Indicator
                country : {name : "Spain", items : ["Spain"]},
                indicators : {items : [{name: 'Exports', parent: 'Merchandise Trade'},{name: 'Imports', parent: 'Merchandise Trade'}]},
                years : {start: '2005', end: '2015'}
            };
            $scope.selectedAreaMapOCV = { //Other color variables
                maximum : false,
                blending: false
            };

        },
        link : function (s, e, a){

            s.viewController = new PopupService.PopupService($state.current.name, false, 'closed');

            //s.viewController.toggleView(true, 'userLog', s.actualState, 'big');
            $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                s.viewController.state = $state.current.name;
                s.viewController.auxView = '';
                s.viewController.backState = [];
                s.viewController.popUpController(false, 'closed', 'general', '');
            });

            s.popUpDesktopController = function () {
                return s.viewController.popUpState == 'userLog' || 
                    s.viewController.popUpState == 'userRegister' || 
                    s.viewController.popUpState == 'userRegisterPremium' || 
                    s.viewController.popUpState == 'userUpgradePremium' || 
                    s.viewController.popUpState == 'userRegisterTerms' ||
                    s.viewController.popUpState == 'userSettings';
            };

            /************************
            **USER LOGIN CALLBACK**
            ***********************/
            s.userLoginCallback = function(){
                var size = s.root.actualUser.logged ? 'xs' : 'sm';
                s.viewController.popUpController(true, 'userLog', '', size);
            };
            s.userLogoutCallback = function(){
                var size = s.root.actualUser.logged ? 'xs' : 'sm';
                s.viewController.popUpController(true, 'userLog', '', size);
            };
            s.viewTerms = function(){
                s.viewController.popUpController(true, 'userRegisterTerms');
            };

            /*********************
            ****USER HEADER *****
            ********************/
            $rootScope.$on('userHeaderClick', function(event, data){
                switch (data.name) {
                    case 'log':
                        var size = s.root.actualUser.logged ? 'xs' : 'sm';
                        s.viewController.popUpController(true, 'userLog', '', size);
                        break;
                    case 'share':
                        //code
                        break;
                    case 'help':
                        //code
                        break;
                    case 'download':
                        //code
                        break;
                    default:
                        //default
                }
            });
        }
    };
});