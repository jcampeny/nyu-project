
angular.module('app').service("MapChartsService",[function() {
	    var mapObject = {};

	    function getMapObject(){
	    	return mapObject;
	    }

	    function resetMapObject(){
	    	mapObject = {
				width         : 0,
				height        : 0,
				body          : null,
				map           : null,
				layer         : null,
				mapFeatures   : null,
				tooltip       : null,
				zoom          : null,
				projection    : null,
				path          : null,
				colorFunction : null
		    };
	    }

	    function setSize(width,height){
	    	mapObject.width = width;
	    	mapObject.height = height;
	    }

	    function iniMapLayers(){
	    	mapObject.body = d3.select("body");
			mapObject.map = d3.select("#map")
				.attr("preserveAspectRatio", "xMidYMid")
	    	    .attr("viewBox", "0 0 " + mapObject.width + " " + mapObject.height);

	    	mapObject.layer = mapObject.map.append("g")
	    	    .attr("id", "layer");
	    	
	    	mapObject.mapFeatures = mapObject.layer.append("g")
				.attr("id", "mapFeatures")
				.selectAll("path");

			mapObject.tooltip = d3.select("#map-container")
				.append("div")
				.attr("class", "ttip hidden");
	    }

	    function setZoom(){
	    	mapObject.zoom = d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on('zoom', doZoom);

	    	mapObject.map.call(mapObject.zoom);
	    }

	    function setProjection(projName){
	    	if(projName === "equirectangular"){
	    		mapObject.projection = d3.geo.equirectangular();
	    	}

	    	var b = [-180,-90,180,90];
	    	t = [(b[0]+b[2])/2, (b[1]+b[3])/2];
	    	s = 0.95 / Math.max(
	    	    (b[2] - b[0]) / mapObject.width,
	    	    (b[3] - b[1]) / mapObject.height
	    	  );

	    	// Scale it to fit nicely
	    	s = s * 60;
	    	mapObject.projection
	    	    .scale(s)
	    	    .center(t).translate([mapObject.width / 2, mapObject.height / 1.7]);

	    	
	    }


	    function setDataNest(data, country){
	    	var dataNest = d3.nest()
				.key(function(d) { return d.iso; })
				.rollup(function(d) { return d[0]; })
				.map(data);

			if(country === "ger"){
				dataNest.DEU = {
				  iso: "DEU",
				  partner:"Germany",
				  partner_percent:"#N/A",
				  total:"0",
				  total_percent:"20"
				};
			}else if(country === "usa"){
				dataNest.USA = {
				  iso: "USA",
				  partner:"United States",
				  partner_percent:"#N/A",
				  total:"0",
				  total_percent:"20"
				};
			}

			return dataNest;
	    }

	    function resetMap(data){
	    	mapObject.path = d3.geo.path().projection(mapObject.projection);

	    	mapObject.mapFeatures = mapObject.mapFeatures.data(data);

	    	mapObject.mapFeatures.enter()
	    	  .append("path")
	    	    .attr("class", "mapFeature")
	    	    .attr("id", function(d) {
	    	      return d.id;
	    	    })
	    	    .transition()
				.duration(750)
				.ease("linear")
	    	    .attr("fill", "#ddd")
	    	    .attr("d", mapObject.path);
	    }

	    function setColorFunction(colorFunction){
	    	mapObject.colorFunction = d3.functor(colorFunction);
	    }

	    function updateData(data){
	    	mapObject.mapFeatures
	    		.data(data)
	  			.transition()
				.duration(750)
				.ease("linear")
				.attr("fill", mapObject.colorFunction)
				.attr("d", mapObject.path);
	    }


	    function doZoom() {

	      // Zoom and keep the stroke width proportional
	      mapObject.mapFeatures.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")").style("stroke-width", 0.5 / d3.event.scale + "px");

	      // Hide the tooltip after zooming
	      // hideTooltip();
	    }

	    return({
			getMapObject     : getMapObject,
			resetMapObject   : resetMapObject,
			setSize          : setSize,
			iniMapLayers     : iniMapLayers,
			setZoom          : setZoom,
			setProjection    : setProjection,
			setDataNest		 : setDataNest,
			resetMap         : resetMap,
			setColorFunction : setColorFunction,
			updateData       : updateData
		});


	}]);
