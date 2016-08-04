<?php
require_once 'connections/connections.php';
require __DIR__ . '/vendor/autoload.php';

use Automattic\WooCommerce\Client;

$connection_information = new ConnectionController();

$woocommerce = new Client(
    $connection_information->url, 
    $connection_information->ck, 
    $connection_information->cs,
    [
        'wp_api' => true,
        'version' => 'wc/v1'
    ]
);

//print_r($woocommerce->get('products'));
//print json_encode($woocommerce->get('products'));
