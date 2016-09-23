<?php
require 'controller.php';
require 'db-connection.php';
require_once 'encrypt_ekd/encrypt_ekd.php';
require_once 'validate-user.php';

$postdata = file_get_contents("php://input");
$updated_User = json_decode($postdata);
$new_information = $updated_User->new_info;

$user = new User($updated_User->name, $updated_User->pass);
$newsletter = ($updated_User->new_info->newsletter) ? 1 : 0;
$user_id = $user->get_id();

$conn = getConnection();
$sql = "UPDATE nyu_user
        SET newsletter = '$newsletter', email = '$new_information->email'
        WHERE id = $user_id";

$data = [
    'email' => $new_information->email,
    'first_name' => $new_information->first_name,
    'last_name' => $new_information->last_name,
    'billing' => [
        'first_name' => $new_information->first_name,
        'last_name'  => $new_information->last_name,
        'company'    => $new_information->company ,
        'address_1'  => $new_information->address_1 ,
        'address_2'  => $new_information->address_2 ,
        'city'       => $new_information->city ,
        'state'      => $new_information->state ,
        'postcode'   => $new_information->postcode ,
        'country'    => $new_information->country ,
        'email'      => $new_information->email,
        'phone'      => $new_information->phone 
    ]
];

$response_array['status'] = 'success'; 

try {
    $temporal_array['user'] = $woocommerce->put('customers/' . $user->id_woo, $data);
    $temporal_array['user']['newsletter'] = $updated_User->new_info->newsletter;
    $response_array['content'] = $temporal_array;
    $conn->query($sql);
    $conn->close();
    //$response_array['content'] = $conn->query($sql);
} catch (Exception $e) {
    $response_array['status'] = 'error'; 
    $response_array['content'] = $e->getMessage();
}

//print json_encode($newsletter);
print json_encode($response_array);
