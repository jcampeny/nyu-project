<?php
require 'controller.php';
include 'validate-user.php';
include 'db-connection.php';

//CREATE TABLE csv_data ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, csv TEXT )

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$csv_data = $request->csv;

$user = new User($user_data->name, $user_data->pass);
$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

if($user->status == "success"){
	if($csv_data->content && $csv_data->content != ''){
		$sql = "INSERT INTO csv_data (id, name, email, csv) VALUES (NULL, '$user_data->name', '$user_data->email', '$csv_data->content')";
		if ($resultado = $conn->query($sql)) {
		    $response_array['status'] = 'success';
			$response_array['content'] = 'Saved';
			print json_encode($response_array);
		}else{
			$response_array['content'] = "Not saved";
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



