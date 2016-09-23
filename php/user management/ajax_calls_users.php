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
	$table = 'nyu_user';
	$role_int = intval($_POST['role']);

	$user_data = array(
		'name'       => $_POST['name'],
		'email'      => $_POST['email'],
		'role'       => $_POST['role'],
		'special'    => ($role_int > 2) ? 1 : 0,
		'newsletter' => $_POST['newsletter'],
		'blocked'    => $_POST['blocked']  
	);

	$woo_data = [
		'email'      => $_POST['email'],
		'first_name' => $_POST['first_name'],
		'last_name'  => $_POST['last_name'],
		'username'   => $_POST['name'],
		'password'   => $_POST['password'],
	    'billing' => [
			'first_name' => $_POST['first_name'],
			'last_name'  => $_POST['last_name'],
			'company'    => $_POST['company'],
			'address_1'  => $_POST['address'],
			'address_2'  => $_POST['address'],
			'city'       => $_POST['city'],
			'state'      => $_POST['state'],
			'postcode'   => $_POST['postcode'],
			'country'    => $_POST['country'],
			'email'      => $_POST['email'],
			'phone'      => $_POST['phone']
	    ],
	    'shipping' => [
			'first_name' => $_POST['first_name'],
			'last_name'  => $_POST['last_name'],
			'company'    => $_POST['company'],
			'address_1'  => $_POST['address'],
			'address_2'  => $_POST['address'],
			'city'       => $_POST['city'],
			'state'      => $_POST['state'],
			'postcode'   => $_POST['postcode'],
			'country'    => $_POST['country']
	    ]
	];

	$response_array['status'] = 'success'; 

	try {
	    $response_array['content'] = $woocommerce->post('customers', $woo_data);
	    $wpdb->insert( $table, $user_data);
	} catch (Exception $e) {
	    $response_array['status'] = 'error'; 
	    $response_array['content'] = $e->getMessage();
	}

	print json_encode($response_array);
	wp_die();
}
add_action('wp_ajax_create_user', 'create_user_process_request');


//GET
function get_user_process_request() {//request
	require_once $_SERVER['DOCUMENT_ROOT'].'/php/woocommerce/controller.php';
	global $wpdb;
	$table = 'nyu_user';

	$users = $woocommerce->get('customers');
	$nyu_users = $wpdb->get_results( "SELECT * FROM nyu_user", ARRAY_A);
	$users_merch = array();

	foreach ($users as &$user) {
		foreach ($nyu_users as &$nyu_user) {
			if(($user['email'] == $nyu_user['email']) && ($user['username'] == $nyu_user['name'])){
				$user['nyu_user'] = $nyu_user;
	    		array_push($users_merch, $user);				
			}
		}

	}

	$response_array['status'] = 'success'; 
	$response_array['content'] = $users_merch;
	
	//print json_encode($response_array);
	echo json_encode($response_array);
	wp_die();
}
add_action('wp_ajax_get_user', 'get_user_process_request');

//UPDATE
function edit_user_process_request() {//request
	global $wpdb;
	$table = 'nyu_user';
	$where = array( 'ID' => $_POST['id'] );

	$post_data = array(
		'role'       => $_POST['role'],
		'special'    => $_POST['special'],
		'newsletter' => $_POST['newsletter'],
		'blocked'    => $_POST['blocked']  
	);

	echo $wpdb->update( $table, $post_data, $where);
	
	wp_die();
}
add_action('wp_ajax_edit_user', 'edit_user_process_request');

//DELETE
function delete_user_process_request() {//request
	require_once $_SERVER['DOCUMENT_ROOT'].'/php/woocommerce/controller.php';
	global $wpdb;
	$table = 'nyu_user';
	$id = $_POST['id'];
	$where = array( 'ID' => $_POST['id'] );

	$nyu_user = $wpdb->get_results( "SELECT * FROM $table WHERE id = $id", ARRAY_A)[0];
	$users = $woocommerce->get('customers');
	$woo_found = null;
	foreach ($users as &$user) {
		if(($user['email'] == $nyu_user['email']) && ($user['username'] == $nyu_user['name'])){
			$woo_found = $user;		
		}
	}

	$response_array['status'] = 'success'; 

	try {
	    $response_array['content'] = $woocommerce->delete('customers/'.$woo_found['id'], ['force' => true]);
	    $wpdb->delete( $table, $where);
	} catch (Exception $e) {
	    $response_array['status'] = 'error'; 
	    $response_array['content'] = $e->getMessage();
	}

	print json_encode($response_array);

	wp_die();
}
add_action('wp_ajax_delete_user', 'delete_user_process_request');
?>
