<?php
$file_name = '';
$file_path = get_path();

if ( isset($_POST["submit"]) ) {

    if ( isset($_FILES["file"])) {
        //if there was an error uploading the file
        if ($_FILES["file"]["error"] > 0) {
            echo "Error Code: " . $_FILES["file"]["error"] . "<br />";

        }
        else{
        	
        	if(!is_dir($file_path)){
				mkdir($file_path, 0777, true);
			}

            $file_name = $_POST['name'];
            $temp_name = $_FILES["file"]["tmp_name"];

            if(strrpos($_POST['name'], ".csv") === FALSE){
            	$file_name = $file_name . '.csv';
            }

            move_uploaded_file($temp_name, $file_path . $file_name);
            echo "Stored in: " . $file_path . $file_name . "<br />";
            include_once('post_metadata.php');
            
        }
    } else {
        echo "No file selected <br />";
    }
}

function get_path(){
	$path_base = (string)dirname(__FILE__) . '/upload';
	$path = $path_base;

	$path_folders = explode( '|', str_replace(' ', '', strtolower($_POST['datatree'])) );

	foreach ($path_folders as &$valor) {
	    if($valor != ''){
	    	$path = $path . '/' .$valor;
	    }
	}
	
	return $path . '/';
}
?>