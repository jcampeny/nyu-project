<?php
/*
AJAX CALLS
*/
function ajax_scripts(){//import ajax file
	//load file
	wp_enqueue_script( "ajax-calls", plugin_dir_url( __FILE__ ) . '/templates/js/ajax-calls.js', array( 'jquery' ) );

	//ajaxurl
	wp_localize_script( 'ajax-calls', 'the_ajax_script', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}
add_action('wp_print_scripts', 'ajax_scripts');

//INSERT
function create_product_process_request() {//request
	global $wpdb;
	$table = 'nyu_product';

	$post_data = array(
		'name'           => $_POST['name'],
		'description'    => $_POST['description'],
		'type_cycle'     => $_POST['type_cycle'],
		'cost_cycle_USD' => $_POST['cost_cycle_USD'],
		'cost_cycle_EUR' => $_POST['cost_cycle_EUR'],
		'student'        => $_POST['student']  
	);

	echo $wpdb->insert( $table, $post_data); 

	wp_die();
}
add_action('wp_ajax_create_product', 'create_product_process_request');

//SELECT
function select_product_process_request() {//request
	global $wpdb;

	echo json_encode($wpdb->get_results( "SELECT * FROM nyu_product", ARRAY_A));

	wp_die();
}
add_action('wp_ajax_select_product', 'select_product_process_request');

//SELECT
function delete_product_process_request() {//request
	global $wpdb;
	$table = 'nyu_product';
	$where = array( 'ID' => $_POST['id'] );

	echo $wpdb->delete( $table , $where );
	
	wp_die();
}
add_action('wp_ajax_delete_product', 'delete_product_process_request');

?>
