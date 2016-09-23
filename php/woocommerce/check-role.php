<?php
require_once 'controller.php';
include_once 'validate-user.php';
require_once 'constants/roles-permissions.php';

$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$user = new User($user_data->name, $user_data->pass);
$role_minimum = ROLES_PERMISSIONS[$user_data->reason];

$response_array['status'] = 'success'; 

if($user->status == "success"){
	if($user->check_permission($role_minimum)){ //this->rols >= role
		$response_array['content'] = true; //valid 
	}else{
		$response_array['content'] = false; //no valid
	}
}else{
	$response_array['status'] = 'error'; 
	$response_array['content'] = $user->error;
}

print json_encode($response_array);
//print json_encode($user->get_role());



