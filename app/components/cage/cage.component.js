angular.module('app').directive('nyuCage', function (deviceDetector, $window, $rootScope, PopupService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http) {
        $scope.root = $rootScope;
        
        /**********************
        TEMPORAL SCOPES FILTERS
        **********************/
        $scope.bindTemporalScopes = function(){
            var from = 'temporal';
            angular.forEach(arguments, function(argument){
                if(argument == 'fromPopUp'){
                    from = 'popUp';                   
                }
                $scope['selected'+argument] = angular.copy($scope[from+argument]);
            });
        };

        $scope.selectedCountry = {
            name : "",
            items : []
        };
        $scope.selectedIndicators = {
            items : []
        };
        $scope.selectedDistanceVariables = {
            items : {}
        };

        $scope.temporalCountry = {
            name : "Spain",
            items : ["Spain"]
        };
        $scope.temporalIndicators = {
            items : [
                {name: 'Exports', parent: 'Merchandise Trade'}/*,
                {name: 'Imports', parent: 'Merchandise Trade'}*/
            ]
        };
        $scope.temporalDistanceVariables = {
            items : {}
        };

        $scope.popUpIndicators = angular.copy($scope.temporalIndicators);
        $scope.popUpCountry = angular.copy($scope.temporalCountry);

        $scope.selectedYears = {
            start: "2005",
            end : "2015"
        };


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
        });

        $scope.indicators = {
            "Trade" : {
                "Merchandise Trade" : [
                    {name: 'Exports', default: false},
                    {name: 'Imports', default: false}
                ],
                "Services Trade" : [
                    {name: 'Exports', default: false},
                    {name: 'Imports', default: false}
                ],
                "Test" : [
                    {name: 'test', default: false}
                ]
            },
            "Capital" : {
                "FDI stocks" : [
                    {name: 'Outward flows', default: false},
                    {name: 'Inward flows', default: false}
                ],
                "FDI flows" : [
                    {name: 'Outward stocks', default: false},
                    {name: 'Inward stocks', default: false}
                ]
            }
        };
        
        /*$scope.distanceVariables = {
        	"Cultural" : {
        		"CEPII Language" : [
		        	{
                       "classvar": "clang",
                       "name": "Common official language",
                       "varname": "lang.col",
                       "default": false,
                       "value" : 0.125
                    }
                ],
                "Dow and Karunaratna": [
                    {
                       "classvar": "dkvars",
                       "name": "Same language",
                       "varname": "dk.same_language",
                       "default": false,
                       "value" : 0.125
                    }
                ]
        	}
        };*/
        $scope.countries = {
            "Individual Countries" : [
                {name : "Afghanistan"},
                {name : "Albania"},
                {name : "Etc."}
            ],
            "World" : [
                {name : "Total, all countries"}
            ],
            "Region" : [
                {name : "East Asia and Pacific"},
                {name : "Europe"},
                {name : "Middle East and North Africa"},                
                {name : "North America"},
                {name : "South and Central America, Caribbean"},
                {name : "South and Central Asia"},
                {name : "Sub-Saharan Africa"}
            ],
            "Continent" : [
                {name : "Africa"},
                {name : "Asia"},
                {name : "Europe"},                
                {name : "North America"},
                {name : "Oceania"},
                {name : "South America"}
            ],
            "Income level" : [                
                {name : "Low Income"},
                {name : "Lower Middle Income"},
                {name : "Upper Middle Income"},                
                {name : "High Income"}
            ],
            "Development level" : [
                {name : "Emerging and Developing Economies"},
                {name : "Advanced Economies"}
            ],
            "Trade blocs" : [
                {name : "ASEAN"},
                {name : "CARICOM"},
                {name : "ECOWAS"},                
                {name : "EFTA"},
                {name : "European Union"},
                {name : "MERCOSUR"},
                {name : "NAFTA"},
                {name : "SICA"}
            ],
            "Regional Groups" : [                
                {name : "APEC"},
                {name : "African Union"},
                {name : "Commonwealth of Nations"},                
                {name : "La Francophonie"},
                {name : "Organization of American States"}
            ]
        };

    },
    link: function(s, e, a){
        /**************************
        **Impacts view CONTROLLER**
        **************************/
        s.checkSomeActiveIndicator = function(sliders){
            var found = false;
            angular.forEach(sliders, function(slider){
                angular.forEach(slider, function(sliderItem){
                    if(sliderItem.default) found = true;
                });
            });
            return found;
        };
        /*******************
        **TABLE CONTROLLER**
        *******************/
        s.deviceDetector = deviceDetector;
        s.propertyName = 'geographicDistance';
        s.reverse = true;

        s.sortBy = function(propertyName) {
            if(typeof propertyName == 'object'){
                propertyName = propertyName.target.options[propertyName.target.selectedIndex].value;
                s.reverse = true;
            }else{
                s.reverse = (s.propertyName === propertyName) ? !s.reverse : true;
            }
            s.propertyName = propertyName;
        };

        s.tableResult = [
            {name : 'Portugal', geographicDistance : '00', cageDistance : '01', size: '00', actual: '00', predicted : '01', predictedFull : '03'},
            {name : 'France', geographicDistance : '00', cageDistance : '02', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Morocco', geographicDistance : '01', cageDistance : '03', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Belgium', geographicDistance : '00', cageDistance : '04', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Italy', geographicDistance : '00', cageDistance : '05', size: '00', actual: '00', predicted : '00', predictedFull : '10'},
            {name : 'Luxembourg', geographicDistance : '01', cageDistance : '06', size: '03', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Slovenia', geographicDistance : '00', cageDistance : '07', size: '04', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Ireland', geographicDistance : '00', cageDistance : '08', size: '00', actual: '06', predicted : '00', predictedFull : '00'},
            {name : 'Germany', geographicDistance : '00', cageDistance : '03', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Malta', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Netherlands', geographicDistance : '00', cageDistance : '00', size: '00', actual: '07', predicted : '90', predictedFull : '00'},
            {name : 'Austria', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '09', predictedFull : '00'},
            {name : 'San Marino', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '05', predictedFull : '00'},
            {name : 'Greece', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'United Kingdom', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Algeria', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '00', predictedFull : '00'},
            {name : 'Cyprus', geographicDistance : '00', cageDistance : '00', size: '00', actual: '00', predicted : '02', predictedFull : '00'}
        ];
        s.tableHeader = [
            {id: 'country', name: "Country"},
            {id: 'geographicDistance', name: "Geographic Distance (km)"},
            {id: 'cageDistance', name: "CAGE Distance"},
            {id: 'size', name: "[Size variable*] (% of rest of world)"},
            {id: 'actual', name: "Actual [activity**] (% of world)"},
            {id: 'predicted', name: "Predicted [activity**] (distance and size effects only, % of world)"},
            {id: 'predictedFull', name: "Predicted [activity**] (full model, % of world)effects only, % of world)"}
        ];

        /*******************
        ***MAP CONTROLLER***
        *******************/
        s.countryMarkers = [
            {id: 'flags', name: "Flags"},
            {id: 'size', name: "Circles Proportional to [Size variable*] (% of rest of world)"},
            {id: 'actual', name: "Circles Proportional to Actual [activity**] (% of world)"},
            {id: 'predicted', name: "Circles Proportional to Predicted [activity**] (distance and size effects only, % of world)"},
            {id: 'predictedFull', name: "Circles Proportional to Predicted [activity**] (full model, % of world) effects only, % of world)"}
        ];
        s.countryMarkerActive = {id: 'flags', name: "Flags"};
        s.distanceShownActive = {id: 'cageDistance', name: "CAGE Distance"};
        /******************
        **VIEW CONTROLLER**
        *******************/


        s.viewController = new PopupService.PopupService('selection', false, 'test');
        //s.viewController.toggleView(true, 'distanceVariables', 'view');
        s.viewController.toggleView(false, '', 'selection');
        //s.viewController.toggleView(true, 'login', 'view', 'big');
        s.layoutView = {
            state : 'table'
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
