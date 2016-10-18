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

$queryCountry = "";
if(is_array($item_data->iso)){
	$queryCountry = "iso1 in(";
	$coma = "";
	foreach($item_data->iso as $c){
		$queryCountry .= $coma."'$c'";
		$coma = ",";
	}

	$queryCountry .= ")";
}else{
	$queryCountry = "iso1='$item_data->iso'";
}

// $conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

$role_minimum = 1;

$sql = "SELECT ulevel
FROM Metadata
WHERE code = '$item_data->code'";

if($resultado = $conn->query($sql)){	
	$role_minimum = $resultado->fetch_object()->ulevel;
	if($role_minimum > $user_role){
		$response_array['status'] = 'error';
		$response_array['content'] = 'role-not-valid';
		$response_array['data'] = '';		
	}else{
		//if($user->status == "success"){
			$sql = "SELECT g.code,g.iso1,g.iso2,sum(g.value) as value, m.ulevel
					FROM GCI g
					RIGHT JOIN Metadata m 
		        	ON m.code = g.code
					WHERE g.code='$item_data->code'
					AND ($queryCountry or g.iso1='World')
					AND g.year between ".$item_data->year[0]." and ".$item_data->year[0]."
					GROUP BY g.iso1,g.iso2";

			if ($resultado = $conn->query($sql)) {
			    $response_array['status'] = 'success';
				$response_array['content'] = $resultado;
				// $response_array['data'] = array();

				while ($row = $resultado->fetch_object()){
			        $response_array['data'][] = $row;
			        
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


