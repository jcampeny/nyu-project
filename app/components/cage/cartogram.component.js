angular.module('app').directive('nyuCartogram', function (DataVaultService) {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cartogram.html',
    controllerAs: 'nyuCartogram',
    scope:{
      country: "=",
      indicator: "=",
      year: "="
    },
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      controller.renderMap(scope.country, scope.indicator, 2015);

      scope.$watch('country',function(newVal, oldVal){
        if(newVal !== oldVal){
          controller.renderMap(scope.country, scope.indicator, 2015);
        }
      });

      scope.$watch(
          function(){return angular.element(window)[0].innerWidth;},
          function(newVal, oldVal){
            if(newVal != oldVal){
              scope.mapWidth = $('#map-container').width();
              scope.mapHeight = $('#map-container').height();  

              controller.renderMap(scope.country, scope.indicator, 2015);
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

        this.renderMap = function(country, indicator, year, countryIso){
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
              self.renderMap(null, indicator, year, newCountry);
            });
            MapChartsService.deleteMapLayers();
            MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
            MapChartsService.iniMapLayers();
            MapChartsService.setZoom();
            MapChartsService.setProjection(null);

            // d3.json('/localdata/vizdata/Exports_DEU_2005-2015/Exports_'+$scope.year+'_DEU.json', function(topology) {
            d3.json('/localdata/vizdata/cartograms/Exports_'+year+'_'+country+'.json', function(topology) {

                // Read the data for the cartogram
                DataVaultService.getCartogramIndicator('m.exports', country, year).then(function(result){
                  dataset = [];

                  var data = result.data.data.sort(function(a,b){
                    return parseFloat(a.value) - parseFloat(b.value);
                  });
                  var totalCountry = 0;
                  var worldValues = {};
                  var nonZeroValues = 0;

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

                  angular.forEach(dataset,function(d,i){
                    if(Math.round(d.total_percent) > 0 && nonZeroValues === 0){
                      nonZeroValues = dataset.length - i;
                    }
                  });
                  var skipValues = dataset.length - nonZeroValues;
                  var perncentiles = {
                    "p2"  : skipValues + Math.round(nonZeroValues * 2 / 100),
                    "p4"  : skipValues + Math.round(nonZeroValues * 4 / 100),
                    "p8"  : skipValues + Math.round(nonZeroValues * 8 / 100),
                    "p16" : skipValues + Math.round(nonZeroValues * 16 / 100),
                    "p32" : skipValues + Math.round(nonZeroValues * 32 / 100),
                    "p64" : skipValues + Math.round(nonZeroValues * 64 / 100)
                  };
                    
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

                    MapChartsService.setDataset(dataset, country, perncentiles);
                    MapChartsService.setTopology(topology, topology.objects['Exports_'+year+'_'+country]);
                    MapChartsService.resetMap();
                    
                    
                    MapChartsService.addLegend(minValue, maxValue);
                });
            });
        };

        $scope.updateData = function(){
          $scope.year++;
          if($scope.year <= 2015){
            d3.json('/localdata/vizdata/Exports_DEU_2005-2015/Exports_'+$scope.year+'_DEU.json', function(topology) {
                MapChartsService.setTopology(topology, topology.objects['Exports_'+$scope.year+'_DEU']);
                MapChartsService.updateData();
            });  

            $timeout(function(){
              $scope.updateData($scope.year+1);
            },400);
          }
          
          
        };
    }
  };
});
