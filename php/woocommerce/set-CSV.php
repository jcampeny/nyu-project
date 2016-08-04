<?php
require 'controller.php';
require 'validate-user.php';
require 'db-connection.php';

//CREATE TABLE csv_data ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, csv TEXT )

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$csv_data = $request->csv;

if(property_exists($request, 'other')){
	$other_data = $request->other;	
}else{
	$other_data = null;
}


$user = new User($user_data->name, $user_data->pass);
$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

$d =  date("Y-m-d H:i:s"); 
$date = date($d);

if($user->status == "success"){
	if($csv_data->content && $csv_data->content != ''){
		if($other_data){
			$sql = "INSERT INTO csv_data (id, name, email, csv, title, actualdate) VALUES (NULL, '$user_data->name', '$user_data->email', '$csv_data->content', '$other_data->title', '$date')";
		}else{
			$sql = "INSERT INTO csv_data (id, name, email, csv, actualdate) VALUES (NULL, '$user_data->name', '$user_data->email', '$csv_data->content', '$date')";
		}

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



