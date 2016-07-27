<?php
require 'controller.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$new_pass = $request->pass;

$customers = $woocommerce->get('customers');

$actualCustomer;
foreach ($customers as &$customer) {
    //
    if( $user_data->name  == $customer["username"] && $user_data->email == $customer["email"]){
        $actualCustomer = $customer;
        break;
    }
}
if($actualCustomer){
    $data = [
        'password' => $new_pass
    ];
    $woocommerce->put('customers/'.$actualCustomer["id"], $data);
    print "se ha mandado un email con la información de la nueva pass";
}



