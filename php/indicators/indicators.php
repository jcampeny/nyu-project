<?php 
/**
 * @package Indicators
 * @version 1.0
 */
/*
Plugin Name: Indicators
Plugin URI:
Description:
Author: ElkanoData
Version: 1.0
Author: URI: http://elkanodata.com
*/

define( 'CD_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'CD_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

function indicators_admin (){
	include('indicators_admin_view.php');
}

function indicators (){
	add_menu_page('Indicators', 'Indicators', 1, 'Indicators', 'indicators_admin', 'dashicons-index-card');
}

add_action('admin_menu', 'indicators');
require_once('ajax_calls_indicators.php');
?>