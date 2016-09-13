<?php
require 'controller.php';
require 'db-connection.php';
require_once 'encrypt_ekd/encrypt_ekd.php';

$postdata = file_get_contents("php://input");
$newUser = json_decode($postdata);
$newUser->newsletter = ($newUser->newsletter) ? 1 : 0;

$conn = getConnection();
$sql = "INSERT INTO nyu_user (id, name, email, role, special, newsletter, blocked) 
        VALUES (NULL, '$newUser->name', '$newUser->email', 2, 0, '$newUser->newsletter', 0)";

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
    $temporal_array['user'] = $woocommerce->post('customers', $data);
    $resultado = $conn->query($sql);
    $temporal_array['pass'] = encrypt_decrypt('encrypt', encrypt_decrypt('encrypt', $newUser->pass));
    $response_array['content'] = $temporal_array;
} catch (Exception $e) {
    $response_array['status'] = 'error'; 
    $response_array['content'] = $e->getMessage();
}

print json_encode($response_array);
