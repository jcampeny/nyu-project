<?php
require 'controller.php';
include 'validate-user.php';
include 'db-connection.php';

//CREATE TABLE csv_data ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, csv TEXT )

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$csv_data = $request->csv_id;

$user = new User($user_data->name, $user_data->pass);
$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

if($user->status == "success"){//
	if($csv_data && $csv_data != ''){
		$sql = "DELETE FROM csv_data WHERE id = '$csv_data' AND name = '$user_data->name' AND email = '$user_data->email'";
		if ($resultado = $conn->query($sql)) {
		    $response_array['status'] = 'success';
			$response_array['content'] = 'Deleted';
			print json_encode($response_array);
		}else{
			$response_array['content'] = "Can't be deleted";
			print json_encode($response_array);
		}
	}else{
		$response_array['content'] = "csv not set";
		print json_encode($response_array);
	}
}else{
	$response_array['content'] = $user->error;
	print json_encode($response_array);
}



