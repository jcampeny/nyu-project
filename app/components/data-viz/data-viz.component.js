//Controller general de las 6 vistas del data-viz
angular.module('app').directive('nyuDataViz', function($rootScope, $state,$interval, mapVariablesService, screenSize, CsvService, PopupService, DataVaultService){
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
            $scope.selectedIndicators = {items : [{name: 'Merchandise Trade Exports', default: true, code: "m.exports",filePrefix: "Exports"}/*,{name: 'Imports', parent: 'Merchandise Trade'}*/]};
            $scope.selectedYears = {start: '2015', end: '2015'};
            
            // $scope.countries = mapVariablesService.countries;
            $scope.countries = function(){
                return mapVariablesService.getData("country");
            };
            $scope.cartogramIndicators = [
                {name: "Trade" , children: [
                        {name: 'Merchandise Trade', children : [
                                {name: 'Exports', default: true, code: "m.exports", filePrefix: "Exports"},
                                {name: 'Imports', default: false, code: "m.imports", filePrefix: "MerchImports"}
                            ]
                        },
                    ]
                },
                {name: "Capital" , children: [
                        {name: 'Portfolio', children : [
                                {name: "Assets Equity stock", default:false, code:"portfolio.assets", filePrefix: "PortfolioAssets"},
                                {name: "Assets Debt stock", default:false, code:"portfolio.debt", filePrefix: "PortfolioDebt"}
                            ]
                        },
                    ]
                },
                {name: "People" , children: [
                        {name: 'Migration People', children : [
                                {name: "Emigrations", default: false, code:"emigration", filePrefix: "Emigration"},
                                {name: "Immigration", default: false, code:"immigration", filePrefix: "Immigration"}
                            ]
                        },
                    ]
                },
                {name: "Information" , children: [
                        {name: 'Printed publications trade', children : [
                                {name: "exports", default:false, code: "ppubs.exports", filePrefix: "PpubsExports"},
                                {name: "imports", default:false, code: "ppubs.imports", filePrefix: "PpubsImports"}
                            ]
                        },
                    ]
                }
            ];
/*
            $scope.cartogramIndicators = [
                {name: "Trade" , children: [
                        {name: 'Merchandise Trade Exports', default: true, code: "m.exports", filePrefix: "Exports"},
                        {name: 'Merchandise Trade Imports', default: false, code: "m.imports", filePrefix: "MerchImports"}
                    ]
                },
                {name: "Capital" , children: [
                        // {name: "Foreign Direct Investment Inward flows", default:false, code:"fdi.inflows", filePrefix: "FdiInflows"},
                        // {name: "Foreign Direct Investment Inward stock", default:false, code:"fdi.instock", filePrefix: "FdiInstock"},
                        // {name: "Foreign Direct Investment Outward flows", default:false, code:"fdi.outflows", filePrefix: "FdiOutflows"},
                        // {name: "Foreign Direct Investment Outward stock", default:false, code:"fdi.outstock", filePrefix: "FdiOutstock"},
                        {name: "Portfolio Assets Equity stock", default:false, code:"portfolio.assets", filePrefix: "PortfolioAssets"},
                        {name: "Portfolio Assets Debt stock", default:false, code:"portfolio.debt", filePrefix: "PortfolioDebt"}
                    ]
                },
                {name: "People" , children: [
                        {name: "Migration People Emigrations", default: false, code:"emigration", filePrefix: "Emigration"},
                        {name: "Migration People Immigration", default: false, code:"immigration", filePrefix: "Immigration"},
                        // {name: "Inbound Tertiary students", default: false, code:"students", filePrefix: "Students"},
                        // {name: "Tourist arrivals", default: false, code:"tourist.arrivals", filePrefix: "TouristArrivals"}
                    ]
                },
                {name: "Information", children: [
                        // {name: "Telephone calls Incoming", default:false, code: "incoming.calls", filePrefix: "IncomingCalls"},
                        // {name: "Telephone calls Outgoing", default:false, code: "outgoing.calls", filePrefix: "OutgoingCalls"},
                        {name: "Printed publications trade exports", default:false, code: "ppubs.exports", filePrefix: "PpubsExports"},
                        {name: "Printed publications trade imports", default:false, code: "ppubs.imports", filePrefix: "PpubsImports"}
                    ]
                }
            ];
*/
            $scope.indicators = function(){
                return mapVariablesService.getData('indicatorsOther');
            };

            $scope.cartogramYears = {start : '2015',end : '2015'};
            $scope.years = function(){
                return mapVariablesService.getData('yearsOther');
            };

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
                indicators : {items : [{name: "Merchandise exports", code: "m.exports"}]},
                years : {start: '2005', end: '2015'}
            };
            $scope.selectedAreaMapBubble = { //Bubbles Proportional to an Indicator
                country : {name : "Spain", items : ["Spain"]},
                indicators : {items : [{name: 'Exports', parent: 'Merchandise Trade'}]},
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