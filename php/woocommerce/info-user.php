<?php
require 'controller.php';

$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$customers = $woocommerce->get('customers');

$actualCustomer;
foreach ($customers as &$customer) {
    //
    if( $user_data->name  == $customer["username"] && $user_data->email == $customer["email"]){
        $actualCustomer = $customer;
        break;
    }
}

//print json_encode($woocommerce->get('customers'));
print json_encode( $actualCustomer ) ;


