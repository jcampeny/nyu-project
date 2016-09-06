<?php
include_once('templates/form-edit.php');

function get_data_importer () {
	global $wpdb;
	$mylink = $wpdb->get_results( "SELECT * FROM data_importer");
	return $mylink;
}

function getEditor ($url, $file) {
	$mylink = get_data_importer ();
	$file_db = null;
	foreach ($mylink as $object_key => $object){
		if ($object->path == $url.'/' && $object->filename == $file) {
			$file_db = $object;
		}
	}
	$is_checked = ($file_db->confidential) ? 'checked' : '';
	$edit_icon = '<span class="dashicons dashicons-edit edit-form" edit-form-id="'.$file_db->id.'"></span>';
	$delete_icon = '<span class="dashicons dashicons-trash delete-form"  edit-form-id="'.$file_db->id.'"></span>';
	$edit_form = getForm($file_db);
	if($file_db){
		return $edit_icon.$delete_icon.$edit_form;		
	}else{
		return '';
	}


}
?>

<div class="col-xs-12">
	<?php 
	function read_dir_content($parent_dir, $depth = 0){
	    $str_result = "";

	    $folder_name = explode('/', $parent_dir);
	    $str_result .= "<ul state='closed' folder='".$folder_name[count($folder_name) - 1]."' class='folder'>";
	    $str_result .= 
	    	"<div class='folder-name'>"
	    		.'<span class="dashicons dashicons-portfolio"></span> '
	    			.$folder_name[count($folder_name) - 1]
	    	."</div>";

	    if ($handle = opendir($parent_dir)) 
	    {
	        while (false !== ($file = readdir($handle)))
	        {
	            if(in_array($file, array('.', '..'))) continue;
	            if( is_dir($parent_dir . "/" . $file) ){ //es una carpeta
	                $str_result .=  read_dir_content($parent_dir . "/" . $file, $depth++);
	            }else{ //es un archivo
	            	$str_result .= "<li class='file'> 
		            		<span class='dashicons dashicons-media-text'></span>{$file}"
		            		.getEditor($parent_dir, $file)
	            		."</li>";      	
	            }

	        }
	        closedir($handle);
	    }
	    $str_result .= "</ul>";


	    return $str_result;
	}

	$dir = (string)dirname(__FILE__) . '/upload';

	echo "<div class='folder-section'>".read_dir_content($dir )."</div>";
	?>	
</div>

<?php 


 ?>