angular.module('app').directive('nyuCartogram', function () {
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
      controller.renderMap(scope.country, scope.indicator, 2014);

      scope.$watch('country',function(newVal, oldVal){
        if(newVal !== oldVal){
          controller.renderMap(scope.country, scope.indicator, 2014);
        }
      });

      scope.$watch(
          function(){return angular.element(window)[0].innerWidth;},
          function(newVal, oldVal){
            if(newVal != oldVal){
              scope.mapWidth = $('#map-container').width();
              scope.mapHeight = $('#map-container').height();  

              controller.renderMap(scope.country, scope.indicator, 2014);
            }
          }
      );
    },
    controller: function ($scope, $timeout, MapChartsService) {
        var dataset, country = "";
        
        // MapChartsService.fetchFlags();
        MapChartsService.resetMapObject();
        MapChartsService.setType("cartogram");
        MapChartsService.setColorScale();

        this.renderMap = function(country, indicator, year){
            if(!country || !indicator || !year){
              return;
            }
            if(country && country[0]){
              if(country[0] === "United States"){
                country = "USA";
              }else if(country[0] === "Germany"){
                country = "DEU";
              }

            } else {
                country = "USA";
            }

            MapChartsService.deleteMapLayers();
            MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
            MapChartsService.iniMapLayers();
            MapChartsService.setZoom();
            MapChartsService.setProjection(null);

            // d3.json('/localdata/vizdata/Exports_DEU_2005-2015/Exports_'+$scope.year+'_DEU.json', function(topology) {
            d3.json('/localdata/vizdata/cartograms/Exports_'+year+'_'+country+'.json', function(topology) {

                // Read the data for the cartogram
                d3.csv("/localdata/vizdata/"+country+"_exports.csv", function(data) {
                    dataset = data;
                    MapChartsService.setValueFunction(function(d){
                        if(d){
                          return d.total_percent;      
                        }else{
                          return 0;
                        }
                    });                    

                    var maxValue = d3.max(dataset,function(d){return parseFloat(d.total_percent);});
                    var minValue = d3.min(dataset,function(d){return parseFloat(d.total_percent);});

                    if(country === "DEU"){
                        dataset.push({iso: "DEU",partner:"Germany",partner_percent:"#N/A",total:"0",total_percent:maxValue});
                    }else if(country === "USA"){
                        dataset.push({iso: "USA",partner:"United States",partner_percent:"#N/A",total:"0",total_percent:maxValue});
                    }

                    MapChartsService.setDataset(dataset, country);
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
