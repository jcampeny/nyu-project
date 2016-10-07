<?php
require 'controller.php';
require 'validate-user.php';

//GET DATA
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$item_data = $request->item;

//Create user
$user = new User($user_data->name, $user_data->pass);

$response_array['status'] = 'error';
$response_array['content'] = '';


if ($item_data->reason == 'years'){
	try {
		$years = getYears($user, $item_data->iso, $item_data->code);
		$response_array['status'] = 'success';
		$response_array['content'] = $years;
	} catch (Exception $e) {
		$response_array['status'] = 'error';
		$response_array['content'] = $e->getMessage();
	}

} else if ($item_data->reason == 'indicators'){
	try {
		$indicators  = getIndicators($user, $item_data->iso);
	    $response_array['status'] = 'success';
		$response_array['content'] = $indicators;
	} catch (Exception $e) {
		$response_array['status'] = 'error';
		$response_array['content'] = $e->getMessage();
	}

	// $response_array['status'] = 'success';
	// $response_array['content'] = array(
	// 	"name" => 'GCI', 
	// 	"children" => 'm.exports'
	// );
} else if ($item_data->reason == 'countries'){
	try {
		$countries  = getCountries($user);
	    $response_array['status'] = 'success';
		$response_array['content'] = $countries;
	} catch (Exception $e) {
		$response_array['status'] = 'error';
		$response_array['content'] = $e->getMessage();
	}
}

print json_encode($response_array);


/******************************************************************************************/

function translateCode($indicator){
	$json = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/localdata/code_translate.json');
	$obj = json_decode($json);
	$translates = $obj->translate;

	$file_name = '';

	foreach ($translates as $key => $value) {
		if ($value->indicator_code == $indicator)
			$file_name = $value->indicator_file;
	}

	if ($file_name === ''){
		throw new Exception('Indicator ' . $indicator . ' not found in Code_translate.json');
	} else {
		return $file_name;
	}

}

function getYears ($user, $iso, $indicator) {
	$years = array();
	$directory = $_SERVER['DOCUMENT_ROOT'] . '/localdata/vizdata/cartograms';

	$json_files  = scandir($directory);

	try {
		$indicator = translateCode($indicator);
	} catch (Exception $e) {
		throw new Exception($e->getMessage());
	}

	foreach ($json_files as $key => $value) {
		$file_name = explode("_", $value);

		if(count($file_name) === 3) {
			$indicator_file = $file_name[0];
			$year_file      = $file_name[1];
			$country_file   = explode(".", $file_name[2])[0];
			$year_added     = array_search($year_file, $years);

			if ($indicator_file == $indicator && 
				$country_file == $iso &&
				$year_added === false)
			{
				array_push($years, $year_file);
			}
		}
	}

	return $years;
}

function getIndicators ($user, $iso) {
	$indicators = [];

	$user_role = $user->get_role();
	$role_minimum = 0;

	// Create connection
	$conn = new mysqli(
		'nyu-general.c5opksnh3gku.us-west-2.rds.amazonaws.com', 
		'nyunewweb', 
		'k1zCbksPR1cHhxOs%L', 
		'datavault'
	);

	// Check connection
	if ($conn->connect_error !== NULL) 
	    throw new Exception("Connection failed: " . $conn->connect_error);
	

	//Check valid user
	if($user->status != "success")
		// throw new Exception($user->error);
	

	//Check Role
	if($user_role < $role_minimum)
		throw new Exception("Role not valid");
	
	//get tables
	$sql_get_tables = 'SELECT m.table FROM Metadata m GROUP BY m.table';
	$indicators = [];

	if ($resultado = $conn->query($sql_get_tables)) {
	    $response_array['status'] = 'success';

		while ($row = $resultado->fetch_object()){
			//get todos los indicadores de cada una de las tablas obtenidas
	        $sql_get_indicator = "
	        	SELECT m.name
	        	FROM Metadata m  
	        	RIGHT JOIN $row->table g 
	        	ON m.code = g.code 
	        	WHERE g.iso1 = '$iso'
	        	OR (g.iso1 = 'World' AND g.iso2 = '$iso')
	        	GROUP BY m.code";

	        //guardamos cada resultado
        	if ($resultado_indicator = $conn->query($sql_get_indicator)) {

        	   	$children = array();

        		while ($row_indicator = $resultado_indicator->fetch_object()){
					array_push($children, $row_indicator->name);
        	    }

        	    array_push($indicators, array("name" => $row->table, "children" => $children));
        	}/*else{
        		throw new Exception("Can't get indicators".$conn->error);
        	}*/
	    }

	    $conn->close();
	    return $indicators;
	}else{
		throw new Exception("Can't get table's name");
	}
}


function getCountries($user){
	$countries = array(
		"individual"  => array(),
		"region"      => array(),
		"continent"   => array(),
		"income"      => array(),
		"development" => array()
	);

	$user_role = $user->get_role();
	$role_minimum = 0;
	
	// Create connection
	$conn = new mysqli(
		'nyu-general.c5opksnh3gku.us-west-2.rds.amazonaws.com', 
		'nyunewweb', 
		'k1zCbksPR1cHhxOs%L', 
		'datavault'
	);
	
	// Check connection
	if ($conn->connect_error !== NULL) 
	    throw new Exception("Connection failed: " . $conn->connect_error);
	

	//Check valid user
	if($user->status != "success")
		// throw new Exception($user->error);
	

	//Check Role
	if($user_role < $role_minimum)
		throw new Exception("Role not valid");
	
	//get tables
	$sql_get_countries = 'SELECT `iso`,`country`,`region`,`continent`,`wb.income` as `income`,`imf.official` as `development` FROM MatchCountry';

	if ($resultado = $conn->query($sql_get_countries)) {
	    $response_array['status'] = 'success';
	    
		while ($row = $resultado->fetch_object()){
			//get todos los indicadores de cada una de las tablas obtenidas
	        $c = new stdClass();
	        $c->iso = $row->iso;
	        $c->name = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($row->country));

	        array_push($countries['individual'],$c);
	        
	        if(!in_array($row->region,$countries['region'])){
	        	array_push($countries['region'], $row->region);
	        }
	        if(!in_array($row->continent,$countries['continent'])){
	        	array_push($countries['continent'], $row->continent);
	        }
	        if(!in_array($row->income,$countries['income'])){
	        	array_push($countries['income'], $row->income);
	        }
	        if(!in_array($row->development,$countries['development'])){
	        	array_push($countries['development'], $row->development);
	        }
	    }
	    $conn->close();
	    return $countries;
	}else{
		throw new Exception("Can't get countries data");
	}

}