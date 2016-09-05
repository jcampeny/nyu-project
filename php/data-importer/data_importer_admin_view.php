<?php

init();
function init(){
	if ( isset($_POST["submit"]) ) {
		require_once('post_file.php');
		require_once('post_metadata.php');
	}else{
		include ('templates/form.php');
	}
	include ('csv_display.php');
	include ('templates/css_js_importer.php');
}

?>
