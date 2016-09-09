<?php
/**
 * @package user-subscriptions
 * @version 1.0
 */
/*
Plugin Name: Subscriptions
Plugin URI: 
Description:
Author: ElkanoData
Version: 1.0
Author URI: http://elkanodata.com/
*/

function user_subscriptions_admin(){
	include('user_subscriptions_admin_view.php');

}
 
function user_subscriptions() {
 	add_menu_page("Subscriptions", "Subscriptions", 1, "Subscriptions", "user_subscriptions_admin", 'dashicons-groups');
}

add_action('admin_menu', 'user_subscriptions');

require_once('ajax_calls.php');

?>
