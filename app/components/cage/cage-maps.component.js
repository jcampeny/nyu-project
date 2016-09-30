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
    controller: function ($scope, $stateParams, LoginService, $http, MapChartsService) {
        var dataset;
        $scope.newData = 0;
        $scope.type = $stateParams.type;

        $scope.updateData = function(){
            angular.forEach(dataset, function(d,i){
                if(d.iso === "CAN"){
                    d.total_percent = $scope.newData;
                }
            });

            MapChartsService.updateData(dataset);
        };

        MapChartsService.fetchFlags();
        MapChartsService.resetMapObject();
        MapChartsService.setType($stateParams.type);
        MapChartsService.setColorScale();

        this.renderMap = function(){
            var detailFile = "countries_50";
            var country = "USA";

            d3.select("svg #layer").remove();
            MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
            MapChartsService.iniMapLayers();
            MapChartsService.setZoom();
            MapChartsService.setProjection("equirectangular");


            d3.json('/localdata/vizdata/'+detailFile+'.json', function(topology) {

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

                    if(country === "GER"){
                        dataset.push({iso: "DEU",partner:"Germany",partner_percent:"#N/A",total:"0",total_percent:"20"});
                    }else if(country === "USA"){
                        dataset.push({iso: "USA",partner:"United States",partner_percent:"#N/A",total:"0",total_percent:"20"});
                    }

                    MapChartsService.setDataset(dataset, country);
                    MapChartsService.setTopology(topology, topology.objects[detailFile+'_geo']);
                    MapChartsService.resetMap();

                    var maxValue = d3.max(dataset,function(d){return parseFloat(d.total_percent);});
                    var minValue = d3.min(dataset,function(d){return parseFloat(d.total_percent);});
                    MapChartsService.setValueScale([minValue, maxValue], [0, 20]);

                    if($stateParams.type === "circles"){
                      MapChartsService.addCircles(dataset);
                    }else if($stateParams.type === "flags"){
                      MapChartsService.addFlags(dataset);
                    }
                });
            });
        };
    }
  };
});
