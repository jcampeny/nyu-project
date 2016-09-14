<?php
require 'controller.php';
include 'validate-user.php';
include 'db-connection.php';
require_once 'encrypt_ekd/encrypt_ekd.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$user_pass = encrypt_decrypt('encrypt', encrypt_decrypt('encrypt', $request->pass));

$user = new User($user_data->name, $user_pass);

$response_array['status'] = 'error';
$response_array['content'] = '';

if($user->status == "success"){//
	$response_array['status'] = "success";
	$response_array['content'] = $user_pass;
}else{
	$response_array['content'] = $user->error;
	
}


print json_encode($response_array);
