<?php
/**
 * @package Gap-Survey
 * @version 1.0
 */
/*
Plugin Name: Gap-Survey
Plugin URI: 
Description:
Author: ElkanoData
Version: 1.0
Author URI: http://elkanodata.com/
*/

function gap_admin() {
    include('gap_admin_view.php');
}
 
function gap_survey() {
 	add_options_page("Gap Survey", "Gap Survey", 1, "Gap Survey", "gap_admin");
}

add_action('admin_menu', 'gap_survey');
?>
