<h2>USER IMPORTER</h2>

<table width="100%">
<form action="<?php echo $_SERVER["PHP_SELF"] . '?page=User+Importer'; ?>" method="post" enctype="multipart/form-data">

<tr>
<td width="20%">Select file</td>
<td width="80%"><input type="file" name="file" id="file" /></td>
</tr>

<tr>
<td>Submit</td>
<td><input type="submit" name="submit" /></td>
</tr>

</form>
</table>

<?php 
	//import CSV class & Get POST
	require_once( CD_PLUGIN_PATH . 'controllers/CSV.class.php' );
	require_once( CD_PLUGIN_PATH . 'controllers/getCSVfromPOST.php' );
?>