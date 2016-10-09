
angular.module('app').service("MapChartsService",["ArrayService", "mapVariablesService", function(ArrayService, mapVariablesService) {
	    var mapObject = {};
	    var configColors = {
	    	region : {
				"South & Central Asia"       : "#913D88",
				"Europe"                     : "#2D3E50",
				"Middle East & N. Africa"    : "#4A80C2",
				"East Asia & Pacific"        : "#EF4937",
				"Sub-Saharan Africa"         : "#2C638A",
				"S. & C. America, Caribbean" : "#F7BE3A",
				"North America"              : "#28B999"
		    },
		    continent : {
    			"Asia"          :"#913D88",
    			"Europe"        :"#2D3E50",
    			"Africa"        :"#4A80C2",
    			"Oceania"       :"#EF4937",
    			"North America" :"#28B999",
    			"South America" :"#F7BE3A"
    	    },
    	    development : {
    	    	"Emerging Economies" : "#913D88",
				"Advanced Economies" : "#2D3E50"
    	    },
    	    income : {
				"Low-income economies"          : "#913D88",
				"High-income economies"         : "#2D3E50",
				"Upper-middle-income economies" : "#4A80C2",
				"Lower-middle-income economies" : "#EF4937"
    	    }
	    };


	    var multipleColors = ["#913D88","#2D3E50","#4A80C2","#EF4937","#2C638A","#F7BE3A","#28B999"];

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
				mapLegend	  : null,
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
				focusCountry  : null,
				clickFunction : null
		    };
	    }

	    function setType(type){
	    	mapObject.type = type;
	    }

	    function setSize(width,height){
	    	mapObject.width = width;
	    	mapObject.height = height;
	    }

	    function setColorScale(type, value){
	    	if(type === "share"){
	    		mapObject.colorScale = ["#2A6285", "#3982A1", "#A0D3D3", "#FFFFDA", "#FCBB82", "#EA9252", "#D64601", "#D64601"]
	    		      .map(function(rgb) { return d3.hsl(rgb); });	
	    	}else if(type === "no-color"){
	    		mapObject.colorScale = ["#26334D", "#26334D", "#26334D", "#26334D", "#26334D", "#26334D", "#26334D", "#26334D"]
	    		      .map(function(rgb) { return d3.hsl(rgb); });	
	    	}else if(type === "clasification"){
	    		mapObject.colorScale = ["#26334D", "#26334D", "#26334D", "#26334D", "#26334D", "#26334D", "#26334D", "#26334D"]
	    		      .map(function(rgb) { return d3.hsl(rgb); });	
	    	}
	    	
	    }

	    function setColorScaleLinear(domain, property){
	    	var color = d3.scale.linear()
	    	  .range(mapObject.colorScale)
	    	  .domain(domain)
	    	  .clamp(true);
	    	
	    	setColorFunction(function(d){
	    	  if(d){
	    	    return color(parseFloat(d[property]));
	    	  }else{
	    	    return "";
	    	  }
	    	});
	    }

	    function setColorScaleOrdinal(colorClasification){
	    	var domain = [];
	    	var range = [];

	    	for(var name in configColors[colorClasification]){
	    		domain.push(name);
	    		range.push(configColors[colorClasification][name]);
	    	}

	    	var color = d3.scale.ordinal()
	    	  .range(range)
	    	  .domain(domain);
	    	
	    	setColorFunction(function(d){
	    	  if(d){
	    	  	var country = mapVariablesService.getCountryByISO(d.iso);
	    	  	if(country !== null){
	    	  		return color(country[colorClasification]);
	    	  	}else{
	    	  		return "";	
	    	  	}
	    	    
	    	  }else{
	    	    return "";
	    	  }
	    	});
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

	    	setDataNest(data);
	    	setFocusCountry(country);
	    	
	    	var maxValue = d3.max(data,function(d){return parseFloat(mapObject.getValue(d));});
	    	var minValue = d3.min(data,function(d){return parseFloat(mapObject.getValue(d));});
	    	setValueScale([minValue, maxValue], [1.2, 0]);
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

			mapObject.mapLegend = mapObject.map.append("g")
				.attr("id", "mapLeyend")
				.attr("transform","translate("+(mapObject.width/3)+","+(mapObject.height-25)+")");

			mapObject.mapWatermark = mapObject.map.append("g")
				.attr("id", "mapWatermark")
				.attr("transform","translate("+(mapObject.width - 105)+","+(mapObject.height-50)+")");

			mapObject.mapWatermarkGlobe = mapObject.map.append("g")
				.attr("id", "mapWatermarkGlobe");

			mapObject.tooltip = d3.select('#map-container').append('div')
				.attr("id", "mapTooltip");
	    }

	    function setZoom(){
	    	mapObject.zoom = d3.behavior.zoom()
                .scaleExtent([1, 8])
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
	    	s = s * 60;
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
			mapObject.dataFeatures = topojson.feature(topology, objects).features;
        }

	    function setFocusCountry(iso){
	    	mapObject.focusCountry = mapObject.dataNest[iso.toUpperCase()];
	    }

	    function resetMap(){
	    	addWatermark();
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
	    	    	if(mapObject.type === "cartogram"){
	    	    		if(getId(d).toUpperCase() === mapObject.focusCountry.iso){
	    	    			return "#96281B";
	    	    		}else{
	    	    			return mapObject.colorFunction(mapObject.dataNest[getId(d)]) || "#CBCBCB";		
	    	    		}
	    	    		
	    	    	}else{
	    	    		return "transparent";
	    	    	}
	    	    	
	    	    })
	    	    .attr("d", mapObject.path)
	    	    .on("click",function(d){
	    	    	if(mapObject.type === "cartogram"){
	    	    		if(getId(d).toUpperCase() === mapObject.focusCountry.iso){
	    	    			return;
	    	    		}
	    	    		if(mapObject.clickFunction !== null){
	    	    			mapObject.clickFunction(getId(d).toUpperCase());
	    	    		}
	    	    	}
	    	    	console.log(d);
	    	    })
	    	    .on('mousemove', function(d) {
	    	    	if(mapObject.type === "cartogram"){
	    	    		var mouse = d3.mouse(mapObject.map.node()).map(function(d) {
	    	    		    return parseInt(d);
	    	    		});
	    	    		var country = mapVariablesService.getCountryByISO(d.properties.iso_a3);
	    	    		if(country !== null && country.iso !== mapObject.focusCountry.iso){
	    	    			var mapWidth = parseInt(mapObject.map.style("width"));
	    	    			var tooltipLeft = mouse[0]+215 < mapWidth ? (mouse[0] + 15) : (mouse[0] - 215);

	    	    			var tooltipContent = 
	    	    				"<div class='title'>"+country.name+""+
    	    			    	"<div class='item'>"+Math.round(mapObject.dataNest[d.properties.iso_a3].total_received)+"%</div></div>";

    	    			    if(mapObject.compTooltips){
    	    			    	tooltipContent += 
    	    			    		"<div class='item'>Common Official Language: No</div>"+
    	    			    		"<div class='item'>Colonial Linkage: Yes</div>"+
    	    			    		"<div class='item'>Trade Agreement: Yes</div>"+
    	    			    		"<div class='item'>Regional Bloc: Yes</div>"+
    	    			    		"<div class='item'>Physical Distance: No</div>"+
    	    			    		"<div class='item'>Common Border: No</div>"+
    	    			    		"<div class='item'>Ratio of Per Capita Income: No</div>";
    	    			    }

	    	    			mapObject.tooltip.classed('show', true)
	    	    			    .attr('style', 'left:' + (tooltipLeft) +
	    	    			            'px; top:' + (mouse[1] - 35) + 'px')
	    	    			    .html(tooltipContent);
	    	    		}
	    	    	}
                })
                .on('mouseout', function() {
                    mapObject.tooltip.classed('show', false);
                });
	    }

	    function setColorFunction(colorFunction){
	    	mapObject.colorFunction = d3.functor(colorFunction);
	    }

	    function updateData(data){
	    	if(mapObject.type === "cartogram"){

				d3.selectAll('.mapFeature')
					.data(mapObject.dataFeatures, function(d){return getId(d);})
					.attr("fill", function(d){ 
						return mapObject.colorFunction(mapObject.dataNest[getId(d)]);
					})
					.attr("d", mapObject.path);

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
	    	mapObject.mapCircles.selectAll(".circle")
	    		.data(data, function(d){ return d.iso; })
	    	  	.enter()
	    	  	.append("circle")
	    	  	.attr("class", "circle")
	    	  	.attr("circle-id", function(d) {
	    	  	  return d.iso;
	    	  	})
	    	    .attr("transform", function(d) {
	    	    	var dataFeature = getDataFeature(d.iso);
	    	    	if(dataFeature !== null){
	    	    		return "translate(" + mapObject.path.centroid(dataFeature) + ")"; 	
	    	    	}else{
	    	    		return "translate(0,0)"; 
	    	    	}
	    	    	
	    	    })
	    	    .attr("r", function(d){
	    	    	return mapObject.valueScale(mapObject.getValue(d));
	    	    })
	    	    .on('mousemove', function(d) {
    	    		var mouse = d3.mouse(mapObject.map.node()).map(function(d) {
    	    		    return parseInt(d);
    	    		});
    	    		var dataFeature = getDataFeature(d.iso);
    	    		var country = mapVariablesService.getCountryByISO(dataFeature.properties.iso_a3);
    	    		if(country !== null){
    	    			var mapWidth = parseInt(mapObject.map.style("width"));
    	    			var tooltipLeft = mouse[0]+215 < mapWidth ? (mouse[0] + 15) : (mouse[0] - 215);

    	    			mapObject.tooltip.classed('show', true)
    	    			    .attr('style', 'left:' + (tooltipLeft) +
    	    			            'px; top:' + (mouse[1] - 35) + 'px')
    	    			    .html(
    	    			    	"<div class='title'>"+country.name+
    	    			    	"<div class='item'></div></div>"+
    	    			    	"<div class='item'>Common Official Language: No</div>"+
    	    			    	"<div class='item'>Colonial Linkage: Yes</div>"+
    	    			    	"<div class='item'>Trade Agreement: Yes</div>"+
    	    			    	"<div class='item'>Regional Bloc: Yes</div>"+
    	    			    	"<div class='item'>Physical Distance: No</div>"+
    	    			    	"<div class='item'>Common Border: No</div>"+
    	    			    	"<div class='item'>Ratio of Per Capita Income: No</div>"
    	    			    );
    	    		}	
                })
                .on('mouseout', function() {
                    mapObject.tooltip.classed('show', false);
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
				.style("display",function(d){
					if(getDataFeature(d.iso) === null){
						return "none";
					}
				})
				.attr("width", "20px")
				.attr("height", "15px")
				.attr("preserveAspectRatio", "none")
	    	    .on('mousemove', function(d) {
    	    		var mouse = d3.mouse(mapObject.map.node()).map(function(d) {
    	    		    return parseInt(d);
    	    		});
    	    		var dataFeature = getDataFeature(d.iso);
    	    		var country = mapVariablesService.getCountryByISO(dataFeature.properties.iso_a3);
    	    		if(country !== null){
    	    			var mapWidth = parseInt(mapObject.map.style("width"));
    	    			var tooltipLeft = mouse[0]+215 < mapWidth ? (mouse[0] + 15) : (mouse[0] - 215);

    	    			mapObject.tooltip.classed('show', true)
    	    			    .attr('style', 'left:' + (tooltipLeft) +
    	    			            'px; top:' + (mouse[1] - 35) + 'px')
    	    			    .html(
    	    			    	"<div class='title'>"+country.name+
    	    			    	"<div class='item'></div></div>"+
    	    			    	"<div class='item'>Common Official Language: No</div>"+
    	    			    	"<div class='item'>Colonial Linkage: Yes</div>"+
    	    			    	"<div class='item'>Trade Agreement: Yes</div>"+
    	    			    	"<div class='item'>Regional Bloc: Yes</div>"+
    	    			    	"<div class='item'>Physical Distance: No</div>"+
    	    			    	"<div class='item'>Common Border: No</div>"+
    	    			    	"<div class='item'>Ratio of Per Capita Income: No</div>"
    	    			    );
    	    		}	
                })
                .on('mouseout', function() {
                    mapObject.tooltip.classed('show', false);
                });
	    }

	    function addLegend(percentiles, property){
	    	if(mapObject.type === "cartogram"){
	    		var percArray = percentiles.reverse();
	    		var legendWidth = mapObject.width/3;
	    		var rectWidth = legendWidth/9;
	    		
	    		mapObject.mapLegend.selectAll('.legend-item')
	    			.data(percArray)
	    			.enter()
	    			.append('rect')
	    			.attr('class','legend-item')
	    			.attr('x',function(d,i){ return i*rectWidth;})
	    			.attr('y',10)
	    			.attr('width',rectWidth+'px')
	    			.attr('height','12px')
	    			.attr('fill',function(d,i){
	    				var obj = {};
	    				obj[property] = d;
	    				return mapObject.colorFunction(obj);
	    			});

    			mapObject.mapLegend.selectAll('.legend-item-text')
    				.data(percArray)
    				.enter()
    				.append('text')
    				.attr('class','legend-item-text')
    				.attr('x',function(d,i){ return (i+1)*rectWidth;})
    				.attr('y',5)
    				.attr('text-anchor','middle')
    				.text(function(d,i){
    					if(i<percArray.length-1){
    						return Math.round(parseFloat(d))+'%';	
    					}else{
    						return "";
    					}
    				});

    			var unknowWidth = rectWidth*1.5;
    			mapObject.mapLegend
    				.append('rect')
    				.attr('class','legend-item')
    				.attr('x',8*rectWidth)
    				.attr('y',10)
    				.attr('width',unknowWidth+'px')
    				.attr('height','12px')
    				.attr('fill',"#CBCBCB");

    			mapObject.mapLegend
    				.append('text')
    				.attr('class','legend-item-text')
    				.attr('x',(8*rectWidth + (unknowWidth/2)))
    				.attr('y',5)
    				.attr('text-anchor','middle')
    				.text("Unknown");

			}else if(mapObject.type === "flags"){
				
			}else if(mapObject.type === "circles"){
				
			}
	    }

	    function addLegendMultiple(colorClasification){
	    	if(mapObject.type === "cartogram"){
	    		var index = 0;
	    		for(var name in configColors[colorClasification]){
	    			domain.push(name);
	    			range.push(configColors[colorClasification][name]);

	    			var legendItem = mapObject.mapLegend.selectAll('.legend-item')
	    				.append('g')
	    				.attr('class','legend-item')
	    				.attr('translate');

	    			index++;
	    		}
	    		
	    		mapObject.mapLegend.selectAll('.legend-item')
	    			.data(percArray)
	    			.enter()
	    			.append('rect')
	    			.attr('class','legend-item')
	    			.attr('x',function(d,i){ return i*rectWidth;})
	    			.attr('y',10)
	    			.attr('width',rectWidth+'px')
	    			.attr('height','12px')
	    			.attr('fill',function(d,i){
	    				return mapObject.colorFunction({total_percent:d});
	    			});

    			mapObject.mapLegend.selectAll('.legend-item-text')
    				.data(percArray)
    				.enter()
    				.append('text')
    				.attr('class','legend-item-text')
    				.attr('x',function(d,i){ return (i+1)*rectWidth;})
    				.attr('y',5)
    				.attr('text-anchor','middle')
    				.text(function(d,i){
    					if(i<percArray.length-1){
    						return Math.round(parseFloat(d))+'%';	
    					}else{
    						return "";
    					}
    				});
			}
	    }

	    function deleteMapLayers(){
	    	d3.select("svg #layer").remove();
	    	d3.select("svg #mapLeyend").remove();
	    	d3.select("svg #mapWatermark").remove();
	    	d3.select("svg #mapWatermarkGlobe").remove();
	    	d3.select('#mapTooltip').remove();
	    }

	    function setClickFunction(clickFunction){
	    	mapObject.clickFunction = d3.functor(clickFunction);
	    }

	    function setConfigVar(configVar, value){
	    	mapObject[configVar] = value;
	    }

	    /* PRIVATES */
	    function addWatermark(){

	    	mapObject.mapWatermark
	    		.append('text')
	    		.attr('class','watermark-text')
	    		.attr('x',0)
	    		.attr('y',0)
	    		.attr('text-anchor','start')
	    		.text("© Pankaj Ghemawat");

	    	mapObject.mapWatermark
	    		.append('text')
	    		.attr('class','watermark-text')
	    		.attr('x',0)
	    		.attr('y',10)
	    		.attr('text-anchor','start')
	    		.text("Source: www.ghemawat.com");

			mapObject.mapWatermarkGlobe
				.append('svg:image')
				.attr('x', 10)
				.attr('y', 10)
				.attr('width', 39)
				.attr('height', 39)
    			.attr('xlink:href','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABFpJREFUeNrEWEF20zAQdV13nWzppmXDg1XCimUMHKC+QdMTYNYscE+Ae4P0BA0HAJwTYFZAoeC0ULbNgpL20YaZvlH4DJJjp+Gh99S4six9/Zn50mhpMpl4dcuLl4N1+mk+fNDJj4+/Nek5Hh4ePTk9/RFAtzdUC6oZ1T71LerOs1QHHIHq0g9XBtS9c/uWmbx1ePTF+/79tOxzBpsSyN5CwRGokH540DWZJCRgngHGD8TcT8WcqwypJlVAloIjUMxQSnUTVh/SwCdkTgbWMe3v9z+MLy8n96BfS7HWUsMPqEY8lmt+fwawDIANAVgCwK7aCdgYPg8FkCk8zk2qu9DG3xc0T7sWOPmgUKuNBBgHQ4ztq6s3/li9sMG+OZKmRxJA3HZfFsSlwcBdAH0HYz350JQdjkx5TuDdNgHLbQNL/wSaUmlnFtti1lKANuYyxdjITCKsbUJ7WubQBCQFljoGADNLNQQzG4BNJzh6mVgctwdOi+ZMtTkdBdmLFfiuYrBvjVYR1s+WwW8aASXmTsCkO1Sn4A4+Fd3z8/M1Y241xlN41u+a4pOmbBmZQV2y6c4bABYpP8QBvZWVwCNwNjBeCVAX07/BiS90LB0RcATPd3UgvH23P9U9WtCSZbszVnlO7yNLILJJN1joeSdi9nybL6jgQO26CgRXhJYERgGBETq6xfrZt7Ci5cCTzX3NArhOMc7esMmGLMAER4v7+PRH+xJuL6bgYPmc4HLHeC43CgOJuG1Lx8Ji0uswh+OtV3GjQBQ7m3OSOn7HIlvKHJuW+ozEkm2/4thT5igYCu/6pVnB/GtLX78eV2GtDX45sHX4XBy2xuNxs6wPyNWoxHenczG4yQKY8CqchGuXQG3w+bzMXVxctsBcC2EukI78T07+ZBVIPPW6+qgdInScE42V8pI+03F8WEGnhOEMgLbnMZE6DhUz/PtqX0dwVSduzulC7VngZA827lP4yvZRjT32OuBc/obzZ7464HUrbD3/EhzO3/flNPvcCB+Z9q/JpY/JpjpyEKhbDCsjW/YvuXELz5EBJB8b5rAnqZ9t2zIfxxLB07IcLDcvfl7gRC4pyi3vPVsyND2mqyT5f4rwkFhb1yLMyF/B/48tvtGDc90WRt347CwFZu+r6N4D8Y0s0b9nO3QG4FcZsbcDuQE7Z4gZFr1nAM9MYNC7LojwCZ5AVEaHmVxmuVXw4Ajfd+WtCTg+s5Ap5+9BFr8peews4Y21LylgLbjW6DrzVmEpAgAGYBvepzMyNu0GJhB2TZRagI1slzq+RTYK0TINMIbVD0FWYgdrESjAyDAo7YUCFsJ1x+wrMDFZX90ADMT0vMLXmCqSz6UQ7XeFmYYKrkQpwlAYy2vfz4m/JTqBlkFPcPX7Hw8K0jlkowHPheWag4W/W3Y/V+lmU3aNpEwHa+gcLyzGqFzInbCAjMGX6oAbiJQs9k7YYe5ItqWrSuAaAM6cdM2FdjbPbfovAQYAz2ZGGjGgCeEAAAAASUVORK5CYII=');
	    }

	    function getId(d){
	    	if(d.properties){
	    		return  d.properties.iso_a3?d.properties.iso_a3:d.properties.id;
	    	}else{
	    		return d.id;
	    	}
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

						if(isNaN(getNewDistance(focusPoint, currentPoint, mapObject.valueScale(mapObject.getValue(d)))[0])){
							console.log(d);
						}else{
							return getNewDistance(focusPoint, currentPoint, mapObject.valueScale(mapObject.getValue(d)))[0];
						}
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
	    	mapObject.mapCircles.selectAll(".circle")
	    		.data(data, function(d){ return d.iso; })
	    		.transition()
	    		.duration(700)
	    		.attr("r", function(d){
	    			return mapObject.valueScale(mapObject.getValue(d));
	    		});
				
	    }

	    
	    function doZoom() {
	    	var t = d3.event.translate,
	    	    s = d3.event.scale;
	    	  	t[0] = Math.min(mapObject.width / 2 * (s - 1), Math.max(mapObject.width / 2 * (1 - s), t[0]));
	    	  	t[1] = Math.min(mapObject.height / 2 * (s - 1) + 230 * s, Math.max(mapObject.height / 2 * (1 - s) - 230 * s, t[1]));

			// Zoom and keep the stroke width proportional
			mapObject.layer.attr("transform", "translate(" + t + ")scale(" + s + ")");
			d3.selectAll('.mapFeature').style("stroke-width", 0.5 / s + "px");
			d3.selectAll('.circle').style("stroke-width", 0.8 / s + "px");
			d3.selectAll('.flag').style("transform", "translate(" + t + ")scale(" + s + ")");

			mapObject.zoom.translate(t);
			mapObject.tooltip.classed('show', false);
	    }

	    // Point p1 focus - p2 relative
	    function getNewDistance(p1, p2, modifier){
	    	if(parseFloat(p1[0]) === parseFloat(p2[0]) && parseFloat(p1[1]) === parseFloat(p2[1])){
	    		return p1;
	    	}

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
				if(mapObject.dataFeatures[i].properties.iso_a3 === iso){
					return mapObject.dataFeatures[i];
				}
			}
			return null;
	    }

	    return({
			getMapObject         : getMapObject,
			resetMapObject       : resetMapObject,
			setType              : setType,
			setSize              : setSize,
			setColorScale        : setColorScale,
			setColorScaleLinear  : setColorScaleLinear,
			setColorScaleOrdinal : setColorScaleOrdinal,
			setDataset           : setDataset,
			iniMapLayers         : iniMapLayers,
			setZoom              : setZoom,
			setProjection        : setProjection,
			setDataNest          : setDataNest,
			setTopology          : setTopology,
			setFocusCountry      : setFocusCountry,
			resetMap             : resetMap,
			setColorFunction     : setColorFunction,
			updateData           : updateData,
			setValueScale        : setValueScale,
			setValueFunction     : setValueFunction,
			addCircles           : addCircles,
			addFlags             : addFlags,
			fetchFlags           : fetchFlags,
			addLegend            : addLegend,
			addLegendMultiple	 : addLegendMultiple,
			deleteMapLayers      : deleteMapLayers,
			setClickFunction     : setClickFunction,
			setConfigVar         : setConfigVar
		});


	}]);
