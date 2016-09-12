<?php
require 'controller.php';
include 'validate-user.php';
include 'db-connection.php';
require_once 'encrypt_ekd/encrypt_ekd.php';

$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);
$user_pass = encrypt_decrypt('encrypt', encrypt_decrypt('encrypt', $user_data->pass));

$user = new User($user_data->name, $user_pass);

$response_array['status'] = 'success';
$response_array['content'] = ''; 

if($user->status == "success"){
	$user->information = $user->_get();
	$user->information['pass'] = $user_pass;
	$response_array['content'] = $user->information;
}else{
	$response_array['status'] = 'error';
	$response_array['content'] = $user->error; 
}

print json_encode($response_array);




