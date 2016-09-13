<?php

require_once 'connections/connections.php';
require_once 'encrypt_ekd/encrypt_ekd.php';

class User {
	private $id;
	private $name; //name's user
	private $email; //email's user
	private $other; //other information from user (billing)
	private $url;
	private $api = 'wp-json/jwt-auth/v1/token';
	public $error;
	public $status;

	//nyu information
	private $role;
	private $newsletter;
	private $blocked;
	private $special;

	function __construct($userName, $userPass){

		$result = $this->log_user($userName, $userPass);

		if ($result === FALSE) {
			$this->status = "error";
			$this->error = "User or password not valid";
		}else{
			$this->status = "success";
			$this->_set(json_decode($result));
		}
	}

	/**********
	**SETTERS**
	**********/
	private function _set($result){
		$this->name = $result->user_display_name;
		$this->email = $result->user_email;
		$this->other = $this->get_from_woo();
		$this->get_from_nyu();
	}

	/**********
	**GETTERS**
	**********/
	/*
	-- Obtiene la información del usuario --
	InPut   : 
	Return  : user{ billing... }
	*/ 
	private function get_from_woo(){
		require 'controller.php';
		$customers = $woocommerce->get('customers');

		$actualCustomer = null;
		foreach ($customers as &$customer) {
		    
		    if( $this->name  == $customer["username"] && $this->email == $customer["email"]){
		        $actualCustomer = $customer;
		        break;
		    }
		}	
		return $actualCustomer;
	}
	/*
	-- Obtiene la información de usuario para NYU --
	InPut   : 
	Return  : array{username, email, role, newsletter, blocked}
	*/ 
	private function get_from_nyu(){
		require_once 'db-connection.php';
		$conn = getConnection();
		$rows = null;
		$sql = "SELECT * FROM nyu_user WHERE name = '$this->name' AND email = '$this->email'";
		if ($resultado = $conn->query($sql)) {
		    while($row = $resultado->fetch_array(MYSQLI_ASSOC)){
				$this->id         = $row['id'];
				$this->role       = $row['role'];
				$this->newsletter = $row['newsletter'];
				$this->blocked    = $row['blocked'];
				$this->special    = $row['special'];
		    	$rows = $row;
			}
			$resultado->close();
		}
		return $rows;
	}

	public function _get(){
		return array(
			'name' => $this->name, 
			'email' => $this->email,
			'other' => $this->other
			);
	}
	public function get_id(){//return int
		return $this->id;
	} 
	//cuando haga el get_rol verifique el último purchase del y checkee la caducidad (a menos que sea special)
	public function get_role(){//return int
		
		if($this->special == 0){
			$last_purchase = $this->get_last_purchase();
			//getproduct ($last_purchase['id'])
			//(last_purchase.date + product.cylce_type (in ms)) < actualData --=> IS ACTIVE
		}

		return $last_purchase;
		//return $this->role;
	}
	public function get_newsletter(){
		return $this->newsletter;
	}
	public function get_blocked(){
		return $this->blocked;
	}
	//check
	public function check_permission($role){
		$actual_role = $this->get_role();
		return ($actual_role >= $role);
	}

	/***********
	***METHODS***
	**************/
	private function log_user($userName, $userPass){
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
		return @file_get_contents($this->url.$this->api, false, $context);
	}

	private function get_last_purchase(){
		require_once 'db-connection.php';
		$conn = getConnection();
		$rows = null;
		$sql = "SELECT * FROM nyu_purchase WHERE id_user = '$this->id'";
		if ($resultado = $conn->query($sql)) {
		    while($row = $resultado->fetch_array(MYSQLI_ASSOC)){

		    	if($rows != null){
		    	//state == completed
		    		$saved_row_date = strtotime($rows['purchase_date']);
		    		$actual_row_date = strtotime($row['purchase_date']);
		    		if($saved_row_date < $actual_row_date){
		    			$rows = $row;
		    		}
		    	}else{
		    		$rows = $row;		    		
		    	}
			}
			$resultado->close();
		}
		return $rows;
	}
}
