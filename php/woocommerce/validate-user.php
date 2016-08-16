<?php

require_once 'connections/connections.php';
require_once 'encrypt_ekd/encrypt_ekd.php';

class User {
	private $name; //name's user
	private $email; //email's user
	private $url;
	private $api = 'wp-json/jwt-auth/v1/token';
	public $error;
	public $status;

	function __construct($userName, $userPass){

		$connection_information = new ConnectionController();
		$this->url = $connection_information->url;

		$data = array(
			'username' => $userName, 
			'password' => encrypt_decrypt('decrypt', encrypt_decrypt('decrypt', $userPass))
			);

		$options = array(
		    'http' => array(
		        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
		        'method'  => 'POST',
		        'content' => http_build_query($data)
		    )
		);
		$context  = stream_context_create($options);
		$result = @file_get_contents($this->url.$this->api, false, $context);
		if ($result === FALSE) {
			$this->status = "error";
			$this->error = "User or password not valid";
		}else{
			$this->status = "success";

			$result_decoded = json_decode($result);
			$this->name = $result_decoded->user_display_name;
			$this->email = $result_decoded->user_email;
			
		}
	}

}
