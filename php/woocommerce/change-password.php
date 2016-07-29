<?php
require 'controller.php';

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user_data = $request->user;
$new_pass = $request->pass;

$customers = $woocommerce->get('customers');

$actualCustomer = null;
foreach ($customers as &$customer) {
    //
    if( $user_data->name  == $customer["username"] || $user_data->email == $customer["email"]){
        $actualCustomer = $customer;
        break;
    }
}
if($actualCustomer){
    $data = [
        'password' => $new_pass
    ];
    

    $subject = "Password change";
    $headers = "From: NYU web";
    $mail = $actualCustomer["email"];
    $message = 'The new password is : '.$new_pass;
    $response_array['status'] = 'success'; 
    
    if(mail($mail, $subject, $message, $headers)){
        try {
            $response_array['status'] = 'success';
            $response_array['content'] = $woocommerce->put('customers/'.$actualCustomer["id"], $data); 
        } catch (Exception $e) {
            $response_array['status'] = 'error'; 
            $response_array['content'] = $e->getMessage();
        }     
    }else{
        $response_array['status'] = 'error';
        $response_array['content'] = 'Correo no enviado';
    }
}else{
    $response_array['status'] = 'error';
    $response_array['content'] = 'Usuario no encontrado';
}

print json_encode($response_array);

