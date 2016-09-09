<form id="create-user" class="row">
	<h2>New User:</h2>
	<div class="error error-content"></div>
	<div class="col-xs-6">
		<div class="form-group">
			<label for="user-name">Username:</label>
			<input class="form-control" type="text" name="user-name" id="user-name">	
		</div>

		<div class="form-group">
			<label for="user-email">Email:</label>
			<input class="form-control" type="text" name="user-email" id="user-email">	
		</div>
		
		<div class="form-group">
			<label for="user-password">Password:</label>
			<input class="form-control" type="text" name="user-password" id="user-password">	
		</div>

		<div class="checkbox">
		  <label>
		    <input type="checkbox" value="" name="user-newsletter" id="user-newsletter">
		    Subscribe to Newsletter
		  </label>
		</div>

		<div class="form-group">
		<label for="user-role">User Role:</label>
			<select name="user-role" id="user-role" class="form-control">
			  <option value="1" selected>1 - Unregistered</option>
			  <option value="2">2 - Registered</option>
			  <option value="3">3 - Premium</option>
			  <option value="4">4 - Superpremium</option>
			  <option value="5">5 - Admin</option>
			</select>
		</div>	
		<a class="show-more-info" href="#" state="hide">Show more information</a>
		<button class="btn btn-primary" type="submit">Create</button>
	</div>
	<div class="col-xs-6 other-information-woo">
		<div class="form-group">
			<label for="user-first-name">First name:</label>
			<input class="form-control" type="text" name="user-first-name" id="user-first-name">
		</div>
		
		<div class="form-group">
			<label for="user-last-name">Last name:</label>
			<input class="form-control" type="text" name="user-last-name" id="user-last-name">
		</div>

		<div class="form-group">
			<label for="user-company">Company:</label>
			<input class="form-control" type="text" name="user-company" id="user-company">
		</div>

		<div class="form-group">
			<label for="user-address">Address:</label>
			<input class="form-control" type="text" name="user-address" id="user-address">
		</div>

		<div class="form-group">
			<label for="user-city">City:</label>
			<input class="form-control" type="text" name="user-city" id="user-city">
		</div>

		<div class="form-group">
			<label for="user-state">State:</label>
			<input class="form-control" type="text" name="user-state" id="user-state">
		</div>

		<div class="form-group">
			<label for="user-postcode">Postcode:</label>
			<input class="form-control" type="text" name="user-postcode" id="user-postcode">
		</div>

		<div class="form-group">
			<label for="user-country">Country:</label>
			<input class="form-control" type="text" name="user-country" id="user-country">
		</div>

		<div class="form-group">
			<label for="user-phone">Phone:</label>
			<input class="form-control" type="text" name="user-phone" id="user-phone">
		</div>
	</div>
</form>


<div class="row">
	<h2>Users:</h2>
	<table class="users-container table">
	</table>	
</div>