angular.module('app').directive('nyuCageGravityModeler', function (deviceDetector, $window, $rootScope, $state, mapVariablesService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage-gravity-modeler/cage-gravity-modeler.html',
    controllerAs: 'nyuCageGravityModeler',
    controller: function ($scope, LoginService, $http) {
        $scope.root = $rootScope;
        $scope.firstCalculated = false;
        
        /**********************
        TEMPORAL SCOPES FILTERS
        **********************/
        $scope.bindTemporalScopes = function(){
            var from = 'temporal';
            $scope.firstCalculated = true;
            angular.forEach(arguments, function(argument){
                if(argument == 'fromPopUp'){
                    from = 'popUp';                   
                }
                $scope['selected'+argument] = angular.copy($scope[from+argument]);
            });
        };

        $scope.indicators = mapVariablesService.getData('indicators');
        $scope.years = mapVariablesService.getData('years');

        $scope.selectedIndicators        = { items : []};
        $scope.selectedDistanceVariables = { items : {}};
        $scope.selectedYears             = { start: "2005", end : "2015"};
        $scope.selectedSize              = { gdp : true, population : false};
        $scope.selectedEstimator         = { state : 'ols'}; //RADIO ('ols' || 'ppml')
        $scope.selectedEffects           = { reporter : true, partner : true, year : true };
        $scope.selectedOptions           = { robust : true, omit: true};

        $scope.temporalIndicators        = {items : [{name: 'Exports', parent: 'Merchandise Trade'},{name: 'Imports', parent: 'Merchandise Trade'}]};
        $scope.temporalDistanceVariables = {items : {}};
        $scope.temporalYears             = {start: "2005", end : "2015"};
        $scope.temporalSize              = angular.copy($scope.selectedSize);
        $scope.temporalEstimator         = angular.copy($scope.selectedEstimator);
        $scope.temporalEffects           = angular.copy($scope.selectedEffects);
        $scope.temporalOptions           = angular.copy($scope.selectedOptions);


        $scope.popUpIndicators = angular.copy($scope.temporalIndicators);
        $scope.popUpDistanceVariables = angular.copy($scope.temporalDistanceVariables);
        $scope.popUpYears = angular.copy($scope.temporalYears);

        


        /*************************
        END TEMPORAL SCOPES FILTERS
        *************************/
        
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
            $scope.popUpDistanceVariables = angular.copy($scope.selectedDistanceVariables);
        });


    },
    link: function(s, e, a){
        /*******************
        **TABLE CONTROLLER**
        *******************/

        s.valueToDisplay = [
            {id: 'merchandise', name: "Merchandise exports"},
            {id: 'services', name: "Services exports"},
            {id: 'fdi', name: "FDI outward stocks"},
            {id: 'portfolioEquity', name: "Portfolio equity assets stocks"},
            {id: 'portfolioLongTerm', name: "Portfolio long-term debt stocks"}
        ];
        s.columnToShow = {id: 'merchandise', name: "Merchandise exports"};

        s.tableResult = [
            {name : 'Common official language', merchandise : '00', services : '01', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '01'},
            {name : 'Colonial linkage', merchandise : '00', services : '02', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'TA/RB depending on flow', merchandise : '01', services : '03', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Ratio of pc income (max / min) -- logged', merchandise : '00', services : '04', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Distance (logged)', merchandise : '00', services : '05', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Share a common border', merchandise : '01', services : '06', fdi: '03', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Logged fdi depending on flow', merchandise : '00', services : '07', fdi: '04', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Reporter fixed effects', merchandise : '00', services : '08', fdi: '00', portfolioEquity: '06', portfolioLongTerm : '00'},
            {name : 'Partner fixed effects', merchandise : '00', services : '03', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Year fixed effects', merchandise : '00', services : '00', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
        ];

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
        s.viewController.toggleView(false, '', 'selection', '');
        //s.viewController.popUpController(false, 'closed', 'general', '');
        //state (selection || view)

        /***********************
        ** Distance variables***
        *************************/
        s.printDistanceVariables = function(distanceVariables){
            var itemsToPrint = "";
            var comma = "";
            angular.forEach(distanceVariables, function(cultural){
                angular.forEach(cultural, function(cepii){
                    angular.forEach(cepii, function(items){
                        angular.forEach(items, function(item){
                            if(item.default){
                                if(itemsToPrint !== ""){comma = ", ";}
                                itemsToPrint +=  comma + item.name 
                            } 
                        });
                    });
                });
            });
            return itemsToPrint;
        };

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
