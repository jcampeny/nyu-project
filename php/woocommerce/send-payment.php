<?php
require_once 'connections/connections.php';
require 'validate-user.php';
require_once 'encrypt_ekd/encrypt_ekd.php';

/*******************
****POST SETUP*****
*******************/
$data = array(
	'action' => "https://www.sandbox.paypal.com/cgi-bin/webscr",
	'general' => array(
        "cmd" => "_cart",
        "upload" => "1",
        "business" => "jordicampeny13@hotmail.com",
        "shopping_url" => "http://test-nyu.elkanodata.com/",
        "currency_code" => "EUR",
        "return" => "http://nyu.com/",
        "notify_url" => "http://test-nyu.elkanodata.com/php/woocommerce/ipn.php",
        "rm" => "2",//1-GET 2-POST  
    ), 
	'product' => array(
		"item_number" => "PREMIUM",
		"item_number_1" => "PREMIUM2",
		"item_name_1" => "PREMIUM",
		"amount_1" => "10.00",
		"quantity_1" => "1",
		"custom" => "encodedePHP" 
	)
);



/*******************
****USER VALIDATE***
*******************/
$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$user = new User($user_data->name, $user_data->pass);

$response_array['status'] = 'error';
$response_array['content'] = '';


if($user->status == "success"){

	$plain_txt = $user_data->name."-ekd-".$user_data->pass;
	
	//$encrypt = encrypt_decrypt('encrypt', encrypt_decrypt('encrypt', $plain_txt));
	//$decrypt = encrypt_decrypt('decrypt', encrypt_decrypt('decrypt', $encrypt));

	$data["product"]["custom"] = encrypt_decrypt('encrypt', encrypt_decrypt('encrypt', $plain_txt));

	foreach ($data["general"] as $key => $value) {
		$post_items[] = $key . '=' . $value;
	}
	foreach ($data["product"] as $key => $value) {
		$post_items[] = $key . '=' . $value;
	}

	$post_string = '?'. implode ('&', $post_items);

	$response_array['status'] = "success";
	$response_array['content'] = $data["action"].$post_string;

}else{
	$response_array['content'] = 'not logged';
}

print json_encode($response_array);