<?php 
/*AJAX CALLS FOR INDICATORS*/

function ajax_scripts_indicators (){//import ajax file
	//load file
	wp_enqueue_script(
		'ajaxs-calls-indicators', 
		plugin_dir_url( __FILE__ ) . '/templates/js/ajax-calls.js', array ( 'jquery'));

	//ajaxurl map
	wp_localize_script(
		'ajaxs-calls-indicators', 
		'the_ajax_script', 
		array('ajaxurl' => admin_url('admin-ajax.php')));
}
add_action('wp_print_scripts', 'ajax_scripts_indicators');

function get_indicators_process_request (){
	// Create connection
	$conn = new mysqli(
		'nyu-general.c5opksnh3gku.us-west-2.rds.amazonaws.com', 
		'nyunewweb', 
		'k1zCbksPR1cHhxOs%L', 
		'datavault'
	);

	// Check connection
	if ($conn->connect_error !== NULL) {
	    die("Connection failed: " . $conn->connect_error);
	    print "Connection failed: " . $conn->connect_error;
	}

	$sql = "SELECT id, ulevel, name, code
			FROM Metadata";

	if ($resultado = $conn->query($sql)) {
		$response_array['content'] = $resultado;

		while ($row = $resultado->fetch_object()){
	        $response_array['data'][] = $row;
	    }
		$conn->close();
	}

	print json_encode($response_array);
	wp_die();
}
add_action('wp_ajax_get_indicators', 'get_indicators_process_request');

function save_indicator_process_request (){
	// Create connection
	$conn = new mysqli(
		'nyu-general.c5opksnh3gku.us-west-2.rds.amazonaws.com', 
		'nyunewweb', 
		'k1zCbksPR1cHhxOs%L', 
		'datavault'
	);

	// Check connection
	if ($conn->connect_error !== NULL) {
	    die("Connection failed: " . $conn->connect_error);
	    print "Connection failed: " . $conn->connect_error;
	}

	$sql = "UPDATE Metadata SET ulevel = ".$_POST['role']." WHERE id=".$_POST['id']."";
	$conn->query($sql);

	print 'success';
	wp_die();
}
add_action('wp_ajax_save_indicator', 'save_indicator_process_request');
?>