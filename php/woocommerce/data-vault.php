<?php
require 'controller.php';
require 'validate-user.php';

/**********
function datavault(user, item){
    var data = {
        user : user,
        item : item
    };
    return $http.post('/php/woocommerce/data-vault.php', data);
}
objeto recibido {
	user : rootScope.actualUser,
	item : {
		code : '',
		iso : '',
		year : ''
	}
}
***************/

$response_array['status'] = 'error';
$response_array['content'] = '';

//GET DATA
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$item_data = $request->item;

/*****************
	CONNECTION
******************/

// Create connection
$conn = new mysqli(
	'nyu-general.c5opksnh3gku.us-west-2.rds.amazonaws.com', 
	'nyunewweb', 
	'k1zCbksPR1cHhxOs%L', 
	'datavault'
);


// Check connection
if ($conn->connect_error !== NULL) {
	$response_array['content'] = "Connection failed: " . $conn->connect_error;
    die("Connection failed: " . $conn->connect_error);
    print json_encode($response_array);
}

$user = new User($user_data->name, $user_data->pass);
$role = $user->get_role();
$user_role = ($role) ? $role : 1;

// $conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

$role_minimum = 1;

$sql = "SELECT ulevel, `table`,`levels`
FROM Metadata
WHERE code = '$item_data->code'";

if($resultado = $conn->query($sql)){
	$row = $resultado->fetch_object();
	
	$role_minimum = $row->ulevel;
	if($role_minimum > $user_role){
		$response_array['status'] = 'error';
		$response_array['content'] = 'role-not-valid';
		$response_array['data'] = '';		
	}else{
		$queryIso = "";
		$queryGroup = "";
		$queryFields = "";

		if($row->levels == "iso1|iso2|year"){
			$queryIso = "iso1";
			$queryGroup = "g.iso1,g.iso2";
			$queryFields = "g.iso1,g.iso2";

			$queryCountry = "";
			if(is_array($item_data->iso)){
				$queryCountry = "$queryIso in(";
				$coma = "";
				foreach($item_data->iso as $c){
					$queryCountry .= $coma."'$c'";
					$coma = ",";
				}

				$queryCountry .= ")";
			}else{
				$queryCountry = "$queryIso='$item_data->iso'";
			}
			$queryCountry = "AND ($queryCountry or g.iso1='World')";
			$queryAgg = "sum(g.value)";
			$queryYears = "AND g.year between ".$item_data->year[0]." and ".$item_data->year[1]." ";

		}elseif($row->levels == "iso|year"){
			$queryIso = "iso";
			$queryGroup = "g.iso";
			$queryFields = "g.iso";
			$queryCountry = "";
			$queryAgg = "g.value";
			$queryYears = "AND g.year = ".$item_data->year[1]." ";
		}


		//if($user->status == "success"){
		$sql = "SELECT g.code,$queryFields,$queryAgg as value
				FROM $row->table g
				WHERE g.code='$item_data->code'
				$queryCountry
				$queryYears
				GROUP BY $queryGroup";

		if ($resultado = $conn->query($sql)) {
		    $response_array['status'] = 'success';
			$response_array['content'] = $resultado;
			// $response_array['data'] = array();

			while ($row = $resultado->fetch_object()){
		        $response_array['data'][] = $row;
		        
		    }

		    $datasource_query = "SELECT DISTINCT(source) as 'source' FROM GCI g WHERE g.code='$item_data->code'
				AND $queryCountry
				AND g.year between ".$item_data->year[0]." and ".$item_data->year[0];

			if ($resultado = $conn->query($datasource_query)) {
				$comma = "";

				while ($row = $resultado->fetch_object()){
					if($row->source != "Inferred" && $row->source != "Imputed"){
						$response_array['content']->datasource .= $comma.$row->source;
						$comma = ", ";
					}
			    }
			}
			$conn->close();

		}else{
			$response_array['content'] = "Error to get indicator";
		}
		//}else{
		//	$response_array['content'] = $user->error;
		//}
	}
}



print json_encode($response_array);


