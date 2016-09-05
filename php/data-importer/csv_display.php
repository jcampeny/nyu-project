<?php
global $wpdb;
$mylink = $wpdb->get_results( "SELECT * FROM data_importer");
?>

<div class="col-xs-12">
	<?php 
		foreach ($mylink as $key => $value){
			print_r($value);
		}
	?>	
</div>
<?php
?>
