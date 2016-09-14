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
	public $id_woo;

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
		    	$this->id_woo = $customer["id"];
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
			$conn->close();
		}
		return $rows;
	}

	public function _get(){
		return array(
			'name' => $this->name, 
			'email' => $this->email,
			'other' => $this->other,
			'newsletter' => (($this->newsletter == 1) ? true : false)
			);
	}
	public function get_id(){//return int
		return $this->id;
	} 
	//cuando haga el get_rol verifique el último purchase del y checkee la caducidad (a menos que sea special)
	public function get_role(){//return int
		
		if($this->special == 0){
			$last_purchase = $this->get_last_purchase();

			$last_purchase_date = strtotime($last_purchase['purchase_date']);
			$actual_date        = strtotime(date('Y-m-d'));
			$cycle_type         = $last_purchase['type_cycle'];

			$day_in_ms = 24 * 60 * 60 * 1000;

			switch ($last_purchase['type_cycle']) {
				case 'D':
					$cycle_type = $day_in_ms;
					break;
				case 'W':
					$cycle_type = 7 * $day_in_ms;
					break;
				case 'M':
					$cycle_type = 31 * $day_in_ms;
					break;
				case 'Y':
					$cycle_type = 365 * $day_in_ms;
					break;
			}

			$have_active_subscription = ($last_purchase_date + $cycle_type) > $actual_date;

			$new_role = ($have_active_subscription) ? 3 : 2;

			if($new_role != $this->role)
				if($this->update_role($new_role))
					$this->role = $new_role; 
			
		}

		return $this->role;
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
		$sql = "SELECT purchase.purchase_date, product.type_cycle 
				FROM nyu_purchase as purchase, nyu_product as product 
				WHERE purchase.id_user = $this->id
				AND purchase.state = 'Completed'
				AND purchase.id_product = product.id
				ORDER BY purchase.purchase_date DESC";

		if ($resultado = $conn->query($sql)) {
			$rows = $resultado->fetch_array(MYSQLI_ASSOC);
			$conn->close();
		}
		return $rows;
	}

	private function update_role($new_role){
		require_once 'db-connection.php';
		$conn = getConnection();
		$sql = "UPDATE nyu_user
				SET role = $new_role
				WHERE id = $this->id";

		$resultado = $conn->query($sql);
		$conn->close();

		return $resultado;
	}
}
