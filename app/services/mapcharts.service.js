
angular.module('app').service("MapChartsService",["ArrayService", "mapVariablesService", function(ArrayService, mapVariablesService) {
	    var mapObject = {};

	    var multipleColors = ["#2D3E50","#2D6489","#62BBCD","#016A64","#E45425","#A72865","#47398F"];
	    var configColors = {
	    	region : {
				"South & Central Asia"       : multipleColors[0],
				"Europe"                     : multipleColors[1],
				"Middle East & N. Africa"    : multipleColors[2],
				"East Asia & Pacific"        : multipleColors[3],
				"Sub-Saharan Africa"         : multipleColors[4],
				"S. & C. America, Caribbean" : multipleColors[5],
				"North America"              : multipleColors[6]
		    },
		    continent : {
    			"Asia"          :multipleColors[0],
    			"Europe"        :multipleColors[1],
    			"Africa"        :multipleColors[2],
    			"Oceania"       :multipleColors[3],
    			"North America" :multipleColors[6],
    			"South America" :multipleColors[5]
    	    },
    	    development : {
    	    	"Emerging Economies" : multipleColors[0],
				"Advanced Economies" : multipleColors[1]
    	    },
    	    income : {
				"Low-income economies"          : multipleColors[0],
				"High-income economies"         : multipleColors[1],
				"Upper-middle-income economies" : multipleColors[2],
				"Lower-middle-income economies" : multipleColors[3]
    	    }
	    };

	    function getMapObject(){
	    	return mapObject;
	    }

	    function resetMapObject(){
	    	mapObject = {
	    		type 		  	 : null,
	    		subtype			 : null,
	    		dataset 	  	 : null,
	    		dataNest 	  	 : null,
				width         	 : 0,
				height        	 : 0,
				body          	 : null,
				map           	 : null,
				layer         	 : null,
				mapFeatures   	 : null,
				mapCircles	  	 : null,
				mapFlags	  	 : null,
				mapLegend	  	 : null,
				dataFeatures  	 : null,
				tooltip       	 : null,
				zoom          	 : null,
				projection    	 : null,
				path          	 : null,
				colorScale 	  	 : null,
				colorFunction 	 : null,
				valueScale 	  	 : null,
				getValue	  	 : null,
				countryFlags  	 : null,
				focusCountry  	 : null,
				clickFunction 	 : null,
				tooltipValueName : null,
				valueName		 : null
		    };
	    }

	    function setType(type){
	    	mapObject.type = type;
	    }
	    function setSubType(type){
	    	mapObject.subtype = type;
	    }

	    function setSize(width,height){
	    	mapObject.width = width;
	    	mapObject.height = height;
	    }

	    function setMultipleCountriesScale(countries){
	    	mapObject.colorScale = {};
	    	mapObject.colorScaleHex = {};

	    	angular.forEach(countries,function(c,i){
	    		mapObject.colorScale[c] = d3.hsl(multipleColors[i]);
	    		mapObject.colorScaleHex[c] = multipleColors[i];
	    	});
	    }

	    function setColorScale(type, value){
	    	if(type === "share" || type === "another"){
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

	    function setColorScaleMultiple(countries){
	    	var colorsArray = [];
	    	angular.forEach(countries,function(c){
	    		colorsArray.push(mapObject.colorScale[c]);
	    	});
	    	var color = d3.scale.ordinal()
	    	  .range(colorsArray)
	    	  .domain(countries);
	    	
	    	setColorFunction(function(iso){
	    	  if(iso){
	    	    return color(iso);
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
	    	if(angular.isArray(iso)){
	    		mapObject.focusCountry = [];
	    		angular.forEach(iso,function(d){
	    			mapObject.focusCountry.push(mapObject.dataNest[d.toUpperCase()]);
	    		});
	    	}else{
	    		mapObject.focusCountry = mapObject.dataNest[iso.toUpperCase()];
	    	}
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
	    	    		if(isFocusCountry(getId(d).toUpperCase())){
	    	    			if(mapObject.subtype === "multiple-focus"){
	    	    				return mapObject.colorFunction(getId(d));
	    	    			}else{
	    	    				return "#96281B";	
	    	    			}
	    	    		}else{
	    	    			if(mapObject.subtype === "multiple-focus"){
	    	    				var country = mapObject.dataNest[getId(d)];

	    	    				if(country){
	    	    					var adjustFactor = 0.4;
	    	    					if(mapObject.colorBlending){
	    	    						var iso1 = mapObject.focusCountry[0].iso;
	    	    						var iso2 = mapObject.focusCountry[1].iso;

	    	    						var hex1 = mapObject.colorScaleHex[iso1];
	    	    						var hex2 = mapObject.colorScaleHex[iso2];

	    	    						if(!mapObject.colorMax){
	    	    							hex1 = blend_colors(hex1,"#FFFFFF", 1-country.valuesPerc[iso1] - adjustFactor);
	    	    							hex2 = blend_colors(hex2,"#FFFFFF", 1-country.valuesPerc[iso2] - adjustFactor);
	    	    						}

	    	    						return blend_colors(
	    	    							hex1,
	    	    							hex2,
	    	    							country.values[iso1] / (country.values[iso1] + country.values[iso2])
	    	    							);
	    	    					}else{
	    	    						var maxCountryValue = 0;
	    	    						var maxCountryIso = "";

	    	    						angular.forEach(mapObject.focusCountry,function(fc){
	    	    							if(maxCountryValue < country.values[fc.iso]){
	    	    								maxCountryValue = country.values[fc.iso];
	    	    								maxCountryIso = fc.iso;
	    	    							}
	    	    						});

	    	    						var resultColor = mapObject.colorScaleHex[maxCountryIso];

	    	    						if(!mapObject.colorMax){
	    	    							resultColor = blend_colors(resultColor,"#FFFFFF", 1-country.valuesPerc[maxCountryIso] - adjustFactor);
	    	    						}

	    	    						return resultColor;
	    	    					}
	    	    				}
	    	    			}else{
	    	    				return mapObject.colorFunction(mapObject.dataNest[getId(d)]) || "#CBCBCB";
	    	    			}
	    	    			
	    	    		}
	    	    		
	    	    	}else{
	    	    		return "transparent";
	    	    	}
	    	    	
	    	    })
	    	    .attr("d", mapObject.path)
	    	    .on("click",function(d){
	    	    	if(mapObject.type === "cartogram"){
	    	    		if(isFocusCountry(getId(d).toUpperCase())){
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
	    	    		if(country !== null && !isFocusCountry(country.iso)){
	    	    			var mapWidth = parseInt(mapObject.map.style("width"));
	    	    			var tooltipLeft = mouse[0]+215 < mapWidth ? (mouse[0] + 15) : (mouse[0] - 215);

	    	    			var tooltipContent = 
	    	    				"<div class='title'>"+country.name+"";
    	    			    	
	    	    			if(mapObject.dataNest[d.properties.iso_a3].total_received){
	    	    				tooltipContent += "<div class='item'>"+Math.round(mapObject.dataNest[d.properties.iso_a3].total_received)+"%</div></div>";	
	    	    			}

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

                if(mapObject.hasDistortion){
                	fitMap();	
                }
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

	    function setValueName(valName){
	    	mapObject.valueName = valName;
	    }
	    function setTooltipValueName(valName){
	    	mapObject.tooltipValueName = valName;
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
					if(isFocusCountry(d.iso)){
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
					if(isFocusCountry(d.iso)){
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

	    	if(mapObject.hasDistortion){
	    		// var initialScaleConfig = getDistortedInitialScaleConfig();
	    		// t = [t[0] , t[1]];
	    		// t[0] = Math.min(initialScaleConfig.dx / 2 * (s - 1), Math.max(initialScaleConfig.dx / 2 * (1 - s), t[0]));
	    		// t[1] = Math.min(mapObject.height / 2 * (s - 1) + 230 * s, Math.max(mapObject.height / 2 * (1 - s) - 230 * s, t[1]));
	    		if(initConfig.translate[0] !== 0  && initConfig.translate[1] !== 0){
	    			t[0] = initConfig.translate[0];
	    			t[1] = initConfig.translate[1];	
	    		}
	    		
	    		initConfig.translate = [0,0];
	    		s = d3.event.scale * initConfig.scale;
	    	}
	    	// t[0] = Math.min(mapObject.width / 2 * (s - 1), Math.max(mapObject.width / 2 * (1 - s), t[0]));
	    	// t[1] = Math.min(mapObject.height / 2 * (s - 1) + 230 * s, Math.max(mapObject.height / 2 * (1 - s) - 230 * s, t[1]));
	    	if(t[0] > mapObject.width / 2){t[0] = mapObject.width / 2;}
	    	if(t[0] < -1 * (mapObject.width * s * 1.3)){t[0] = -1 * (mapObject.width * s *1.3);}

	    	if(t[1] > mapObject.height / 2){t[1] = mapObject.height / 2;}
			if(t[1] < -1 * (mapObject.height / 2) * s * 1.3){t[1] = -1 * (mapObject.height / 2) * s * 1.3;}	    	

	    	console.log(t);

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

	    function isFocusCountry(iso){
	    	var itIs = false; 
	    	if(angular.isArray(mapObject.focusCountry)){
	    		angular.forEach(mapObject.focusCountry,function(d){
	    			if(d.iso === iso){
	    				itIs = true;
	    			}
	    		});
	    	}else{
	    		itIs = mapObject.focusCountry.iso === iso;
	    	}

	    	return itIs;
	    }

	    var initConfig = {
			dx        : 0,
			dy        : 0,
			x         : 0,
			y         : 0,
			scale     : 1,
			translate : [0,0]
    	};
        function getDistortedInitialScaleConfig(){
        	var bounds = d3.select('#mapFeatures').node().getBBox();
        	initConfig.dx = bounds.width;
        	initConfig.dy = bounds.height;
        	initConfig.x = bounds.width / 2;
        	initConfig.y = bounds.height / 2;
        	initConfig.scale = 0.9 / Math.max(initConfig.dx / mapObject.width, initConfig.dy / mapObject.height);
        	initConfig.translate = [mapObject.width / 2 - initConfig.scale * initConfig.x, mapObject.height / 2 - initConfig.scale * initConfig.y];

        	return initConfig;
        }

        function fitMap(){
        	var initialConfig = getDistortedInitialScaleConfig();

        	mapObject.layer.attr("transform", "translate(" + initialConfig.translate + ")scale(" + initialConfig.scale + ")");
        }

	    return({
			getMapObject              : getMapObject,
			resetMapObject            : resetMapObject,
			setType                   : setType,
			setSubType				  : setSubType,
			setSize                   : setSize,
			setColorScale             : setColorScale,
			setColorScaleLinear       : setColorScaleLinear,
			setColorScaleOrdinal      : setColorScaleOrdinal,
			setColorScaleMultiple	  : setColorScaleMultiple,
			setMultipleCountriesScale : setMultipleCountriesScale,
			setDataset                : setDataset,
			iniMapLayers              : iniMapLayers,
			setZoom                   : setZoom,
			setProjection             : setProjection,
			setDataNest               : setDataNest,
			setTopology               : setTopology,
			setFocusCountry           : setFocusCountry,
			resetMap                  : resetMap,
			setColorFunction          : setColorFunction,
			updateData                : updateData,
			setValueScale             : setValueScale,
			setValueFunction          : setValueFunction,
			addCircles                : addCircles,
			addFlags                  : addFlags,
			fetchFlags                : fetchFlags,
			addLegend                 : addLegend,
			addLegendMultiple         : addLegendMultiple,
			deleteMapLayers           : deleteMapLayers,
			setClickFunction          : setClickFunction,
			setConfigVar              : setConfigVar,
			setTooltipValueName       : setTooltipValueName,
			setValueName              : setValueName
		});


	}]);

/*
    blend two colors to create the color that is at the percentage away from the first color
    this is a 5 step process
        1: validate input
        2: convert input to 6 char hex
        3: convert hex to rgb
        4: take the percentage to create a ratio between the two colors
        5: convert blend to hex
    @param: color1      => the first color, hex (ie: #000000)
    @param: color2      => the second color, hex (ie: #ffffff)
    @param: percentage  => the distance from the first color, as a decimal between 0 and 1 (ie: 0.5)
    @returns: string    => the third color, hex, represenatation of the blend between color1 and color2 at the given percentage
*/
function blend_colors(color1, color2, percentage)
{
    // check input
    color1 = color1 || '#000000';
    color2 = color2 || '#ffffff';
    percentage = percentage || 0.5;

    // 1: validate input, make sure we have provided a valid hex
    if (color1.length != 4 && color1.length != 7)
        console.error('colors must be provided as hexes');

    if (color2.length != 4 && color2.length != 7)
        console.error('colors must be provided as hexes');    

    if (percentage > 1 || percentage < 0)
        console.error('percentage must be between 0 and 1');

    // output to canvas for proof
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');
    cvs.width = 90;
    cvs.height = 25;
    // document.body.appendChild(cvs);

    // color1 on the left
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 30, 25);

    // color2 on the right
    ctx.fillStyle = color2;
    ctx.fillRect(60, 0, 30, 25);

    // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
    //      the three character hex is just a representation of the 6 hex where each character is repeated
    //      ie: #060 => #006600 (green)
    if (color1.length == 4)
        color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
    else
        color1 = color1.substring(1);
    if (color2.length == 4)
        color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
    else
        color2 = color2.substring(1);   

    // console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);

    // 3: we have valid input, convert colors to rgb
    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];

    // console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');

    // 4: blend
    var color3 = [ 
        (1 - percentage) * color1[0] + percentage * color2[0], 
        (1 - percentage) * color1[1] + percentage * color2[1], 
        (1 - percentage) * color1[2] + percentage * color2[2]
    ];

    // console.log('c3 => [' + color3.join(', ') + ']');

    // 5: convert to hex
    color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

    // console.log(color3);

    // color3 in the middle
    ctx.fillStyle = color3;
    ctx.fillRect(30, 0, 30, 25);

    // return hex
    return color3;
}

/*
    convert a Number to a two character hex string
    must round, or we will end up with more digits than expected (2)
    note: can also result in single digit, which will need to be padded with a 0 to the left
    @param: num         => the number to conver to hex
    @returns: string    => the hex representation of the provided number
*/
function int_to_hex(num)
{
    var hex = Math.round(num).toString(16);
    if (hex.length == 1)
        hex = '0' + hex;
    return hex;
}
