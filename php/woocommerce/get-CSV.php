<?php
require 'controller.php';
require 'validate-user.php';
require 'db-connection.php';

//CREATE TABLE csv_data ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, csv TEXT )

$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$user = new User($user_data->name, $user_data->pass);
$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

if($user->status == "success"){
	if($user_data->name && $user_data->email){
		$sql = "SELECT id, csv, title FROM csv_data WHERE csv_data.name = '$user_data->name' AND csv_data.email = '$user_data->email'";
		if ($resultado = $conn->query($sql)) {
		    $response_array['status'] = 'success';
		    while($row = $resultado->fetch_array(MYSQLI_ASSOC)){
		    	$rows[] = $row;
			}
			$response_array['content'] = $rows;
			$resultado->close();
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



