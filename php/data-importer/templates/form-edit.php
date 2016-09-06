<?php
function getForm($file_db){
	return '<div edit-form="'.$file_db->id.'" class="edit-form hide-form">
		<label for="edit_name">Name of the dataset:</label>
		<input id-file="'.$file_db->id.'" type="text" name="name" id="edit_name" value="'.$file_db->name.'"/>

		<label for="edit_ulvl">Level of user can access it:</label>
		<input id-file="'.$file_db->id.'" type="number" name="ulvl" id="edit_ulvl" min="1" max="5" value="'.$file_db->ulvl.'"/>
		<div class="small">5-admin, 4-superpremium, 3-premium, 2-registered, 1-unregistered</div>

		<div class="checkbox">
		  <label>
		    <input id-file="'.$file_db->id.'" type="checkbox" name="confidential" id="edit_confidential" value="" '.$is_checked.'>
		    Data are confidential
		  </label>
		</div>

		<label for="edit_source">Sources of the data:</label>
		<input id-file="'.$file_db->id.'" type="text" name="source" id="edit_source" value="'.$file_db->source.'" />

		<label for="edit_notes">Notes that are to be displayed with sources:</label>
		<input id-file="'.$file_db->id.'" type="text" name="notes" id="edit_notes" value="'.$file_db->notes.'" />

		<label for="edit_unit">Unit of the data:</label>
		<input id-file="'.$file_db->id.'" type="text" name="unit" id="edit_unit" value="'.$file_db->unit.'" />

		<label for="edit_date">Date the data were last updated:</label>
		<input id-file="'.$file_db->id.'" type="date" name="the_date" id="edit_date" value="'.$file_db->the_date.'"/>

		<label for="edit_inotes">Notes for internal use:</label>
		<input id-file="'.$file_db->id.'" type="text" name="inotes" id="edit_inotes" value="'.$file_db->inotes.'" />

		<label for="edit_levels">The different ways that the data are separated:</label>
		<input id-file="'.$file_db->id.'" type="text" name="levels" id="edit_levels" value="'.$file_db->levels.'" />

		<label for="edit_availability">Coverage by reporting country and year:</label>
		<input id-file="'.$file_db->id.'" type="text" name="availability" id="edit_availability" value="'.$file_db->availability.'" />

		<label for="edit_datafile">Datafile:</label>
		<input id-file="'.$file_db->id.'" type="text" name="datafile" id="edit_datafile" value="'.$file_db->datafile.'" />

		<label for="edit_varname">The name of the variable within the file:</label>
		<input id-file="'.$file_db->id.'" type="text" name="varname" id="edit_varname" value="'.$file_db->varname.'" />
		
		<button class="btn btn-primary file-editor-btn" id-file="'.$file_db->id.'">Save</button>	
	</div>';
}



 ?>