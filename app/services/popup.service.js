
angular.module('app')
    .service('PopupService', function($http, $rootScope, $q){
        var popUpIsOpen = false;
        return {
            openPopUp : openPopUp,
            PopupService : PopupService
        };
        function openPopUp(newState, view) {
            popUpIsOpen = newState;
            $rootScope.$broadcast('openPopUp', {
                state: popUpIsOpen,
                view : view
            });
        }

        function PopupService(state, open, popUpState, popUpSize){
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
    });
