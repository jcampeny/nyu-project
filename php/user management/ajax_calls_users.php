<?php
/*
AJAX CALLS
*/
function ajax_scripts_users(){//import ajax file
	//load file
	wp_enqueue_script( "ajax-calls-users", plugin_dir_url( __FILE__ ) . '/templates/js/ajax-calls.js', array( 'jquery' ) );

	//ajaxurl
	wp_localize_script( 'ajax-calls-users', 'the_ajax_script', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}
add_action('wp_print_scripts', 'ajax_scripts_users');

//INSERT
function create_user_process_request() {//request
	require_once $_SERVER['DOCUMENT_ROOT'].'/php/woocommerce/controller.php';
	global $wpdb;
	$table = 'nyu_product';

	$user_data = array(
		'name'       => $_POST['name'],
		'email'      => $_POST['email'],
		'role'       => $_POST['role'],
		'special'    => 0,
		'newsletter' => $_POST['newsletter'] 
	);

	$woo_data = [
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

	//echo $wpdb->insert( $table, $post_data); 
	print_r($woocommerce->get('customers'));
	wp_die();
}
add_action('wp_ajax_create_user', 'create_user_process_request');


?>
