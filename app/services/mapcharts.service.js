
angular.module('app').service("MapChartsService",["ArrayService", function(ArrayService) {
	    var mapObject = {};

	    function getMapObject(){
	    	return mapObject;
	    }

	    function resetMapObject(){
	    	mapObject = {
	    		type 		  : null,
	    		dataset 	  : null,
	    		dataNest 	  : null,
				width         : 0,
				height        : 0,
				body          : null,
				map           : null,
				layer         : null,
				mapFeatures   : null,
				mapCircles	  : null,
				mapFlags	  : null,
				dataFeatures  : null,
				tooltip       : null,
				zoom          : null,
				projection    : null,
				path          : null,
				colorScale 	  : null,
				colorFunction : null,
				valueScale 	  : null,
				getValue	  : null,
				countryFlags  : null,
				focusCountry  : null
		    };
	    }

	    function setType(type){
	    	mapObject.type = type;
	    }

	    function setSize(width,height){
	    	mapObject.width = width;
	    	mapObject.height = height;
	    }

	    function setColorScale(){
	    	// Define the colors with colorbrewer
	    	mapObject.colorScale = colorbrewer.RdYlBu[3]
	    	      .reverse()
	    	      .map(function(rgb) { return d3.hsl(rgb); });
	    }

	    function setDataset(data, country){
	    	mapObject.dataset = data;

	    	var values = data
	    	  .map(function(d){
	    	    return parseFloat(d.total_percent);
	    	  })
	    	  .filter(function(n) {
	    	    return !isNaN(n);
	    	  })
	    	  .sort(d3.ascending),
	    	  lo = parseFloat(values[0]),
	    	  hi = parseFloat(values[values.length - 1]);

	    	var color = d3.scale.linear()
	    	  .range(mapObject.colorScale)
	    	  .domain(lo < 0 ? [lo, 0, hi] : [lo, d3.mean(values), hi]);

	    	setDataNest(data);
	    	setFocusCountry(country);
	    	
	    	var maxValue = d3.max(data,function(d){return parseFloat(mapObject.getValue(d));});
	    	var minValue = d3.min(data,function(d){return parseFloat(mapObject.getValue(d));});
	    	setValueScale([minValue, maxValue], [1.2, 0]);
	    	
	    	setColorFunction(function(d){
	    	  if(d){
	    	    return color(parseFloat(d.total_percent));
	    	  }else{
	    	    return "";
	    	  }
	    	});
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

			mapObject.mapCircles = mapObject.layer.append("g")
				.attr("id", "mapCircles");

			mapObject.mapFlags = mapObject.layer.append("g")
				.attr("id", "mapFlags");

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
	    	if(projName === null){
	    		mapObject.projection = null;
	    		return;
	    	}

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
	    	s = s * 20;
	    	mapObject.projection
	    	    .scale(s)
	    	    .center(t).translate([mapObject.width / 2, mapObject.height / 1.7]);	
	    }

	    function setDataNest(data){
	    	mapObject.dataNest = d3.nest()
				.key(function(d) { return d.iso; })
				.rollup(function(d) { return d[0]; })
				.map(data);

			return mapObject.dataNest;
	    }


        function setTopology(topology, objects){
   //      	var tempArray = geometries.map(function(f) {
   //      		if(f.type === "Polygon"){
   //      			return {
   //      				type: "Feature",
   //      				id: f.properties.iso_a3,
   //      				properties: mapObject.dataNest[f.properties.iso_a3],
   //      				geometry: {
   //      					type: f.type,
   //      					coordinates: topojson.feature(topology, f).geometry.coordinates
   //      				}
   //      			};
   //      		}
   //        	});

   //        	mapObject.dataFeatures = [];

			// for (var i = 0; i < tempArray.length; i++) {
			// 	if (tempArray[i]) {
			// 		mapObject.dataFeatures.push(tempArray[i]);
			// 	}
			// }
			mapObject.dataFeatures = topojson.feature(topology, objects).features;
        }

	    function setFocusCountry(iso){
	    	mapObject.focusCountry = mapObject.dataNest[iso.toUpperCase()];
	    }

	    function resetMap(){
	    	mapObject.path = d3.geo.path().projection(mapObject.projection);

	    	mapObject.mapFeatures
	    		.data(mapObject.dataFeatures, function(d){return getId(d);})
	    		.enter()
	    	  	.append("path")
	    	    .attr("class", "mapFeature")
	    	    .attr("id", function(d) {
	    	      return getId(d);
	    	    })
	    	    .attr("fill", function(d){ 
	    	    	return mapObject.colorFunction(mapObject.dataNest[getId(d)]);
	    	    })
	    	    .attr("d", mapObject.path)
	    	    .on("click",function(d){
	    	    	if(mapObject.type === "cartogram"){
	    	    		if(getId(d).toUpperCase() === mapObject.focusCountry.iso){
	    	    			return;
	    	    		}
	    	    		if(getId(d).toUpperCase() === "USA" || getId(d).toUpperCase() === "DEU"){
	    	    			d3.json('/localdata/vizdata/'+getId(d).toUpperCase()+'_2014_TotalExports.json', function(topology) {
	    	    				d3.csv("/localdata/vizdata/"+getId(d).toLowerCase()+"_exports.csv", function(data) {
	    	    					if(getId(d) === "DEU"){
	    	    					    data.push({iso: "DEU",partner:"Germany",partner_percent:"#N/A",total:"0",total_percent:"20"});
	    	    					}else if(getId(d) === "USA"){
	    	    					    data.push({iso: "USA",partner:"United States",partner_percent:"#N/A",total:"0",total_percent:"20"});
	    	    					}

	    	    					setDataset(data, getId(d));
		    	    				setTopology(topology, topology.objects[getId(d).toUpperCase()+'_2014_TotalExports']);
		    	    				setFocusCountry(getId(d));
		    	    				updateData(mapObject.dataFeatures);
		    	    			});
	    	    			});
	    	    		}
	    	    	}
	    	    	console.log(d);
	    	    });
	    }

	    function setColorFunction(colorFunction){
	    	mapObject.colorFunction = d3.functor(colorFunction);
	    }

	    function updateData(data){
	    	if(mapObject.type === "cartogram"){
	    		// d3.selectAll('.mapFeature')
	    		// 	.style("opacity","0");

				d3.selectAll('.mapFeature')
					.data(mapObject.dataFeatures, function(d){return getId(d);})
					.attr("fill", function(d){ 
						return mapObject.colorFunction(mapObject.dataNest[getId(d)]);
					})
					.attr("d", mapObject.path);

				// d3.selectAll('.mapFeature')
				// 	.style("opacity","1")
				// 	.transition()
				// 	.delay(400)
				// 	.duration(400)
				// 	.attr("fill", function(d){ 
				// 		return mapObject.colorFunction(mapObject.dataNest[getId(d)]);
				// 	});


			}else if(mapObject.type === "flags"){
				updateFlags(data);
			}else if(mapObject.type === "circles"){
				updateCircles(data);
			}
	    }

	    function setValueScale(domain, range){
	    	mapObject.valueScale = d3.scale.sqrt()
	    		.domain(domain)
	    		.range(range);
	    }

	    function setValueFunction(f){
	    	mapObject.getValue = f;
	    }

	    function addCircles(data){
	    	mapObject.mapCircles = mapObject.mapCircles.selectAll("circle").data(data);
	    	 
	    	mapObject.mapCircles
	    	  	.enter()
	    	  	.append("circle")
	    	  	.attr("circle-id", function(d) {
	    	  	  return d.id;
	    	  	})
	    	    .attr("transform", function(d) { return "translate(" + mapObject.path.centroid(d) + ")"; })
	    	    .attr("r", function(d){
	    	    	return mapObject.valueScale(mapObject.getValue(d));
	    	    });
	    }

	    function fetchFlags(){
	    	d3.tsv('/localdata/vizdata/world-country-flags.tsv', function(data) {
	    		mapObject.countryFlags = data;
	    	});
	    }

	    function addFlags(data){
	    	mapObject.mapFlags.selectAll(".flag")
	    		.data(data, function(d){ return d.iso; })
	    	  	.enter()
	    	  	.insert("image", ".graticule")
  	      		.attr("class", "flag")
  	      		.attr("id",function(d){ return "flag_"+d.iso; })
				.attr("xlink:href", function (d){
					var countryFlag = ArrayService.getFromProperty(mapObject.countryFlags, "iso", d.iso);

					if(countryFlag !== null){
						return countryFlag.url;
					}else{
						return "";
					}
				})
				.attr("x", function (d) {
					var dataFeature = getDataFeature(d.iso);
					if(dataFeature === null){
						return "";
					}else{
						return mapObject.path.centroid(dataFeature)[0];	
					}
					
				})
				.attr("y", function (d) {
					var dataFeature = getDataFeature(d.iso);
					if(dataFeature === null){
						return "";
					}else{
						return mapObject.path.centroid(dataFeature)[1];	
					}
				})
				.attr("width", "20px")
				.attr("height", "15px")
				.attr("preserveAspectRatio", "none");
	    }

	    /* PRIVATES */
	    function getId(d){
	    	return d.properties.iso_a3?d.properties.iso_a3:d.id;
	    }

	    function updateFlags(data){
	    	mapObject.mapFlags.selectAll(".flag")
	    		.data(data, function(d){ return d.iso; })
	    		.transition()
	    		.duration(700)
				.attr("x", function (d) {
					if(d.iso === mapObject.focusCountry.iso){
						return this.getAttribute("x");
					}else{
						var currentPoint = [parseFloat(this.getAttribute("x")), parseFloat(this.getAttribute("y"))];
						var focusId = mapObject.focusCountry.iso;
						var focusPoint = [d3.select('#flag_'+focusId).attr("x"), d3.select('#flag_'+focusId).attr("y")];

						return getNewDistance(focusPoint, currentPoint, mapObject.valueScale(mapObject.getValue(d)))[0];						
					}
				})
				.attr("y", function (d) {
					if(d.iso === mapObject.focusCountry.iso){
						return this.getAttribute("y");
					}else{
						var currentPoint = [parseFloat(this.getAttribute("x")), parseFloat(this.getAttribute("y"))];
						var focusId = mapObject.focusCountry.iso;
						var focusPoint = [parseFloat(d3.select('#flag_'+focusId).attr("x")), parseFloat(d3.select('#flag_'+focusId).attr("y"))];

						return getNewDistance(focusPoint, currentPoint, mapObject.valueScale(mapObject.getValue(d)))[1];						
					}
				});
	    }

	    function updateCircles(data){

	    }

	    
	    function doZoom() {

	      // Zoom and keep the stroke width proportional
	      mapObject.layer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	      mapObject.mapFeatures.style("stroke-width", 0.5 / d3.event.scale + "px");
	      mapObject.mapCircles.style("stroke-width", 0.8 / d3.event.scale + "px");
	      mapObject.mapFlags.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")

	      // Hide the tooltip after zooming
	      // hideTooltip();
	    }

	    // Point p1 focus - p2 relative
	    function getNewDistance(p1, p2, modifier){
	    	var distX = Math.abs(p2[0] - p1[0]);
	    	var distY = Math.abs(p2[1] - p1[1]);
	    	var h = Math.sqrt( Math.pow(distX,2) + Math.pow(distY,2));
	    	var h1 = modifier * h;
	    	var angle = Math.asin(distY/h);
	    	var newY = Math.sin(angle) * h1;
	    	var newX = Math.cos(angle) * h1;

	    	var angleC = getAngleC(p1, p2);

	    	if(angleC === "1"){
	    		if(h1 < h){ return [ p2[0] + (distX - newX), p2[1] + (distY - newY) ];
	    		} else {    return [ p2[0] - (newX - distX), p2[1] - (newY - distY) ]; }
	    	
	    	}else if(angleC === "2"){
	    		if(h1 < h){ return [ p2[0] - (distX - newX), p2[1] + (distY - newY) ];
	    		} else {    return [ p2[0] + (newX - distX), p2[1] - (newY - distY) ]; }

	    	}else if(angleC === "3"){
	    		if(h1 < h){ return [ p2[0] - (distX - newX), p2[1] - (distY - newY) ];
	    		} else {    return [ p2[0] + (newX - distX), p2[1] + (newY - distY) ]; }

	    	}else if(angleC === "4"){
	    		if(h1 < h){ return [ p2[0] + (distX - newX), p2[1] - (distY - newY) ];
	    		} else {    return [ p2[0] - (newX - distX), p2[1] + (newY - distY) ]; }
	    	}else{
	    		console.log("ERROR calculating new distance");
	    		return [0,0];
	    	}
	    	
	    }

	    // Point p1 focus - p2 relative
	    function getAngleC(p1, p2){
	    	if(p1[0] > p2[0]){
	    		if(p1[1] > p2[1]){
	    			return "1";
	    		}else{
	    			return "4";
	    		}
	    	}else{
	    		if(p1[1] > p2[1]){
	    			return "2";
	    		}else{
	    			return "3";
	    		}
	    	}
	    }

	    function getDataFeature(iso){
			for(var i=0; i<mapObject.dataFeatures.length ; i++){
				if(mapObject.dataFeatures[i].id === iso){
					return mapObject.dataFeatures[i];
				}
			}
			return null;
	    }

	    return({
			getMapObject     : getMapObject,
			resetMapObject   : resetMapObject,
			setType			 : setType,
			setSize          : setSize,
			setColorScale	 : setColorScale,
			setDataset		 : setDataset,
			iniMapLayers     : iniMapLayers,
			setZoom          : setZoom,
			setProjection    : setProjection,
			setDataNest		 : setDataNest,
			setTopology		 : setTopology,
			setFocusCountry	 : setFocusCountry,
			resetMap         : resetMap,
			setColorFunction : setColorFunction,
			updateData       : updateData,
			setValueScale	 : setValueScale,
			setValueFunction : setValueFunction,
			addCircles		 : addCircles,
			addFlags		 : addFlags,
			fetchFlags		 : fetchFlags
		});


	}]);
