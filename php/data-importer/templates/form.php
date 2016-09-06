<form action="<?php echo $_SERVER["PHP_SELF"].'?page=Data+Importer'; ?>" method="post" enctype="multipart/form-data">
	<!--General Info-->
	<div class="col-xs-12 col-md-4">
		<h3>Other informations:</h3>
		<label for="name">Name of the dataset:</label>
		<input type="text" name="name" id="name" class="form-control" />
		<div class="error small name"></div>

		<label for="ulvl">Level of user can access it:</label>
		<input type="number" name="ulvl" id="ulvl" class="form-control" min="1" max="5"/>
		<div class="small">5-admin, 4-superpremium, 3-premium, 2-registered, 1-unregistered</div>
		<div class="error small ulvl"></div>

		<div class="checkbox">
		  <label>
		    <input type="checkbox" name="confidential" id="confidential" value="">
		    Data are confidential
		  </label>
		</div>

		<label for="source">Sources of the data:</label>
		<input type="text" name="source" id="source" class="form-control" />
		<div class="error small source"></div>

		<label for="notes">Notes that are to be displayed with sources:</label>
		<input type="text" name="notes" id="notes" class="form-control" />
		<div class="error small notes"></div>

		<label for="unit">Unit of the data:</label>
		<input type="text" name="unit" id="unit" class="form-control" />
		<div class="error small unit"></div>

		<label for="date">Date the data were last updated:</label>
		<input type="date" name="date" id="date" class="form-control" />
		<div class="error small date"></div>

		<label for="inotes">Notes for internal use:</label>
		<input type="text" name="inotes" id="inotes" class="form-control" />
		<div class="error small inotes"></div>

		<label for="levels">The different ways that the data are separated:</label>
		<input type="text" name="levels" id="levels" class="form-control" />
		<div class="error small levels"></div>
		
		<label for="availability">Coverage by reporting country and year:</label>
		<input type="text" name="availability" id="availability" class="form-control" />
		<div class="error small availability"></div>

		<label for="datatree">The tree to get to this file from the data vault:</label>
		<input type="text" name="datatree" id="datatree" class="form-control" />
		<div class="error small datatree"></div>

		<label for="datafile">Datafile:</label>
		<input type="text" name="datafile" id="datafile" class="form-control" />
		<div class="error small datafile"></div>

		<label for="varname">The name of the variable within the file:</label>
		<input type="text" name="varname" id="varname" class="form-control" />
		<div class="error small varname"></div>
	</div>
	<!--File upload-->
	<div class="col-xs-12 col-md-4">
		<label for="file">Select file:</label>
		<input type="file" name="file" id="file" />	
		<div class="error small file"></div>
	</div>
	<div class="col-xs-12">
		<input type="submit" name="submit" value="Upload" class="btn btn-default"/>	
	</div>
</form>