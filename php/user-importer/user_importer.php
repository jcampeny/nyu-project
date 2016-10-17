<?php 
/**
 * @package user-importer
 * @version 1.0
 */
/*
Plugin Name: User Importer
Plugin URI:
Description:
Author: ElkanoData
Version: 1.0
Author: URI: http://elkanodata.com
*/

define( 'CD_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'CD_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

function user_importer_admin (){
	include('user_importer_admin_view.php');
}

function user_importer (){
	add_menu_page('User Importer', 'User Importer', 1, 'User Importer', 'user_importer_admin', 'dashicons-upload');
}

add_action('admin_menu', 'user_importer');
require_once('ajax_calls_user_importer.php');
?>