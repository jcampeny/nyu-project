<?php
require __DIR__ . '/vendor/autoload.php';

use Automattic\WooCommerce\Client;

$woocommerce = new Client(
    'http://nyu.com/wordpress/', 
    'ck_eb821bfb21a78f231c1f19c5e996c977c98f06c1', 
    'cs_49fee84e1eeb65f6c67eccea76bcd02b4fed3e37',
    [
        'wp_api' => true,
        'version' => 'wc/v1'
    ]
);

//print_r($woocommerce->get('products'));
//print json_encode($woocommerce->get('products'));
