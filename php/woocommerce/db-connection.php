<?php
require_once 'connections/connections.php';

function getConnection(){

	//get connections information
	$connection_information = new ConnectionController();
	
	// Create connection
	$conn = new mysqli(
		$connection_information->servername, 
		$connection_information->username, 
		$connection_information->password, 
		$connection_information->dbname
	);

	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	    return $conn->connect_error;
	}else{
		return $conn;
	}		
}

