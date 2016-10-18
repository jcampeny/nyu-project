angular.module('app').directive('nyuCageGravityModeler', function (deviceDetector, $window, $rootScope, $state, mapVariablesService, PopupService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage-gravity-modeler/cage-gravity-modeler.html',
    controllerAs: 'nyuCageGravityModeler',
    controller: function ($scope, LoginService, $http, OpenCPUService) {
        $scope.root = $rootScope;
        $scope.firstCalculated = false;
        

        var varNames = {
            "comlang_off" :"Common official language", 
            "colony"      :"Colonial linkage", 
            "ldistw"      :"Distance (logged)", 
            "contig"      :"Share a common border"
        };

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

        $scope.loading = false;
        $scope.calculate = function(){
            $scope.viewController.state = 'selection';
            $scope.loading = true;
            $scope.bindTemporalScopes('Indicators',/* 'DistanceVariables', */'Years', 'Size', 'Estimator', 'Effects', 'Options');
            console.log($scope.selectedDistanceVariables, $scope.selectedDistanceVariables);
            OpenCPUService.gm({
                    "dataset"   : "SELECT gci.*,cepi.comlang_off, cepi.colony, LN(cepi.distw) as ldistw, cepi.contig, LN(oe_1.value*oe_2.value) as lgdp1xgdp2, 0 as lgdppcratio FROM GCI gci INNER JOIN CEPIIGeoDist cepi ON cepi.iso1 = gci.iso1 AND cepi.iso2 = gci.iso2 INNER JOIN OxfordEconomics oe_1 ON oe_1.iso = gci.iso1 AND oe_1.year = gci.year  AND oe_1.code='GDP$!' INNER JOIN OxfordEconomics oe_2 ON oe_2.iso = gci.iso2 AND oe_2.year = gci.year AND oe_2.code='GDP$!' WHERE gci.code='m.exports' AND gci.year>=2014 AND gci.year <= 2015",
                    "dep.vars"  : "value",
                    "distance.vars" : ["comlang_off", "colony", "ldistw", "contig"],
                    "size.vars" : "lgdp1xgdp2",
                    "years" : getSelectedYears(),
                    "olsppml" : $scope.selectedEstimator,
                    "rse" : $scope.selectedEffects.reporter,
                    "crfx" : $scope.selectedEffects.partner,
                    "yfx" : $scope.selectedEffects.year
                }).then(function(result){
                console.log(result);
                $scope.tableResult = [];

                angular.forEach(result.data,function(d){
                    if(d.multiplier){
                        $scope.tableResult.push({
                            varName : varNames[d.var], 
                            varData : [{ value:d.coef+d.stars, error:d.se }]
                        });
                    }
                });

                $scope.loading = false;
                $scope.viewController.state = 'view';
            });
        };

        function getSelectedYears(){
            var years = [$scope.selectedYears.start];

            for(var i=$scope.selectedYears.start ; i<=$scope.selectedYears.end ; i++){
                years.push(i);
            }
            return years;
        } 

        $scope.indicators = mapVariablesService.getData('indicators');
        $scope.years = mapVariablesService.getData('years');

        $scope.selectedIndicators        = { items : [{name: 'Exports', parent: 'Merchandise Trade'}]};
        $scope.selectedDistanceVariables = { items : {}};
        $scope.selectedYears             = { start: "2005", end : "2015"};
        $scope.selectedSize              = { gdp : true, population : false};
        $scope.selectedEstimator         = { state : 'ols'}; //RADIO ('ols' || 'ppml')
        $scope.selectedEffects           = { reporter : true, partner : true, year : true };
        $scope.selectedOptions           = { robust : true, omit: true};

        $scope.temporalIndicators        = {items : [{name: 'Exports', parent: 'Merchandise Trade'}]};
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
            var itemDefaults = [];
            angular.forEach(response.data, function(section, key){
                $scope.selectedDistanceVariables.items[key] = {};
                angular.forEach(section, function(subSection){
                    var itemItem = {
                        "classvar": subSection.classvar,
                        "name": subSection.name,
                        "varname": subSection.varname,
                        "default": subSection["default"],
                        "value" : Math.round(Math.pow(2,((Math.random())*6) - 3) * Math.pow(10 , 3)) / Math.pow(10,3)
                    };

                    if(itemItem.default){itemDefaults.push(itemItem);}
                    if(typeof $scope.selectedDistanceVariables.items[key][subSection.source] == "undefined"){
                        $scope.selectedDistanceVariables.items[key][subSection.source] = [];
                    }
                    $scope.selectedDistanceVariables.items[key][subSection.source].push(itemItem);
                });
            });
            $scope.temporalDistanceVariables = angular.copy($scope.selectedDistanceVariables);
            $scope.popUpDistanceVariables = angular.copy($scope.selectedDistanceVariables);
            $scope.selectedDistanceVariables = {items: itemDefaults};
        });


    },
    link: function(s, e, a){
        /*******************
        **TABLE CONTROLLER**
        *******************/

        s.valueToDisplay = [
            {id: 'merchandise', name: "Merchandise exports"}
            // {id: 'services', name: "Services exports"},
            // {id: 'fdi', name: "FDI outward stocks"},
            // {id: 'portfolioEquity', name: "Portfolio equity assets stocks"},
            // {id: 'portfolioLongTerm', name: "Portfolio long-term debt stocks"}
        ];
        s.columnToShow = {id: 'merchandise', name: "Merchandise exports"};

        s.tableResult = [
            {name : 'Common official language', merchandise : '00', services : '01', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '01'},
            {name : 'Colonial linkage', merchandise : '00', services : '02', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            // {name : 'TA/RB depending on flow', merchandise : '01', services : '03', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            // {name : 'Ratio of pc income (max / min) -- logged', merchandise : '00', services : '04', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Distance (logged)', merchandise : '00', services : '05', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            {name : 'Share a common border', merchandise : '01', services : '06', fdi: '03', portfolioEquity: '00', portfolioLongTerm : '00'},
            // {name : 'Logged fdi depending on flow', merchandise : '00', services : '07', fdi: '04', portfolioEquity: '00', portfolioLongTerm : '00'},
            // {name : 'Reporter fixed effects', merchandise : '00', services : '08', fdi: '00', portfolioEquity: '06', portfolioLongTerm : '00'},
            // {name : 'Partner fixed effects', merchandise : '00', services : '03', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
            // {name : 'Year fixed effects', merchandise : '00', services : '00', fdi: '00', portfolioEquity: '00', portfolioLongTerm : '00'},
        ];



        s.viewController = new PopupService.PopupService($state.current.name, false, 'closed');
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
                            if(item["default"]){
                                if(itemsToPrint !== ""){comma = ", ";}
                                itemsToPrint +=  comma + item.name ;
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
                    s.viewController.toggleView(true, 'userLog', '', size);
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
