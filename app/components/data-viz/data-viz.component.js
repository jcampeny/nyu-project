//Controller general de las 6 vistas del data-viz
angular.module('app').directive('nyuDataViz', function($rootScope, $state, mapVariablesService){
    return {
        restrict : 'E',
        templateUrl: '../app/components/data-viz/main.html',
        controller : function ($scope) {
            $scope.root = $rootScope;

            $scope.selectedCountry = {name : "Spain", items : ["Spain"]};
            $scope.selectedIndicators = {
            items : [
                    {name: 'Exports', parent: 'Merchandise Trade'}/*,
                    {name: 'Imports', parent: 'Merchandise Trade'}*/
                ]
            };;
            $scope.selectedYears = {items : []};

            $scope.countries = mapVariablesService.getData('country');
            $scope.indicators = mapVariablesService.getData('indicators');
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
                    this.backState.push(angular.copy(this));
                };
                /*
                * show@boolean: Mostrar o no el popup
                * toPopUpState@String : Determina el contenido a mostrar en el popUp
                * toPopUpView@String : Determina el estado de la vista del popup
                * setPopUpSize@String : Determina el tamaño del popUp (enfocada a Desktop) (big || normal || sm)
                */
                this.popUpController = function(show, toPopUpState, toPopUpView, setPopUpSize, isBacked){
                    this.open = show || false;
                    this.popUpState = toPopUpState;
                    this.popUpView = toPopUpView || '';
                    this.popUpSize = setPopUpSize || 'big'; //big, normal, sm
                    if(isBacked !== true){
                        this.backState.push(angular.copy(this));
                    }
                    
                    
                };

                this.goBack = function(){
                    this.backState.splice(-1,1);
                    var ls = this.backState[this.backState.length - 1];
                    if(ls){
                        this.popUpController(ls.open, ls.popUpState, ls.popUpView, ls.popUpSize, true);
                    }else{
                        this.popUpController(false, 'closed', 'general', '');
                    }
                    
                };

                this.closePopUp = function(){
                    this.popUpController(false, 'closed', 'general', 'big');
                };

                this.lastPopUpState = function(){
                    return this.backState[this.backState.length - 2].popUpState || 'closed';
                }
            }

            s.viewController = new PopService($state.current.name, false, 'closed');

            //s.viewController.toggleView(true, 'userLog', s.actualState, 'big');
            $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                s.viewController.state = $state.current.name;
                s.viewController.backState = [];
            });

            /************************
            **USER LOGIN CALLBACK**
            ***********************/
            s.userLoginCallback = function(){
                s.viewController.toggleView(true, 'userLog', 'view', 'xs');
            };
            s.viewTerms = function(){
                s.viewController.toggleView(true, 'userRegisterTerms');
            };
        }
    };
});