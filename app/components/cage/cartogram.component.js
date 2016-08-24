angular.module('app').directive('nyuCartogram', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cartogram.html',
    controllerAs: 'nyuCartogram',
    link: function (scope, element, attrs, controller) {
      scope.mapWidth = $('#map-container').width();
      scope.mapHeight = $('#map-container').height();  
      controller.renderMap();
    },
    controller: function ($scope, $timeout, $stateParams, MapChartsService) {

        $scope.makeCartogram = function(){
            cartogramController.deferredUpdate();
        };

        var cartogramController = {};

        $scope.algIter = 8;
        $scope.updateIterations = function(){
          carto.iterations($scope.algIter);
          cartogramController.deferredUpdate();
        };

        var detailFile = "",
            country = "",
            carto;

        if($stateParams.detail === "110m"){
            detailFile = "countries_110";
        }else if($stateParams.detail === "50m"){
            detailFile = "countries_50";
        }else if($stateParams.detail === "10m"){
            detailFile = "countries_10";
        }

        if($stateParams.country === "usa"){
            country = "usa";
        }else if($stateParams.country === "ger"){
            country = "ger";
        }

        if(detailFile === "" || country === ""){
            return;
        }
        
        // Define the colors with colorbrewer
        var colors = colorbrewer.RdYlBu[3]
              .reverse()
              .map(function(rgb) { return d3.hsl(rgb); });

        this.renderMap = function(){
          MapChartsService.resetMapObject();
          MapChartsService.setType("cartogram");
          MapChartsService.setSize($scope.mapWidth, $scope.mapHeight);
          MapChartsService.iniMapLayers();
          MapChartsService.setZoom();
          MapChartsService.setProjection("equirectangular");

          // Prepare the cartogram
          var topology,
              geometries,
              dataById = {};

          carto = d3.cartogram()
            .projection(MapChartsService.getMapObject().projection)
            .properties(function(d) {
              if (!dataById[d.properties.iso_a3]) {
                //console.log('ERROR: Entry "' + d.properties.iso_a3 + '" was found in the Topojson but not in the data CSV. Please correct either of them.');
              }
              // Add the cartogram data as property of the cartogram features
              return dataById[d.properties.iso_a3];
            })
            .iterations($scope.algIter);
              

          // // Define the checkbox and what happens when it is checked
          // var scaleCheckbox = d3.select("#scale")
          //       .on("change", function(e) {
          //         if ($(this).prop('checked')) {
          //           // If the checkbox is checked, add its value to the URL hash
          //           location.hash = '#' + $(this).val();
          //         } else {
          //           // Else add an empty string to the URL hash
          //           location.hash = '';
          //         }
          //       });

          // // Add a listener to the change of the URL hash
          // window.onhashchange = function() {
          //   parseHash();
          // };

          // Read the geometry data
          d3.json('/localdata/vizdata/'+detailFile+'.json', function(topo) {
          // d3.json('/localdata/vizdata/bern.topojson', function(topo) {
            topology = topo;

            // The mapped unit for communes: Communes
            geometries = topology.objects[detailFile+'_geo'].geometries;
            // geometries = topology.objects.bern.geometries;

            // Read the data for the cartogram
            d3.csv("/localdata/vizdata/"+country+"_exports.csv", function(data) {
              dataById = MapChartsService.setDataNest(data, country);
              
              // Initialize the map
              cartogramController.init();
            });
          });


          /**
           * Initialize the map. Creates the basic map without scaling of the
           * features.
           */
          cartogramController.init = function() {

            // Create the cartogram features (without any scaling)
            var cartoFeatures = carto.features(topology, geometries); 
            MapChartsService.resetMap(cartoFeatures);
            
            // Show tooltips when hovering over the features
            // Use "mousemove" instead of "mouseover" to update the tooltip
            // position when moving the cursor inside the feature.
            // mapFeatures.on('mousemove', showTooltip)
            //   .on('mouseout', hideTooltip);
          };


          /**
           * Reset the cartogram and show the features without scaling.
           */
          cartogramController.reset = function() {
            // Create the cartogram features (without any scaling)
            var cartoFeatures = carto.features(topology, geometries);
            MapChartsService.resetMap(cartoFeatures);
          };


          /**
           * Update the cartogram to scale the features.
           */
          cartogramController.update = function() {

            // Keep track of the time it takes to calculate the cartogram
            var start = Date.now();

            // Prepare the values and determine minimum and maximum values
            var value = function(d) {
              return getValue(d);
            },
            values = MapChartsService.getMapObject().mapFeatures.data()
              .map(value)
              .filter(function(n) {
                return !isNaN(n);
              })
              .sort(d3.ascending),
              lo = values[0],
              hi = values[values.length - 1];

            // Determine the colors within the range
            var color = d3.scale.linear()
              .range(colors)
              .domain(lo < 0 ? [lo, 0, hi] : [lo, d3.mean(values), hi]);

            // Normalize the scale to positive numbers
            var scale = d3.scale.linear()
              .domain([lo, hi])
              .range([1, 1000]);

            // Tell the cartogram to use the scaled values
            carto.value(function(d) {
              return scale(value(d));
            });

            MapChartsService.setColorFunction(function(d){
              return color(value(d));
            });

            // Generate the new features and add them to the map
            var cartoFeatures = carto(topology, geometries).features;
            // MapChartsService.updateData(cartoFeatures);
            MapChartsService.getMapObject().mapFeatures.data(cartoFeatures);

            // Scale the cartogram with a transition
            MapChartsService.getMapObject().mapFeatures.transition()
              .duration(750)
              .ease("linear")
              .attr("fill", function(d) {
                return color(value(d));
              })
              .attr("d", carto.path);
          };


          /**
           * Use a deferred function to update the cartogram. This allows to set a
           * timeout limit.
           */
          cartogramController.deferredUpdate =function() {
            $timeout(function() {
              cartogramController.update();
            }, 10);
          };


          /**
           * Show a tooltip with details of a feature, e.g. when hovering over a
           * feature on the map.
           *
           * @param {Feature} d - The feature
           * @param {Number} i - The ID of the feature
           */
          function showTooltip(d, i) {

            // Get the current mouse position (as integer)
            var mouse = d3.mouse(map.node()).map(function(d) { return parseInt(d); });

            // Calculate the absolute left and top offsets of the tooltip. If the
            // mouse is close to the right border of the map, show the tooltip on
            // the left.
            var left = Math.min(width-12*getName(d).length, (mouse[0]+20));
            var top = Math.min(height-40, (mouse[1]+20));

            // Populate the tooltip, position it and show it
            tooltip.classed("hidden", false)
              .attr("style", "left:"+left+"px;top:"+top+"px")
              .html([
                '<strong>', getName(d), '</strong><br/>',
                'Population: ', formatNumber(getValue(d)),
              ].join(''));
          }


          /**
           * Hide the tooltip.
           */
          function hideTooltip() {
            tooltip.classed("hidden", true);
          }

          /**
           * Helper function to access the property of the feature used as value.
           *
           * @param {Feature} f
           * @return {Number} value
           */
          function getValue(f) {
              if(f.properties){
                  return +f.properties.total_percent;      
              }else{
                  return 0;
              }            
          }

          /**
           * Helper function to access the property of the feature used as name or
           * label.
           *
           * @param {Feature} f
           * @return {String} name
           */
          function getName(f) {
              if(f.properties){
                  return f.properties.partner;
              }else{
                  return "CDC_Unknow";
              }
          }


          /**
           * Format a number: Add thousands separator.
           * http://stackoverflow.com/a/2901298/841644
           */
          function formatNumber(x) {
              return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
          }
        };
    }
  };
});
