angular.module('app').directive('nyuCagemaps', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage-maps.html',
    controllerAs: 'nyuCagemaps',
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      controller.renderMap();
    },
    controller: function ($scope, LoginService, $http, MapChartsService) {
        var dataset;
        $scope.newData = 0;

        $scope.updateData = function(){
            angular.forEach(dataset, function(d,i){
                if(d.iso === "CAN"){
                    d.total_percent = $scope.newData;
                }
            });

            MapChartsService.updateData(dataset);
        };

        this.renderMap = function(){
            var detailFile = "countries_50";
            var country = "usa";

            MapChartsService.fetchFlags();
            MapChartsService.resetMapObject();
            MapChartsService.setType("circles");
            MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
            MapChartsService.iniMapLayers();
            MapChartsService.setZoom();
            MapChartsService.setProjection("equirectangular");

            // var carto = d3.cartogram()
            //   .projection(MapChartsService.getMapObject().projection)
            //   .properties(function(d) {
            //     return dataById[d.properties.iso_a3];
            //   });

            d3.json('/localdata/vizdata/'+detailFile+'.json', function(topology) {

                // Read the data for the cartogram
                d3.csv("/localdata/vizdata/"+country+"_exports.csv", function(data) {
                    dataset = data;

                    if(country === "ger"){
                        dataset.push({
                          iso: "DEU",
                          partner:"Germany",
                          partner_percent:"#N/A",
                          total:"0",
                          total_percent:"20"
                        });
                    }else if(country === "usa"){
                        dataset.push({
                          iso: "USA",
                          partner:"United States",
                          partner_percent:"#N/A",
                          total:"0",
                          total_percent:"20"
                        });
                    }

                    dataById = MapChartsService.setDataNest(dataset, country);
                    MapChartsService.setTopology(topology, topology.objects[detailFile+'_geo'].geometries);
                    MapChartsService.setFocusCountry(country);
                    MapChartsService.resetMap();

                    var maxValue = d3.max(dataset,function(d){return parseFloat(d.total_percent);});
                    var minValue = d3.min(dataset,function(d){return parseFloat(d.total_percent);});
                    MapChartsService.setValueScale([minValue, maxValue], [1.2, 0]);
                    MapChartsService.setValueFunction(function(d){
                        return d.total_percent;    
                    });

                    MapChartsService.addCircles(dataset);

                });
            });
        };
    }
  };
});
