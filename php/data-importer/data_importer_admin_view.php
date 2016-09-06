<?php

init();
function init(){
	if ( isset($_POST["submit"]) ) {
		include_once('post_file.php');
		
	}else{
		include ('templates/form.php');
	}
	include ('csv_display.php');
	include ('templates/css_js_importer.php');
}

?>
