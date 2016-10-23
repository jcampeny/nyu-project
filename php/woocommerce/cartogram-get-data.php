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

}else if ($item_data->reason == 'distvars'){
	try {
		$distvars  = getDistVars($user, $item_data->iso);
	    $response_array['status'] = 'success';
		$response_array['content'] = $distvars;
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
	$sql_get_tables = 'SELECT m.table FROM Metadata m WHERE datatree like "Activities|Standard Datasets%" or datatree like "Size|Standard datasets%" GROUP BY m.table';
	$indicators = [];

	if ($resultado = $conn->query($sql_get_tables)) {
	    $response_array['status'] = 'success';

		while ($row = $resultado->fetch_object()){
			//get todos los indicadores de cada una de las tablas obtenidas
	        $sql_get_indicator = "
	        	SELECT m.name, m.code, m.sources
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
        			$i = new stdClass();
        			$i->name = $row_indicator->name;
        			$i->code = $row_indicator->code;
        			$i->source = $row_indicator->sources;
					array_push($children, $i);
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
		"individual"  => array()
		// "region"      => array(),
		// "continent"   => array(),
		// "income"      => array(),
		// "development" => array()
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
			$c->name        = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($row->country));
			$c->region      = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($row->region));
			$c->continent   = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($row->continent));
			$c->income      = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($row->income));
			$c->development = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($row->development));

	        array_push($countries['individual'],$c);
	        
	        // if(!in_array($row->region,$countries['region'])){
	        // 	array_push($countries['region'], $row->region);
	        // }
	        // if(!in_array($row->continent,$countries['continent'])){
	        // 	array_push($countries['continent'], $row->continent);
	        // }
	        // if(!in_array($row->income,$countries['income'])){
	        // 	array_push($countries['income'], $row->income);
	        // }
	        // if(!in_array($row->development,$countries['development'])){
	        // 	array_push($countries['development'], $row->development);
	        // }
	    }
	    $conn->close();
	    return $countries;
	}else{
		throw new Exception("Can't get countries data");
	}

}

function getDistVars ($user, $country) {
	$user_role = $user->get_role();
	$role_minimum = 0;

	// Create connection
	$conn = new mysqli(
		'nyu-general.c5opksnh3gku.us-west-2.rds.amazonaws.com', 
		'nyunewweb', 
		'k1zCbksPR1cHhxOs%L', 
		'datavault'
	);

	//get tables
	$sql_get_distvars = '
		SELECT gd.iso1, gd.iso2, comlang_off as "common_language", colony as "colonial_linkage", distw as "physical_dist", contig as "common_border", ta.rta_update as "trade_agreements", ta.regionalbloc as "regional_bloc", dgpr.value as "gdp_ratio"
		FROM CEPIIGeoDist gd
		INNER JOIN TradeAgreements ta ON gd.iso1 = ta.iso1 AND gd.iso2 = ta.iso2 AND ta.year="2016"
		INNER JOIN GDPPCRatio dgpr ON gd.iso1 = dgpr.iso1 AND gd.iso2 = dgpr.iso2
		WHERE gd.iso1 = "'.$country.'"  GROUP BY iso1, iso2
	';
	$vars = array();


	if ($resultado = $conn->query($sql_get_distvars)) {
	    $response_array['status'] = 'success';

		while ($row = $resultado->fetch_object()){
			$v = new stdClass();
			$v->iso1             = $row->iso1;
			$v->iso2             = $row->iso2;
			$v->common_language  = $row->common_language;
			$v->colonial_linkage = $row->colonial_linkage;
			$v->physical_dist    = $row->physical_dist;
			$v->common_border    = $row->common_border;
			$v->trade_agreements = $row->trade_agreements;
			$v->regional_bloc    = $row->regional_bloc;
			$v->gdp_ratio        = $row->gdp_ratio;

			$vars[$v->iso1."_".$v->iso2] = $v;
	    }

	    $conn->close();
	    return $vars;
	}else{
		throw new Exception("Can't get table's name");
	}
}