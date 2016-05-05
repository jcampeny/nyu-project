angular.module('app')
.service("ParseService", [function() {
	return {
		parseCSV: parseCSV
	};

	function parseCSV(data, props, separator){
		var dataSeparator = separator?separator:"\r";
		var dataParsed = [];
		var rows = data.split(dataSeparator);

		angular.forEach(rows,function(d){
			var columns = d.split(";");
			var newObj = {};
			angular.forEach(columns,function(c, i){
				if(props[i] === "value-f"){
					newObj.value = parseFloat(c.replace(",","."));
				}else if(props[i] === "value-i"){
					newObj.value = parseInt(c);
				}
				newObj[props[i]] = c;
			});
			dataParsed.push(newObj);
		});
		return dataParsed;
	}

}])
.service("FormatService", [function() {
	return {
		dotToComa: dotToComa,
		comaToDot: comaToDot,
		round: round
	};

	function round(num, dec){
		if(typeof dec === "undefined" || dec < 0){
			dec = 2;
		}

		return Math.round(num * Math.pow(10,dec)) / Math.pow(10,dec);
	}

	function comaToDot(value){
		return parseFloat(value.toString().replace(",",'.'));
	}

	function dotToComa(value){
		return value.toString().replace(".",',');
	}
}])
.service("ArrayService", [function() {

	return {
		addToSet: addToSet,
		arrayToSet: arrayToSet,
		arraySortByProperty: arraySortByProperty,
		arrayUpdate: arrayUpdate,
		removeFromArray: removeFromArray,
		mergeArrayData: mergeArrayData,
		getFromProperty: getFromProperty,
		sortByKey: sortByKey,
		getHospitalData: getHospitalData,
		getAreaGroupName: getAreaGroupName
	};

	function sortByKey(array, key){
		array.sort(function(a, b) {
			return a[key] - b[key];
		});
	}

	function getAreaGroupName(groups, areaId, groupNumber){
		var groupName = "";

		angular.forEach(groups[areaId],function(g){
			if(g.number === groupNumber){
				groupName = g.name;
			}
		});
		return groupName;
	}

	function getHospitalData(array, area, proceso, indicador, individual) {
		var result = [];

		for(var i=0 ; i<array.length ; i++){
			if(array[i].area == area) {
				if(typeof proceso !== "undefined" && proceso !== null) {
					if(array[i].proceso == proceso){
						if(typeof indicador !== "undefined" && indicador !== null) {
							if(array[i].indicador == indicador){
								result.push(array[i]);
							}
						} else if(array[i].indicador !== "GLOBAL"){
								result.push(array[i]);
						}
					}
				} else {
					result.push(array[i]);
				}
			}
		}

		if(result.length === 0){
			result = null;

		} else if(result.length === 1 && individual){
			result = result[0];
		}

		return result;
	}

	function mergeArrayData(originalArray, recentArray, id_name, direction) {
		for(var i=0 ; i<recentArray.length ; i++){
			var esta = false;

			for(var j=0 ; j<originalArray.length ; j++){
				if(recentArray[i][id_name] == originalArray[j][id_name]) {
					esta = true;
					originalArray = arrayUpdate(originalArray, recentArray[i], id_name, direction, true);
				}
			}

			if(!esta) {
				if(typeof direction === "undefined" || direction == "END"){
					originalArray.push(recentArray[i]);
				}else if(direction === "INI"){
					originalArray.unshift(recentArray[i]);
				}
			}
		}

		return originalArray;
	}

	function arrayUpdate(setArray, element, id_name, direction, exhaustive){
		var esta = false;
		for(var i=0 ; i<setArray.length ; i++){
			if(setArray[i][id_name] == element[id_name]){
				esta = true;

				for (var property in setArray[i]) {
					if (setArray[i].hasOwnProperty(property)) {
						if(Object.prototype.toString.call( setArray[i][property] ) !== '[object Array]' || typeof exhaustive === "undefined" || !exhaustive){
							setArray[i][property] = element[property];
						}else{
							for(var j=0 ; j<element[property].length ; j++){
								setArray[i][property] = arrayUpdate(setArray[i][property], element[property][j], 'id', direction, exhaustive);
							}
						}
					}
				}
			}
		}

		if(!esta){
			setArray = addToSet(setArray, element, id_name, direction);
		}

		return setArray;
	}

	function addToSet(setArray, element, id_name, direction){
		var esta = false;
		for(var i=0 ; i<setArray.length ; i++){
			if(setArray[i][id_name] == element[id_name]) esta = true;
		}

		if(!esta) {
			if(typeof direction === "undefined" || direction == "END"){
				setArray.push(element);
			}else if(direction === "INI"){
				setArray.unshift(element);
			}
		}

		return setArray;
	}

	function arrayToSet(originArray, id_name){
		var newArray = [];

		for(var i=0 ; i<originArray.length ; i++){

			var esta = false;
			for(var j=0 ; j<newArray.length ; j++){
				if(originArray[i][id_name] == newArray[j][id_name]) esta = true;
			}

			if(!esta){
				newArray.push(originArray[i]);
			}
		}

		return newArray;
	}


	function removeFromArray(setArray, element, id_name){
		var newArray = angular.copy(setArray);

		for(var i=newArray.length-1 ; i>=0 ; i--){
			if(newArray[i][id_name] == element[id_name]) {
				newArray.splice(i,1);
			}
		}

		return newArray;
	}

	function getFromProperty(array, id_name, id_value){
		var element = null;

		for(var i=0 ; i<array.length ; i++){
			if(array[i][id_name] == id_value) element = array[i];
		}

		return element;
	}

	function arraySortByProperty(arrayToSort, property, direction){
		var dir = "ASC";
		if(typeof direction !== "undefined") dir = direction;

		function compare(a,b) {
			if(dir == "ASC"){
				if (a[property] < b[property])return -1;
				if (a[property] > b[property]) return 1;

			}else if(dir == "DESC"){
				if (a[property] < b[property])return 1;
				if (a[property] > b[property]) return -1;
			}
		  return 0;
		}
		arrayToSort.sort(compare);
		return arrayToSort;
	}
}]);
