<?php
require 'controller.php';

$postdata = file_get_contents("php://input");
$newUser = json_decode($postdata);

$data = [
    'email' => $newUser->email,
    'first_name' => $newUser->first,
    'last_name' => $newUser->last,
    'username' => $newUser->name,
    'password' => $newUser->pass,
    'billing' => [
        'first_name' => $newUser->first,
        'last_name' => $newUser->last,
        'company' => (property_exists($newUser, 'company') ? $newUser->company : ''),
        'address_1' => (property_exists($newUser, 'address') ? $newUser->address : ''),
        'address_2' => '',
        'city' => (property_exists($newUser, 'city') ? $newUser->city : ''),
        'state' => (property_exists($newUser, 'state')  ? $newUser->state : ''),
        'postcode' => (property_exists($newUser, 'postcode')  ? $newUser->postcode : ''),
        'country' => (property_exists($newUser, 'country')  ? $newUser->country : ''),
        'email' => $newUser->email,
        'phone' => (property_exists($newUser, 'phone')  ? $newUser->phone : '')
    ],
    'shipping' => [
        'first_name' => $newUser->first,
        'last_name' => $newUser->last,
        'company' => (property_exists($newUser, 'company')  ? $newUser->company : ''),
        'address_1' => (property_exists($newUser, 'address')  ? $newUser->address : ''),
        'address_2' => '',
        'city' => (property_exists($newUser, 'city') ? $newUser->city : ''),
        'state' => (property_exists($newUser, 'state')  ? $newUser->state : ''),
        'postcode' => (property_exists($newUser, 'postcode')  ? $newUser->postcode : ''),
        'country' => (property_exists($newUser, 'country')  ? $newUser->country : '')
    ]
];

$response_array['status'] = 'success'; 

try {
    $response_array['content'] = $woocommerce->post('customers', $data);
} catch (Exception $e) {
    $response_array['status'] = 'error'; 
    $response_array['content'] = $e->getMessage();
}

print json_encode($response_array);
