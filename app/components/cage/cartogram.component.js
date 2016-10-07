angular.module('app').directive('nyuCartogram', function (DataVaultService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cartogram.html',
    controllerAs: 'nyuCartogram',
    scope:{
      country            : "=",
      indicator          : "=",
      year               : "=",
      distortion         : "=",
      countryCompTooltip : "="
    },
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.countryCompTooltip);

      scope.$watch('countryCompTooltip',function(newVal, oldVal){
        controller.changeMapOption("compTooltips", newVal);
      });

      scope.$watch('country',function(newVal, oldVal){
        if(newVal !== oldVal){
          controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.countryCompTooltip);
        }
      });

      scope.$watch('distortion',function(newVal, oldVal){
        if(newVal !== oldVal){
          controller.renderMap(scope.country, scope.indicator, scope.year, null, newVal, scope.countryCompTooltip);
        }
      });

      scope.$watch(
          function(){return angular.element(window)[0].innerWidth;},
          function(newVal, oldVal){
            if(newVal != oldVal){
              scope.mapWidth = $('#map-container').width();
              scope.mapHeight = $('#map-container').height();  

              controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.countryCompTooltip);
            }
          }
      );
    },
    controller: function ($scope, $timeout, MapChartsService, mapVariablesService) {
        var dataset, country = "", countryName = "", self = this;
        
        // MapChartsService.fetchFlags();
        MapChartsService.resetMapObject();
        MapChartsService.setType("cartogram");
        MapChartsService.setColorScale();

        this.changeMapOption = function(option, value){
          MapChartsService.setConfigVar(option,value);
        };

        this.renderMap = function(country, indicator, year, countryIso, countryCompTooltip, distortion){


          if(countryIso){
            if(mapVariablesService.getCountryByISO(countryIso) === null){
              return;
            }else{
              country = countryIso;
            }
          }else if(country && country[0]){
            countryName = country[0];
            country = mapVariablesService.getCountryISO(country[0]);
          }

          if(!country || !indicator || !year){
            return;
          }

          MapChartsService.setClickFunction(function(newCountry){
            $scope.country = [mapVariablesService.getCountryByISO(newCountry).name];
            self.renderMap(null, indicator, year, newCountry, countryCompTooltip, distortion);
          });
          MapChartsService.deleteMapLayers();
          MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
          MapChartsService.iniMapLayers();
          MapChartsService.setZoom();
          MapChartsService.setProjection(null);
          MapChartsService.setConfigVar("compTooltips",countryCompTooltip);

          var mapFile = '/localdata/vizdata/cartograms/Exports_'+year+'_'+country+'.json';
          if(distortion && distortion === "no-scale"){
            mapFile = '/localdata/vizdata/countries_50.json';
          }
          // d3.json('/localdata/vizdata/Exports_DEU_2005-2015/Exports_'+$scope.year+'_DEU.json', function(topology) {
          d3.json(mapFile, function(topology) {

              // Read the data for the cartogram
              DataVaultService.getCartogramIndicator('m.exports', country, year).then(function(result){
                dataset = [];

                var data = result.data.data.sort(function(a,b){
                  return parseFloat(a.value) - parseFloat(b.value);
                });
                var totalCountry = 0;
                var worldValues = {};
                var nonZeroValues = 0;
                var skipThreshold = 0.001;

                angular.forEach(data, function(d){
                  if(d.iso1 === "World"){
                    worldValues[d.iso2] = parseFloat(d.value);
                  
                  }else if(d.iso1 === country && d.iso2 === "World"){
                    totalCountry = parseFloat(d.value);
                  }
                });

                angular.forEach(data, function(d){
                  if(d.iso1 === country && d.iso2 !== "World"){
                    d.iso = d.iso2;
                    d.total_percent = parseFloat(d.value) / worldValues[d.iso2] * 100;
                    d.total_received = parseFloat(d.value) / totalCountry * 100;
                    dataset.push(d);
                  }
                });

                dataset = dataset.sort(function(a,b){
                  return parseFloat(a.total_percent) - parseFloat(b.total_percent);
                });
                angular.forEach(dataset,function(d,i){
                  if(d.total_received > skipThreshold && nonZeroValues === 0){
                    nonZeroValues = dataset.length - i;
                  }
                });
                var skipValues = dataset.length - nonZeroValues;
                var percentiles = {
                  "p2"  : skipValues + Math.round(nonZeroValues * 98 / 100),
                  "p4"  : skipValues + Math.round(nonZeroValues * 96 / 100),
                  "p8"  : skipValues + Math.round(nonZeroValues * 92 / 100),
                  "p16" : skipValues + Math.round(nonZeroValues * 84 / 100),
                  "p32" : skipValues + Math.round(nonZeroValues * 68 / 100),
                  "p64" : skipValues + Math.round(nonZeroValues * 46 / 100)
                };

                var percentilesValues = [
                  0,
                  dataset[percentiles.p64].total_percent,
                  dataset[percentiles.p32].total_percent,
                  dataset[percentiles.p16].total_percent,
                  dataset[percentiles.p8].total_percent,
                  dataset[percentiles.p4].total_percent,
                  dataset[percentiles.p2].total_percent
                ];
                  
                MapChartsService.setValueFunction(function(d){
                    if(d){
                      return d.total_percent;      
                    }else{
                      return 0;
                    }
                });                    

                  var maxValue = d3.max(dataset,function(d){return parseFloat(d.total_percent);});
                  var minValue = d3.min(dataset,function(d){return parseFloat(d.total_percent);});
                  dataset.push({iso: country,partner:countryName, partner_percent:"#N/A",total:"0",total_percent:maxValue});

                  MapChartsService.setDataset(dataset, country, percentilesValues);
                  MapChartsService.setTopology(topology, topology.objects['Exports_'+year+'_'+country]);
                  MapChartsService.resetMap();
                  
                  
                  MapChartsService.addLegend(percentilesValues);
              });
          });
        };

        // $scope.updateData = function(){
        //   $scope.year++;
        //   if($scope.year <= 2015){
        //     d3.json('/localdata/vizdata/Exports_DEU_2005-2015/Exports_'+$scope.year+'_DEU.json', function(topology) {
        //         MapChartsService.setTopology(topology, topology.objects['Exports_'+$scope.year+'_DEU']);
        //         MapChartsService.updateData();
        //     });  

        //     $timeout(function(){
        //       $scope.updateData($scope.year+1);
        //     },400);
        //   }
          
          
        // };
    }
  };
});
