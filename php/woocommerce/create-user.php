<?php
require 'controller.php';
/*$data = [
    'email' => 'john4.doe@example.com',
    'first_name' => 'John',
    'last_name' => 'Doe',
    'username' => 'john.doe4',
    'billing' => [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'company' => '',
        'address_1' => '969 Market',
        'address_2' => '',
        'city' => 'San Francisco',
        'state' => 'CA',
        'postcode' => '94103',
        'country' => 'US',
        'email' => 'john.doe@example.com',
        'phone' => '(555) 555-5555'
    ],
    'shipping' => [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'company' => '',
        'address_1' => '969 Market',
        'address_2' => '',
        'city' => 'San Francisco',
        'state' => 'CA',
        'postcode' => '94103',
        'country' => 'US'
    ]
];*/
/*$data = [
    'password' => 'qwe'
];*/
//print_r($woocommerce->put('customers/2', $data));
//$woocommerce->post('customers', $data);

print json_encode($woocommerce->get('customers'));

