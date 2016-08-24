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

            var carto = d3.cartogram()
              .projection(MapChartsService.getMapObject().projection)
              .properties(function(d) {
                return dataById[d.properties.iso_a3];
              });

            d3.json('/localdata/vizdata/'+detailFile+'.json', function(topo) {
              topology = topo;

              geometries = topology.objects[detailFile+'_geo'].geometries;

              // Read the data for the cartogram
              d3.csv("/localdata/vizdata/"+country+"_exports.csv", function(data) {
                dataById = MapChartsService.setDataNest(data, country);
                
                var cartoFeatures = carto.features(topology, geometries); 
                MapChartsService.resetMap(cartoFeatures);

                var maxValue = d3.max(data,function(d){return d.total_percent;});
                var minValue = d3.min(data,function(d){return d.total_percent;});
                MapChartsService.setValueScale([minValue, maxValue], [0,$scope.mapWidth*0.02]);
                MapChartsService.setValueFunction(function(d){
                    if(d.properties){
                        return d.properties.total_percent;    
                    }else{
                        return 0;
                    }
                    
                });

                MapChartsService.addFlags(cartoFeatures);

              });
            });
        };
    }
  };
});
