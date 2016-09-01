angular.module('app').directive('nyuCartogram', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cartogram.html',
    controllerAs: 'nyuCartogram',
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      controller.renderMap();

      scope.$watch(
          function(){return angular.element(window)[0].innerWidth;},
          function(newVal, oldVal){
            if(newVal != oldVal){
              scope.mapWidth = $('#map-container').width();
              scope.mapHeight = $('#map-container').height();  
              controller.renderMap();
            }
          }
      );
    },
    controller: function ($scope, $timeout, $stateParams, MapChartsService) {
        var dataset, country = "";

        if($stateParams.country !== ""){
            country = $stateParams.country;
        } else {
            return;
        }

        this.renderMap = function(){
            MapChartsService.fetchFlags();
            MapChartsService.resetMapObject();
            MapChartsService.setType("cartogram");
            MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
            MapChartsService.setColorScale();
            MapChartsService.iniMapLayers();
            MapChartsService.setZoom();
            MapChartsService.setProjection(null);

            d3.json('/localdata/vizdata/'+country.toUpperCase()+'_2014_TotalExports.json', function(topology) {

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

                    if(country === "deu"){
                        dataset.push({iso: "DEU",partner:"Germany",partner_percent:"#N/A",total:"0",total_percent:"20"});
                    }else if(country === "usa"){
                        dataset.push({iso: "USA",partner:"United States",partner_percent:"#N/A",total:"0",total_percent:"20"});
                    }

                    MapChartsService.setDataset(dataset, country);
                    MapChartsService.setTopology(topology, topology.objects[country.toUpperCase()+'_2014_TotalExports']);
                    MapChartsService.resetMap();

                });
            });
        };
    }
  };
});
