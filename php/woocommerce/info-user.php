<?php
require 'controller.php';
include 'validate-user.php';

$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$user = new User($user_data->name, $user_data->pass);

if($user->status == "success"){
	$customers = $woocommerce->get('customers');

	$actualCustomer;
	foreach ($customers as &$customer) {
	    
	    if( $user_data->name  == $customer["username"] && $user_data->email == $customer["email"]){
	        $actualCustomer = $customer;
	        break;
	    }
	}	
	print json_encode( $actualCustomer ) ;
}else{
	print $user->error;
}


//print json_encode($woocommerce->get('customers'));



