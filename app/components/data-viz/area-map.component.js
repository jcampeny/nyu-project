angular.module('app').directive('nyuAreaMap', function (mapVariablesService) {
  return {
    restrict: 'E',
    require : '^^nyuDataViz',
    templateUrl : '../app/components/data-viz/templates/area-map.html',
    controllerAs: 'nyuAreaMap',
    scope: {
        viewController: '='
    },
    controller: function ($scope, $rootScope, $filter, $q, EntitiesService, DataService, $state, deviceDetector) {
        $scope.parent = $scope.$parent.$parent;
        $scope.root = $rootScope;
        /******************
        **** VARIABLES ****
        ******************/
        $scope.countries             = $scope.parent.countries;
        $scope.indicators            = $scope.parent.indicators;
        $scope.cartogramIndicators   = $scope.parent.cartogramIndicators;
        $scope.years                 = $scope.parent.years;
        $scope.cartogramYears        = $scope.parent.cartogramYears;
        $scope.colorByClassification = $scope.parent.colorByClassification;

        $scope.selectedCountry               = $scope.parent.selectedCountry;
        $scope.selectedIndicators            = $scope.parent.selectedIndicators;
        $scope.selectedYears                 = $scope.parent.selectedYears;
        $scope.selectedScale                 = $scope.parent.selectedAreaMapScale;
        $scope.selectedGeneralRadio          = $scope.parent.selectedAreaMapGR;
        $scope.selectedColorByClassification = $scope.parent.selectedAreaMapCBC;
        $scope.selectedAnotherColor          = $scope.parent.selectedAreaMapAC;
        $scope.selectedBubble                = $scope.parent.selectedAreaMapBubble;
        $scope.selectedOtherColorVar         = $scope.parent.selectedAreaMapOCV;

        $scope.temporalCountry               = angular.copy($scope.selectedCountry);
        $scope.temporalIndicators            = angular.copy($scope.selectedIndicators);
        $scope.temporalYears                 = angular.copy($scope.selectedYears);
        $scope.temporalScale                 = angular.copy($scope.selectedScale);
        $scope.temporalGeneralRadio          = angular.copy($scope.selectedGeneralRadio);
        $scope.temporalColorByClassification = angular.copy($scope.selectedColorByClassification);
        $scope.temporalAnotherColor          = angular.copy($scope.selectedAnotherColor);
        $scope.temporalBubble                = angular.copy($scope.selectedBubble);
        $scope.temporalOtherColorVar         = angular.copy($scope.selectedOtherColorVar);

        $scope.popUpCountry      = angular.copy($scope.temporalCountry);
        $scope.popUpIndicators   = angular.copy($scope.temporalIndicators);
        $scope.popUpYears        = angular.copy($scope.temporalYears);
        $scope.popUpAnotherColor = angular.copy($scope.temporalAnotherColor);
        $scope.popUpBubble       = angular.copy($scope.temporalBubble);
    },
    link: function (s, e, a){
        s.temporalToSelect = function(){
            //general radio
            s.selectedGeneralRadio.size   = s.temporalGeneralRadio.size;
            s.selectedGeneralRadio.color  = s.temporalGeneralRadio.color;
            s.selectedGeneralRadio.marker = s.temporalGeneralRadio.marker;
            //country
            s.selectedCountry.items = s.temporalCountry.items;
            s.selectedCountry.name  = s.temporalCountry.name;
            //indicators
            s.selectedIndicators.items = s.temporalIndicators.items;
            //years
            s.selectedYears.start = s.temporalYears.start;
            s.selectedYears.end   = s.temporalYears.end;
            //scale
            s.selectedScale.percent = s.temporalScale.percent;
            //color
            //color select
            s.selectedColorByClassification.name = s.temporalColorByClassification.name;
            s.selectedColorByClassification.id   = s.temporalColorByClassification.id;
            //another color
            s.selectedAnotherColor.indicators.items = s.temporalAnotherColor.indicators.items;
            s.selectedAnotherColor.country.items    = s.temporalAnotherColor.country.items;
            s.selectedAnotherColor.country.name     = s.temporalAnotherColor.country.name;
            s.selectedAnotherColor.years.start      = s.temporalAnotherColor.years.start;
            s.selectedAnotherColor.years.end        = s.temporalAnotherColor.years.end;
            //bubbles
            s.selectedBubble.indicators.items = s.temporalBubble.indicators.items;
            s.selectedBubble.country.items    = s.temporalBubble.country.items;
            s.selectedBubble.country.name     = s.temporalBubble.country.name;
            s.selectedBubble.years.start      = s.temporalBubble.years.start;
            s.selectedBubble.years.end        = s.temporalBubble.years.end;
            //other color variables
            s.selectedOtherColorVar.maximum  = s.temporalOtherColorVar.maximum;
            s.selectedOtherColorVar.blending = s.temporalOtherColorVar.blending;
            //close popUp
            s.viewController.goBack();
        };
        
    }
  };
});
