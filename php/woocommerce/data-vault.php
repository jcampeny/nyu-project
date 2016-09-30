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
if ($conn->connect_error) {
	$response_array['content'] = "Connection failed: " . $conn->connect_error;
    die("Connection failed: " . $conn->connect_error);
    print json_encode($response_array)
}



$user = new User($user_data->name, $user_data->pass);
$user_role = $user->get_role();

$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

$role_minimum = 0

if($user->status == "success"){
	if($user_role >= $role_minimum){

		$sql = "SELECT * FROM GCI 
				WHERE code=$item_data->code 
				AND iso1 = $item_data->iso 
				AND year=$item_data->year";

		if ($resultado = $conn->query($sql)) {
		    $response_array['status'] = 'success';
			$response_array['content'] = $resultado;
			$conn->close();
		}else{
			$response_array['content'] = "Not saved";
		}
	}else{
		$response_array['content'] = "Role not valid";
	}
}else{
	$response_array['content'] = $user->error;
}

print json_encode($response_array);


