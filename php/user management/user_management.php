<?php
/**
 * @package user-management
 * @version 1.0
 */
/*
Plugin Name: NYU Users
Plugin URI: 
Description:
Author: ElkanoData
Version: 1.0
Author URI: http://elkanodata.com/
*/

function user_management_admin(){
	include('user_management_admin_view.php');

}
 
function user_management() {
 	add_menu_page("User management", "User management", 2, "User management", "user_management_admin", 'dashicons-groups');
}

add_action('admin_menu', 'user_management');
require_once('ajax_calls_users.php');


?>
