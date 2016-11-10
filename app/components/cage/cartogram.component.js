angular.module('app').directive('nyuCartogram', function (DataVaultService, $rootScope) {
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
      countryCompTooltip : "=",
      hasFocalCountry    : "="
    },
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      if(!scope.firstRendered){
        callRender();  
      }
      

      scope.$watch('countryCompTooltip',function(newVal, oldVal){
        controller.changeMapOption("compTooltips", newVal);
      });

      scope.$watch('indicator',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
        }
      },true);

      scope.$watch('country',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
        }
      },true);

      scope.$watch('year',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
        }
      },true);

      scope.$watch('distortion',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
        }
      });

      scope.$watch('color',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
          callRender();
        }
      });

      scope.$watch('anotherIndicator',function(newVal, oldVal){
        if(newVal.country.name !== oldVal.country.name || 
            newVal.indicators.items[0].name !== oldVal.indicators.items[0].name || 
            newVal.years.start !== oldVal.years.start ||
            newVal.years.end !== oldVal.years.end){
          callRender();
        }
      },true);

      scope.$watch('colorClasification',function(newVal, oldVal){
        if(!angular.equals(newVal, oldVal)){
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

              callRender();
            }
          }
      );

      var renderTimeout;
      function callRender(){
        scope.firstRendered = true;

        if(renderTimeout){
          clearTimeout(renderTimeout);
        }

        renderTimeout = setTimeout(function(){
          controller.renderMap(scope.country, scope.indicator, scope.year, null, scope.distortion, scope.color, scope.colorClasification, scope.anotherIndicator, scope.colorOptions, scope.countryCompTooltip);
        },400);
        
      }
    },
    controller: function ($scope, $rootScope, $timeout, $uibModal, MapChartsService, mapVariablesService) {
        var dataset, country = "", countryName = "", self = this;
        var lastValidCountry = "United States";

        $scope.root = $rootScope;
        var exportDataset = [];

        // MapChartsService.fetchFlags();
        MapChartsService.resetMapObject();
        MapChartsService.setType("cartogram");

        this.changeMapOption = function(option, value){
          MapChartsService.setConfigVar(option,value);
        };

        $scope.root.rendering = false;

        this.renderMap = function(country, indicator, year, countryIso, distortion, color, colorClasification, anotherIndicator, colorOptions, countryCompTooltip){
          if($scope.root.rendering){ return; }
          $scope.root.rendering = true;
          $scope.dataSource = "";

          if(countryIso){
            if(mapVariablesService.getCountryByISO(countryIso) === null){
              $scope.root.rendering = false;
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
            $scope.root.rendering = false;
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

          MapChartsService.setConfigVar("tooltipIndicator",null);

          var mapFileName = indicator[0].filePrefix+'_'+year.start;
          if($scope.hasFocalCountry){
            mapFileName += '_'+country;
          }else{
            mapFileName += '_Total';
            country = "";

            if(color === "share"){
              color = "no-color";
            }
          }

          var mapFile = '/localdata/vizdata/cartograms/'+mapFileName+'.json';
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
                $scope.root.rendering = false;
                return;
              }
              if($scope.hasFocalCountry){
                lastValidCountry = mapVariablesService.getCountryByISO(country).name;
              }

              // Read the data for the cartogram
              var dataVaultRequest = {indicator: indicator[0].code, country: country, year:[year.start, year.end]};

              DataVaultService.getCartogramIndicator(dataVaultRequest.indicator, dataVaultRequest.country, dataVaultRequest.year).then(function(result){
                dataset = [];
                exportDataset = [];
                $scope.dataSource = result.data.content.datasource;
                // printDataSource(dataVaultRequest.indicator);
//console.log(result);
//ROLE VALIDATOR 
if(result.data.content == 'role-not-valid') {$scope.errorRolePopup();}
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
                  if($scope.hasFocalCountry){
                    if(d.iso1 === country && d.iso2 !== "World"){
                      d.iso = d.iso2;
                      d.total_percent = (worldValues[d.iso2] > 0)?parseFloat(d.value) / worldValues[d.iso2] * 100:0;
                      d.total_received = (totalCountry > 0)?parseFloat(d.value) / totalCountry * 100:0;
                      d.value = parseFloat(d.value);
                      dataset.push(d);
                      exportDataset.push({
                        iso1: d.iso1,
                        iso2: d.iso2,
                        year: dataVaultRequest.year[0]+"-"+dataVaultRequest.year[1],
                        value: d.value
                      });
                    }
                  }else{
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
                  var anotherDataVaultRequest = {};

                  MapChartsService.setConfigVar("tooltipIndicator",{label: anotherIndicator.indicators.items[0].name, "property":"value", unit:"absolute"});
                  if(anotherIndicator.country.items.length > 1){
                    MapChartsService.setSubType('multiple-focus');

                    anotherDataVaultRequest.indicator = anotherIndicator.indicators.items[0].code;
                    anotherDataVaultRequest.country = [];
                    angular.forEach(anotherIndicator.country.items,function(d){
                      anotherDataVaultRequest.country.push(mapVariablesService.getCountryISO(d));
                    });
                    
                    anotherDataVaultRequest.year = [anotherIndicator.years.start, anotherIndicator.years.end];
                    DataVaultService.getCartogramIndicator(anotherDataVaultRequest.indicator, anotherDataVaultRequest.country, anotherDataVaultRequest.year).then(function(result){
                      var dataset = [];
                      var worldValues = {};

                      $scope.dataSource += ", "+result.data.content.datasource;
                      // printDataSource(anotherDataVaultRequest.indicator);

                      // angular.forEach(result.data.data, function(d){
                      //   if(d.iso1 !== "World" && d.iso2 === "World"){
                      //     worldValues[d.iso1] = parseFloat(d.value);
                      //   }
                      // });

                      worldValues[anotherDataVaultRequest.country[0]] = getWorldValue(result.data.data, anotherDataVaultRequest.country[0]);
                      worldValues[anotherDataVaultRequest.country[1]] = getWorldValue(result.data.data, anotherDataVaultRequest.country[1]);

                      exportDataset.push({
                        iso1: anotherIndicator.indicators.items[0].name,
                        iso2: "",
                        eyar: "",
                        value: ""
                      });

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
                          exportDataset.push({
                            iso1: d.iso1,
                            iso2: d.iso2,
                            year: anotherDataVaultRequest.year[0]+"-"+anotherDataVaultRequest.year[1],
                            value: d.value
                          });
                        }
                      });

                      angular.forEach(anotherDataVaultRequest.country,function(d){
                        dataset.push({iso: d,partner:"", partner_percent:"#N/A",total:"0",total_percent:0, value: 0});  
                      });

                      // dataset = dataset.sort(function(a,b){
                      //   return parseFloat(a.value) - parseFloat(b.value);
                      // });

                      // var percentilesValues = calculatePercentiles(dataset, "value", "value");
                      // MapChartsService.setColorScaleLinear(percentilesValues,"value");  
                      MapChartsService.setMultipleCountriesScale(anotherDataVaultRequest.country);
                      MapChartsService.setColorScaleMultiple(anotherDataVaultRequest.country);
                      MapChartsService.addLegendMultipleCountries(anotherDataVaultRequest.country);
                      setAndRenderMap(dataset,anotherDataVaultRequest.country);
                    });
                  }else{
                    anotherDataVaultRequest.indicator = anotherIndicator.indicators.items[0].code;
                    anotherDataVaultRequest.country = mapVariablesService.getCountryISO(anotherIndicator.country.items[0]);
                    anotherDataVaultRequest.year = [anotherIndicator.years.start, anotherIndicator.years.end];
                    DataVaultService.getCartogramIndicator(anotherDataVaultRequest.indicator, anotherDataVaultRequest.country, anotherDataVaultRequest.year).then(function(result){
                      var dataset = [];

                      $scope.dataSource += ", "+result.data.content.datasource;
                      // printDataSource(anotherDataVaultRequest.indicator);

                      exportDataset.push({iso1: "",iso2: "",eyar: "",value: ""});
                      exportDataset.push({iso1: "",iso2: "",eyar: "",value: ""});
                      exportDataset.push({
                        iso1: anotherIndicator.indicators.items[0].name,
                        iso2: anotherIndicator.country.items[0],
                        eyar: anotherIndicator.years.start,
                        value: anotherIndicator.years.end
                      });

                      angular.forEach(result.data.data, function(d){
                        if(d.iso1 === anotherDataVaultRequest.country && d.iso2 !== "World"){
                          d.iso = d.iso2;
                          d.value = parseFloat(d.value);
                          dataset.push(d);

                          exportDataset.push({
                            iso1: d.iso1,
                            iso2: d.iso2,
                            year: anotherDataVaultRequest.year[0]+"-"+anotherDataVaultRequest.year[1],
                            value: d.value
                          });
                        }
                      });

                      dataset.push({iso: anotherDataVaultRequest.country,partner:"", partner_percent:"#N/A",total:"0",total_percent:0, value: 0});

                      dataset = dataset.sort(function(a,b){
                        return parseFloat(a.value) - parseFloat(b.value);
                      });

                      var percentilesValues = calculatePercentiles(dataset, "value", "value");
                      MapChartsService.setColorScaleLinear(percentilesValues,"value");  
                      MapChartsService.addLegend(percentilesValues, "value");
                      setAndRenderMap(dataset,anotherDataVaultRequest.country);
                    });
                  }

                }else if(color === "share" || color === "no-color"){
                  var percentilesValues;
                  if($scope.hasFocalCountry){
                    percentilesValues = calculatePercentiles(dataset, "total_received", "total_percent");
                    MapChartsService.setColorScaleLinear(percentilesValues,"total_percent");  
                  }else{
                    percentilesValues = calculatePercentiles(dataset, "value", "value");
                    MapChartsService.setColorScaleLinear(percentilesValues,"value");  
                    MapChartsService.setConfigVar("tooltipIndicator",{label: indicator[0].name, "property":"value", unit:"absolute"});
                  }
                  

                  if(color === "share"){
                    MapChartsService.setConfigVar("tooltipIndicator",{label: "Partner opposite share", "property":"total_received", unit:"percent"});
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

                  if(mapFileName.indexOf("Exports") === 0 && typeof topology.objects[mapFileName] === "undefined"){
                    mapFileName = mapFileName.replace("Exports","m.exports");
                  }

                  MapChartsService.setTopology(topology, topology.objects[mapFileName]);
                  MapChartsService.resetMap();
                  $scope.root.rendering = false;
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

                // function addDataSource(indicator){
                //   var indicatorSources = indicator.source.split("|");

                //   if($scope.dataSource.length === 0){
                //     $scope.dataSource.push(indicatorSources[0]);
                //   }

                //   angular.forEach(indicatorSources, function(is){
                //     var esta = false;
                //     angular.forEach($scope.dataSource, function(ds){
                //       if(ds.indexOf(is) >= 0 || is.indexOf(ds) >= 0){
                //         esta = true;
                //       }
                //     });
                //     if(!esta){
                //       $scope.dataSource.push(is);
                //     }
                    
                //   }); 
                // }

                // function printDataSource(indicatorCode){
                //   $timeout(function(){
                //     var indicator = mapVariablesService.getIndicatorOtherByCode(indicatorCode);
                //     if(indicator === null){
                //       printDataSource(indicatorCode);
                //     }else{
                //       addDataSource(indicator);
                //     }
                    
                //   },2000);
                // }

                $rootScope.exportedName = indicator[0].name+"_"+year.start+"-"+year.end+'.png';
                $rootScope.datasetCSV = {
                  csv : exportDataset,
                  filename : indicator[0].name+"_"+year.start+"-"+year.end+'.csv',
                  header : ['iso1', 'iso2', 'year', 'value']
                };
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
        $scope.errorRolePopup = function(){
          $uibModal.open({
                templateUrl: '../app/components/data-viz/templates/popup-ulvl.html',
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
