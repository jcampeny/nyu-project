<div class="row">
	<h2>Subscriptions:</h2>
	<table class="subscriptions-container table">
	</table>	
</div>

<div class="row">
	<h2>New Subscription:</h2>
	<div class="product-created">
		<p>New Subscription created!</p>
		<button class="btn btn-default create-subscription">Create other subscription</button>
	</div>
	<form id="new-product" class="col-xs-6">
		<div class="error error-content"></div>
		<div class="form-group">
			<label for="product-name">Name:</label>
			<input class="form-control" type="text" name="name" id="product-name">	
		</div>
		
		<div class="form-group">
			<label for="description">Description:</label>
			<input class="form-control" type="text" name="description" id="description">
		</div>

		<div class="checkbox">
		  <label>
		    <input type="checkbox" value="" name="student" id="nyu-student">
		    Subscription for students
		  </label>
		</div>

		<div class="form-group">
		<label for="type_cycle">The plan:</label>
			<select name="type_cycle" id="type_cycle" class="form-control">
			  <option value="D" selected>Daily</option> 
			  <option value="W">Weekly</option>
			  <option value="M">Monthly</option>
			  <option value="Y">Yearly</option>
			</select>
		</div>

		<div class="form-group">
			<label for="cost_cycle_USD">Cost USD:</label>
			<input class="form-control" type="text" name="cost_cycle_USD" id="cost_cycle_USD" placeholder="Example: 10.50">
		</div>

		<div class="form-group">
			<label for="cost_cycle_EUR">Cost EUR:</label>
			<input class="form-control" type="text" name="cost_cycle_EUR" id="cost_cycle_EUR" placeholder="Example: 12.30">	
		</div>

		<button class="btn btn-default" type="submit">Create</button>		
	</form>	
</div>

