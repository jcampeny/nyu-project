<?php 
/*AJAX CALLS FOR USER IMPORTER*/

function ajax_scripts_user_importer (){//import ajax file
	//load file
	wp_enqueue_script(
		'ajaxs-calls-user-importer', 
		plugin_dir_url( __FILE__ ) . '/templates/js/ajax-calls.js', array ( 'jquery'));

	//ajaxurl map
	wp_localize_script(
		'ajaxs-calls-user-importer', 
		'the_ajax_script', 
		array('ajaxurl' => admin_url('admin-ajax.php')));
}
add_action('wp_print_scripts', 'ajax_scripts_user_importer');

function hello_world_process_request (){
	echo 'hello world!';
	wp_die();
}
add_action('wp_ajax_hello_world', 'hello_world_process_request');
?>