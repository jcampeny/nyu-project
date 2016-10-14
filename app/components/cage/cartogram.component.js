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
      color              : "=",
      colorClasification : "=",
      anotherIndicator   : "=",
      colorOptions       : "=",
      countryCompTooltip : "="
    },
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, scope.countryCompTooltip);
      callRender();

      scope.$watch('countryCompTooltip',function(newVal, oldVal){
        controller.changeMapOption("compTooltips", newVal);
      });

      scope.$watch('indicator',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
          // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, scope.countryCompTooltip);
        }
      },true);

      scope.$watch('country',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
          // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, scope.countryCompTooltip);
        }
      },true);

      scope.$watch('distortion',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          // controller.renderMap(scope.country, scope.indicator, scope.year, null, newVal, scope.color, scope.colorClasification, scope.countryCompTooltip);
          callRender();
        }
      });

      scope.$watch('color',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, newVal, scope.colorClasification, scope.countryCompTooltip);
          callRender();
        }
      });

      scope.$watch('anotherIndicator',function(newVal, oldVal){
        if(newVal.country.name !== oldVal.country.name || 
            newVal.indicators.items[0].name !== oldVal.indicators.items[0].name || 
            newVal.years.start !== oldVal.years.start ||
            newVal.years.end !== oldVal.years.end){
          // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, newVal, scope.countryCompTooltip);
          callRender();
        }
      },true);

      scope.$watch('colorClasification',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, newVal, scope.countryCompTooltip);
          callRender();
        }
      });

      scope.$watch('colorOptions',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
        }
      },true);

      scope.$watch(
          function(){return angular.element(window)[0].innerWidth;},
          function(newVal, oldVal){
            if(newVal != oldVal){
              scope.mapWidth = $('#map-container').width();
              scope.mapHeight = $('#map-container').height();  

              // controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, scope.countryCompTooltip);
              callRender();
            }
          }
      );

      function callRender(){
        controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, scope.anotherIndicator, scope.colorOptions, scope.countryCompTooltip);
      }
    },
    controller: function ($scope, $timeout, $uibModal, MapChartsService, mapVariablesService) {
        var dataset, country = "", countryName = "", self = this;
        var lastValidCountry = "United States";

        $scope.dataSource = "";

        // MapChartsService.fetchFlags();
        MapChartsService.resetMapObject();
        MapChartsService.setType("cartogram");

        this.changeMapOption = function(option, value){
          MapChartsService.setConfigVar(option,value);
        };

        this.renderMap = function(country, indicator, year, countryIso, distortion, color, colorClasification, anotherIndicator, colorOptions, countryCompTooltip){
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
            $scope.errorPopup();
            $scope.country = [lastValidCountry];
            return;
            
          }

          MapChartsService.setColorScale(color,colorClasification);
          MapChartsService.setClickFunction(function(newCountry){
            $scope.country = [mapVariablesService.getCountryByISO(newCountry).name];
            self.renderMap(null, indicator, year, newCountry, distortion, color, colorClasification, countryCompTooltip);
          });
          MapChartsService.deleteMapLayers();
          MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
          MapChartsService.iniMapLayers();
          MapChartsService.setZoom();
          MapChartsService.setProjection(null);
          MapChartsService.setConfigVar("compTooltips",countryCompTooltip);

          if(colorOptions){
            MapChartsService.setConfigVar("colorBlending",colorOptions.blending);
            MapChartsService.setConfigVar("colorMax",colorOptions.maximum);  
          }

          var mapFileName = indicator[0].filePrefix+'_'+year+'_'+country;
          var mapFile = '/localdata/vizdata/cartograms/'+indicator[0].filePrefix+'_'+year+'_'+country+'.json';
          if(distortion && distortion === "no-scale"){
            mapFile = '/localdata/vizdata/countries_50.json';
            mapFileName = 'countries_50_geo';
            MapChartsService.setProjection("equirectangular");
            MapChartsService.setConfigVar("hasDistortion",false);
          }else{
            MapChartsService.setConfigVar("hasDistortion",true);
          }
          // d3.json('/localdata/vizdata/Exports_DEU_2005-2015/Exports_'+$scope.year+'_DEU.json', function(topology) {
          d3.json(mapFile, function(topology) {
              if(!topology){
                $scope.errorPopup();
                $scope.country = [lastValidCountry];
                return;
              }
              lastValidCountry = mapVariablesService.getCountryByISO(country).name;

              // Read the data for the cartogram
              var dataVaultRequest = {indicator: "m.exports", country: country, year:[year, year]};

              DataVaultService.getCartogramIndicator(dataVaultRequest.indicator, dataVaultRequest.country, dataVaultRequest.year).then(function(result){
                dataset = [];
                printDataSource();

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
                    d.value = parseFloat(d.value);
                    dataset.push(d);
                  }
                });

                dataset = dataset.sort(function(a,b){
                  return parseFloat(a.total_percent) - parseFloat(b.total_percent);
                });
                
                  
                MapChartsService.setValueFunction(function(d){
                    if(d){
                      return d.total_percent;      
                    }else{
                      return 0;
                    }
                });                    

                var maxValueAbsolut = d3.max(dataset,function(d){return parseFloat(d.value);});
                var minValueAbsolut = d3.min(dataset,function(d){return parseFloat(d.value);});

                var maxValue = d3.max(dataset,function(d){return parseFloat(d.total_percent);});
                var minValue = d3.min(dataset,function(d){return parseFloat(d.total_percent);});
                dataset.push({iso: country,partner:countryName, partner_percent:"#N/A",total:"0",total_percent:maxValue, value: maxValueAbsolut});

                if(color === "classification"){
                  MapChartsService.setColorScaleOrdinal(colorClasification);
                  MapChartsService.addLegendMultiple(colorClasification);
                  setAndRenderMap(dataset,country);

                }else if(color === "another"){
                  if(anotherIndicator.country.items.length > 1){
                    MapChartsService.setSubType('multiple-focus');
                    dataVaultRequest.indicator = anotherIndicator.indicators.items[0].code;
                    dataVaultRequest.country = [];
                    angular.forEach(anotherIndicator.country.items,function(d){
                      dataVaultRequest.country.push(mapVariablesService.getCountryISO(d));
                    });
                    
                    dataVaultRequest.year = [anotherIndicator.years.start, anotherIndicator.years.end];
                    DataVaultService.getCartogramIndicator(dataVaultRequest.indicator, dataVaultRequest.country, dataVaultRequest.year).then(function(result){
                      var dataset = [];
                      var worldValues = {};

                      $scope.dataSource += ", "+mapVariablesService.getIndicatorOtherByCode(dataVaultRequest.indicator).source;

                      // angular.forEach(result.data.data, function(d){
                      //   if(d.iso1 !== "World" && d.iso2 === "World"){
                      //     worldValues[d.iso1] = parseFloat(d.value);
                      //   }
                      // });

                      worldValues[dataVaultRequest.country[0]] = getWorldValue(result.data.data, dataVaultRequest.country[0]);
                      worldValues[dataVaultRequest.country[1]] = getWorldValue(result.data.data, dataVaultRequest.country[1]);


                      angular.forEach(result.data.data, function(d){
                        if(d.iso1 !== "World" && d.iso2 !== "World"){
                          var countryData = d;
                          countryData.values = {};
                          countryData.valuesPerc = {};

                          angular.forEach(dataset, function(datasetCountry){
                            if(datasetCountry.iso === d.iso2){
                              countryData = datasetCountry;
                            }
                          });

                          countryData.iso = d.iso2;
                          countryData.values[d.iso1] = parseFloat(d.value);
                          countryData.valuesPerc[d.iso1] = parseFloat(d.value)/worldValues[d.iso1];
                          dataset.push(d);
                        }
                      });

                      angular.forEach(dataVaultRequest.country,function(d){
                        dataset.push({iso: d,partner:"", partner_percent:"#N/A",total:"0",total_percent:0, value: 0});  
                      });

                      // dataset = dataset.sort(function(a,b){
                      //   return parseFloat(a.value) - parseFloat(b.value);
                      // });

                      // var percentilesValues = calculatePercentiles(dataset, "value", "value");
                      // MapChartsService.setColorScaleLinear(percentilesValues,"value");  
                      MapChartsService.setMultipleCountriesScale(dataVaultRequest.country);
                      MapChartsService.setColorScaleMultiple(dataVaultRequest.country);
                      MapChartsService.addLegendMultipleCountries(dataVaultRequest.country);
                      setAndRenderMap(dataset,dataVaultRequest.country);
                    });
                  }else{
                    dataVaultRequest.indicator = anotherIndicator.indicators.items[0].code;
                    dataVaultRequest.country = mapVariablesService.getCountryISO(anotherIndicator.country.items[0]);
                    dataVaultRequest.year = [anotherIndicator.years.start, anotherIndicator.years.end];
                    DataVaultService.getCartogramIndicator(dataVaultRequest.indicator, dataVaultRequest.country, dataVaultRequest.year).then(function(result){
                      var dataset = [];

                      angular.forEach(result.data.data, function(d){
                        if(d.iso1 === dataVaultRequest.country && d.iso2 !== "World"){
                          d.iso = d.iso2;
                          d.value = parseFloat(d.value);
                          dataset.push(d);
                        }
                      });

                      dataset.push({iso: dataVaultRequest.country,partner:"", partner_percent:"#N/A",total:"0",total_percent:0, value: 0});

                      dataset = dataset.sort(function(a,b){
                        return parseFloat(a.value) - parseFloat(b.value);
                      });

                      var percentilesValues = calculatePercentiles(dataset, "value", "value");
                      MapChartsService.setColorScaleLinear(percentilesValues,"value");  
                      MapChartsService.addLegend(percentilesValues, "value");
                      setAndRenderMap(dataset,dataVaultRequest.country);
                    });
                  }

                }else if(color === "share" || color === "no-color"){
                  var percentilesValues = calculatePercentiles(dataset, "total_received", "total_percent");
                  MapChartsService.setColorScaleLinear(percentilesValues,"total_percent");  

                  if(color === "share"){
                    MapChartsService.addLegend(percentilesValues, "total_percent");  
                  }
                  
                  setAndRenderMap(dataset, country);
                }

                function calculatePercentiles(dataset, propertyPerc, propertyVal){
                  angular.forEach(dataset,function(d,i){
                    if(parseFloat(d[propertyPerc]) > skipThreshold && nonZeroValues === 0){
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

                  return [
                    0,
                    parseFloat(dataset[percentiles.p64][propertyVal]),
                    parseFloat(dataset[percentiles.p32][propertyVal]),
                    parseFloat(dataset[percentiles.p16][propertyVal]),
                    parseFloat(dataset[percentiles.p8][propertyVal]),
                    parseFloat(dataset[percentiles.p4][propertyVal]),
                    parseFloat(dataset[percentiles.p2][propertyVal])
                  ];
                }
                
                function setAndRenderMap(dataset, country){
                  MapChartsService.setDataset(dataset, country);
                  MapChartsService.setTopology(topology, topology.objects[mapFileName]);
                  MapChartsService.resetMap();
                }
                  
                function getWorldValue(data, country){
                  return d3.sum(data,function(d){
                    if(d.iso1 === country){
                      return parseFloat(d.value);
                    }else{
                      return 0;
                    }
                  });
                }

                function printDataSource(){
                  $timeout(function(){
                    var indicator = mapVariablesService.getIndicatorOtherByCode(dataVaultRequest.indicator);
                    if(indicator === null){
                      printDataSource();
                    }else{
                      $scope.dataSource += indicator.source;  
                    }
                    
                  },2000);
                }
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

        $scope.errorPopup = function(){
          $uibModal.open({
                templateUrl: '../app/components/data-viz/templates/popup.html',
                controller: "ModalCtlr",
                size: 's'
              });
        };
    }
  };
});
angular.module('app').controller("ModalCtlr",function($scope, $uibModalInstance){
  $scope.ok = function () {
      $uibModalInstance.close();
    };
});
