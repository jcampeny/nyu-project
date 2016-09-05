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
?>
