<?php
require_once 'connections/connections.php';
require_once 'db-connection.php';
require_once 'validate-user.php';
require_once 'controller.php';
require_once 'encrypt_ekd/encrypt_ekd.php';


/*******************
****POST SETUP*****
*******************/
$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$product = $woocommerce->get('products')[0];
$data = array(
	'action' => "https://www.sandbox.paypal.com/cgi-bin/webscr",
	'general' => array(
        "cmd" => "_cart",
        "upload" => "1",
        "business" => "business@nyu.com",
        "shopping_url" => "http://52.32.163.154/",
        "currency_code" => "EUR",
        "return" => "http://52.32.163.154/",
        "notify_url" => "http://52.32.163.154/php/woocommerce/ipn.php",
        "rm" => "2",//1-GET 2-POST  
    ), 
	'product' => array(
		"item_number" => '',
		"item_number_1" => '',
		"item_name_1" => '',
		"amount_1" => '',
		"quantity_1" => "1",
		"custom" => "",
		//paypal
		"currency_code" => "USD",
		"src" => (($user_data->sub_renew) ? 1 : 0), //(0 = solo 1 pago || 1 = infinitos hasta cancelar)
		"a3" => "", //Regular subscription price.
		"p3" => "1", //Subscription duration. 
		"t3" => "ADS", //Regular subscription units of duration. 
	)
);


/*******************
****USER VALIDATE***
*******************/

$user = new User($user_data->name, $user_data->pass);
$subscription = getSub($user_data->sub_id);

$response_array['status'] = 'error';
$response_array['content'] = '';

if($subscription == FALSE) {
	$response_array['status'] = 'error';
	$response_array['content'] = 'This subscription does not exist';
	echo json_encode($response_array);
}

if($user->status == "success"){
	if($user->get_role() < 3){
		if($purchase_id = createPurchase($user->get_id(), $subscription['id'])){

			$data['product']["item_number"]   = $subscription['name'];
			$data['product']["item_number_1"] = $subscription['id'];
			$data['product']["item_name_1"]   = $subscription['name'];
			$data['product']["amount_1"]      = $subscription['cost_cycle_USD'];
			$data["product"]["custom"]        = $purchase_id;
			$data['product']['a3']            = $subscription['cost_cycle_USD'];
			$data['product']['t3']            = $subscription['type_cycle'];

			foreach ($data["general"] as $key => $value) {
				$post_items[] = $key . '=' . $value;
			}
			foreach ($data["product"] as $key => $value) {
				$post_items[] = $key . '=' . $value;
			}

			$response_array['status'] = "success";
			$response_array['content'] = $data["action"] . '?'. implode ('&', $post_items);


		}else{
			$response_array['content'] = 'Your subscription could not be processed';
		}
	}else{
		$response_array['content'] = 'You are already a premium user';
	}
}else{
	$response_array['content'] = 'You has not logged in';
}

print json_encode($response_array);


function getSub($id){
	$conn = getConnection();
	$sql = "SELECT * FROM nyu_product WHERE id = $id";

	if ($resultado = $conn->query($sql)) {
	    $rows = array();
	    while($row = $resultado->fetch_array(MYSQLI_ASSOC)){
	    	$rows[] = $row;
		}
		$conn->close();
		return $rows[0];
	}else{
		return FALSE;
	}
}

function createPurchase ($id_user, $id_product, $state = 'pending', $paypal_request = "", $purchase_date = "", $total_cycle = 0) {
	$purchase_date = date("Y-m-d");
	$id_user       = intval($id_user);
	$id_product    = intval($id_product);

	$conn = getConnection();
	$sql = "INSERT INTO nyu_purchase (id, id_user, id_product, state, paypal_request, purchase_date, total_cycle) 
	        VALUES (NULL, '$id_user', '$id_product', '$state', '$paypal_request', '$purchase_date', '$total_cycle')";
	
	if($resultado = $conn->query($sql)){
		return $conn->insert_id;
	}else{
		return $resultado;
	}

}/*
	private $id;
	private $id_user;
	private $id_product;
	private $state;
	private $paypal_request;
	private $purchase_date;
	private $total_cycle; //useless */

