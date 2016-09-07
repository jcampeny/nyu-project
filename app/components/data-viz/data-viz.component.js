//Controller general de las 6 vistas del data-viz
angular.module('app').directive('nyuDataViz', function($rootScope, $state, mapVariablesService, screenSize, CsvService){
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
            getCSV ();
            function getCSV () {
                CsvService.getCSVFromDataImporter($scope.root.actualUser).then(function(response){
                    console.log(response.data);
                });         
            }

            $scope.selectedCountry = {name : "Spain", items : ["Spain"]};
            $scope.selectedIndicators = {items : [{name: 'Exports', parent: 'Merchandise Trade'}/*,{name: 'Imports', parent: 'Merchandise Trade'}*/]};
            $scope.selectedYears = {start: '2005', end: '2015'};
            

            $scope.countries = mapVariablesService.getData('country');
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
                color : 'another', //(no-color | share | classification | another)
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

            function PopService(state, open, popUpState, popUpSize){
                this.state = state || 'selection';
                this.open = open || false;
                this.popUpState = popUpState || '';
                this.popUpSize = popUpSize || 'big'; //big, normal, sm
                this.lastPopUpState = popUpState || '';
                this.popUpView = ''; //controla el estado de la vista del pop (general || others...)
                this.backState = [];
                this.auxView = ''; //controla la vista del nivel 2 de los settings en desktop
                this.backState.push(angular.copy(this));

                /*
                * show@boolean: Mostrar o no el popup
                * toPopUpState@String : Determina el contenido a mostrar en el popUp
                * toState@String : Determina el estado de la página (view || selection)
                * setPopUpSize@String : Determina el tamaño del popUp (enfocada a Desktop) (big || normal || sm)
                */
                this.toggleView = function(show, toPopUpState, toState, setPopUpSize){
                    this.lastPopUpState = this.popUpState;
                    this.open = show || false;
                    this.popUpState = toPopUpState || 'closed';
                    this.state = toState || this.state;
                    this.popUpSize = setPopUpSize || 'big'; //big, normal, sm
                    this.auxView = '';
                    this.backState.push(angular.copy(this));
                };
                /*
                * show@boolean: Mostrar o no el popup
                * toPopUpState@String : Determina el contenido a mostrar en el popUp
                * toPopUpView@String : Determina el estado de la vista del popup
                * setPopUpSize@String : Determina el tamaño del popUp (enfocada a Desktop) (big || normal || sm)
                */
                this.popUpController = function(show, toPopUpState, toPopUpView, setPopUpSize, isBacked, auxView){
                    this.open = show || false;
                    this.popUpState = toPopUpState;
                    this.popUpView = toPopUpView || '';
                    this.popUpSize = setPopUpSize || 'big'; //big, normal, sm
                    this.auxView = auxView || '';

                    if(isBacked !== true){
                        this.backState.push(angular.copy(this));
                    }
                };

                this.showAuxView = function(auxView){
                    this.auxView = auxView;
                    this.backState.push(angular.copy(this));
                };

                this.goBack = function(){
                    this.backState.splice(-1,1);
                    var ls = this.backState[this.backState.length - 1];
                    if(ls){
                        this.popUpController(ls.open, ls.popUpState, ls.popUpView, ls.popUpSize, true, ls.auxView);
                    }else{
                        this.popUpController(false, 'closed', 'general', '');
                    }
                    
                };

                this.closePopUp = function(){
                    this.popUpController(false, 'closed', 'general', 'big');
                };

                this.lastPopUpState = function(){
                    return this.backState[this.backState.length - 2].popUpState || 'closed';
                };

                this.reset = function(){
                    this.backState = [];
                    this.popUpController(false, 'closed', 'general', '');
                };
            }

            s.viewController = new PopService($state.current.name, false, 'closed');

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
            }

            /************************
            **USER LOGIN CALLBACK**
            ***********************/
            s.userLoginCallback = function(){
                s.viewController.popUpController(true, 'userRegisterPremium', '', 'xs');
            };
            s.userLogoutCallback = function(){
                s.viewController.popUpController(true, 'userLog', '', 'sm');
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
                        s.viewController.popUpController(true, 'userLog', '', 'sm');
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