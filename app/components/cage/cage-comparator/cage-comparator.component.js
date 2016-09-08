angular.module('app').directive('nyuCageComparator', function (deviceDetector, $window, $rootScope, $state, mapVariablesService, PopupService) {
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

        s.viewController = new PopupService.PopupService('selection', false, 'test');
        //s.viewController.toggleView(true, 'distanceVariables', 'view');
        //s.viewController.toggleView(true, 'distanceVariables', 'selection');
        s.viewController.toggleView(false, '', 'selection');

        /************************
        **USER LOGIN CALLBACK**
        ***********************/
        s.userLoginCallback = function(){
            s.viewController.toggleView(true, 'userLog', '', 'xs');
        };
        s.userLogoutCallback = function(){
            s.viewController.toggleView(true, 'userLog', '', 'sm');
        };
        s.viewTerms = function(){
            s.viewController.toggleView(true, 'userRegisterTerms');
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
