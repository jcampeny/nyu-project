<?php
/**
 * @package Data-importer
 * @version 1.0
 */
/*
Plugin Name: Data Importer
Plugin URI: 
Description:
Author: ElkanoData
Version: 1.0
Author URI: http://elkanodata.com/
*/

function data_importer_admin(){
	include('data_importer_admin_view.php');
}
 
function data_importer() {
 	add_options_page("Data Importer", "Data Importer", 1, "Data Importer", "data_importer_admin");
}

add_action('admin_menu', 'data_importer');






function test_ajax_load_scripts() {
	// load our jquery file that sends the $.post request
	wp_enqueue_script( "form-edit", plugin_dir_url( __FILE__ ) . '/form-edit.js', array( 'jquery' ) );
 
	// make the ajaxurl var available to the above script
	wp_localize_script( 'form-edit', 'the_ajax_script', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );	
}
add_action('wp_print_scripts', 'test_ajax_load_scripts');


function text_ajax_process_request() {
	global $wpdb;

	$table = 'data_importer';

	$post_data = array(
	    'name'         => $_POST['name'],
	    'ulvl'         => $_POST['ulvl'],
	    'confidential' => ($_POST['confidential']) ? 1 : 0,
	    'source'       => $_POST['source'],
	    'notes'        => $_POST['notes'],
	    'unit'         => $_POST['unit'],
	    'the_date'     => $_POST['the_date'],
	    'inotes'       => $_POST['inotes'],
	    'levels'       => $_POST['levels'],
	    'availability' => $_POST['availability'],
	    'datafile'     => $_POST['datafile'],
	    'varname'      => $_POST['varname']   
	);

	$where = array( 'ID' => $_POST['id'] );
	$myrows = $wpdb->update( $table, $post_data, $where);
	 
	echo $myrows;
	wp_die();
}
add_action('wp_ajax_test_response', 'text_ajax_process_request');


function delete_ajax_process_request() {
	global $wpdb;
	$table = 'data_importer';
	$where = array( 'ID' => $_POST['id'] );
	$url_array = explode('|', $_POST['path']);
	
	$url = 'upload';
	foreach ($url_array as $url_key => $url_item) {
		$url .= '/'.$url_item;
	}

	$old = getcwd(); 
	chdir($_SERVER['DOCUMENT_ROOT'].'/wordpress/wp-content/plugins/data-importer/'.$url);
	unlink($_POST['filename']);
	chdir($old);  

	$wpdb->delete( $table , $where );

	echo 'deleted';
	wp_die();
}
add_action('wp_ajax_delete_response', 'delete_ajax_process_request');
?>
