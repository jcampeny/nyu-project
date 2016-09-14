<?php
require 'controller.php';
require 'db-connection.php';

//CREATE TABLE csv_data ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL, csv TEXT )

$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';



$sql = "SELECT * FROM nyu_product";
if ($resultado = $conn->query($sql)) {
    $response_array['status'] = 'success';
    $rows = array();
    while($row = $resultado->fetch_array(MYSQLI_ASSOC)){
    	array_push($rows, $row);
	}
	$response_array['content'] = $rows;
	$conn->close();
	print json_encode($response_array);
}else{
	$response_array['content'] = "Not saved";
	print json_encode($response_array);
}




