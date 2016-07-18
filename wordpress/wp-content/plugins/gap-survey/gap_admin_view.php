<?php

include ('JsonFile.php');

if (isset($_POST)) {
	if(count($_POST) != 0){
		
		/*foreach ($_POST as $key => $value){
			echo $value;
		}*/
		$json_file = new JsonFile('gap-average.json'); 
		$jsonArray = $json_file->get_json();
		$jsonArray["avgPankaj"] = $_POST;
		$json_file->set_json($jsonArray);
	}
}

init();

function init(){
	$file = new FilesystemIterator(__DIR__, FilesystemIterator::SKIP_DOTS);
	foreach ($file as $fileinfo) {
	 	$extension = end(explode('.', $fileinfo));
	 	if($extension === 'json' && $fileinfo->getFilename() == 'gap-average.json'){
	 		$average_json = new JsonFile($fileinfo->getFilename());
	 	}
	 	if($extension === 'json' && $fileinfo->getFilename() == 'gap-general.json'){
	 		$general_json = new JsonFile($fileinfo->getFilename());
	 	}
	} 
	?>
	<div class="csv-container">
		<button class="btn btn-primary btn-lg export-csv">Download CSV</button>
	</div>
	<?php
	$average_json->create_content('average');
	$general_json->create_content('general');
	?>

	<style type="text/css">
		<?php include ('css/main.css');?>
	</style>
	<script type="text/javascript">
		<?php include ('js/csv-ajax.js');?>
	</script>

	<iframe id="my_iframe" style="display:none;"></iframe>
	<script>
		function Download(url) {
		    document.getElementById('my_iframe').src = url;
		};
	</script>

	<?php
}

/*
function init(){
	$files = new FilesystemIterator(__DIR__, FilesystemIterator::SKIP_DOTS);
	?><form class="form-container" method="post"><?php
	$clear_column = false;
	foreach ($files as $fileinfo) {
		//get extension
		$extension = end(explode('.', $fileinfo));

	    if($extension ==='json'){
			$json_file = new JsonFile($fileinfo->getFilename()); 
			$json_file->create_table();

			if($clear_column){ //div with clear both (2 columns)
				?><div style="clear: both;"></div><?php 
			}

			$clear_column = !$clear_column;
	    }

	}
	?><input type="submit" value="Save"></input></form>

	<style type="text/css">
		<?php include ('css/main.css');?>
	</style><?php	
}

*/


?>
