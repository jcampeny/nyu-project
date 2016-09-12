jQuery(document).ready( function($){
	displayUsers();

	$('form#create-user').on('submit', function(e){
		e.preventDefault();
		$('.success-content').css({'display' : 'none'});

		var data = {
			action : 'create_user',

			name : $('#user-name').val(),
			email : $('#user-email').val(),
			password : $('#user-password').val(),
			newsletter : ($('#user-newsletter').prop( "checked" )) ? 1 : 0,
			blocked : ($('#user-blocked').prop( "checked" )) ? 1 : 0,
			role : $('#user-role').val(),

			first_name : $('#user-first-name').val() || '',
			last_name : $('#user-last-name').val() || '',
			company : $('#user-company').val() || '',
			address : $('#user-address').val() || '',
			city : $('#user-city').val() || '',
			state : $('#user-state').val() || '',
			postcode : $('#user-postcode').val() || '',
			country : $('#user-country').val() || '',
			phone : $('#user-phone').val( ) || ''
		};

		$.post({
			url : the_ajax_script.ajaxurl,
			dataType: "json",
			data : data,
			success : function (response){
				if(response.status == 'success'){
					$('.error-content')
						.text('')
						.css({'display' : 'none'});
					$('.success-content').css({'display' : 'block'});
					displayUsers();
				}else{
					$('.error-content')
						.text(response.content)
						.css({'display' : 'block'});
				}
			}
		});
	});

	$('a.show-more-info').on('click', function(e){
		var state = $(this).attr('state');
		if(state == 'show'){
			$(this)
				.attr('state', 'hide')
				.text('Show more information');
			$('.other-information-woo').css({'display' : 'none'});
		}else{
			$(this)
				.attr('state', 'show')
				.text('Hide more information');
			$('.other-information-woo').css({'display' : 'block'});
		}
	});

	function displayUsers(){
		var data = {
			action : 'get_user',
		};

		$('.users-container').empty();

		$.post({
			url : the_ajax_script.ajaxurl,
			dataType: "json",
			data : data,
			success : function (response){
				var content = '<tr><th>ID</th><th>Username</th><th>Role</th><th>Newsletter</th><th>Blocked</th><th></th><th></th></tr>';
				if(response.status == 'success'){
					for (var i = response.content.length - 1; i >= 0; i--) {
						var row = response.content[i];
						content += createRow(row);
					}
				}

				$('.users-container').append(content);

				$('[delete]').on('click', function(e){
					var id = $(this).attr('delete');
					deleteUser(id);
				});

				$('[edit]').on('click', function(e){
					var id = $(this).attr('edit');
					$('[edit-row="'+id+'"]').css({'display' : 'table-row'});
					$('[info-row="'+id+'"]').css({'display' : 'none'});
				});

				$('[cancel]').on('click', function(e){
					var id = $(this).attr('cancel');
					$('[edit-row="'+id+'"]').css({'display' : 'none'});
					$('[info-row="'+id+'"]').css({'display' : 'table-row'});
				});

				$('[accept]').on('click', function(e){
					var id = $(this).attr('accept');
					editUser(id);
				});
			}
		});
	}

	function createRow (row){
		var content;
		var id = row.nyu_user.id;
		var newsletter = (row.nyu_user.newsletter != 0) ? 'checked' : '';
		var blocked = (row.nyu_user.blocked != 0) ? 'checked' : '';
		content += '<tr info-row="'+id+'">'+'<td>'+id+'</td>' ;
		content += '<td>'+row.username+'</td>' ;
		content += '<td>'+row.nyu_user.role+'</td>' ;
		content += '<td>'+((newsletter == 'checked') ? 'Yes' : 'No')+'</td>' ;
		content += '<td>'+((blocked == 'checked') ? 'Yes' : 'No')+'</td>' ;
		content += '<td edit="'+id+'">'+'<span class="dashicons dashicons-edit"></span>'+'</td>' ;
		content += '<td delete="'+id+'">'+'<span class="dashicons dashicons-trash"></span>'+'</td>'+'</tr>';
		//edit
		content += '<tr class="edit" edit-row="'+id+'">'+'<td>'+id+'</td>' ;
		content += '<td>'+row.username+'</td>' ;
		content += '<td><select name="user_role" id="user_role_'+id+'">';
		content += '<option value="1"'+ ((row.nyu_user.role == "1") ? "selected" : "") +'>1 - Unregistered</option>';
		content += '<option value="2"'+ ((row.nyu_user.role == "2") ? "selected" : "") +'>2 - Registered</option>';
		content += '<option value="3"'+ ((row.nyu_user.role == "3") ? "selected" : "") +'>3 - Premium</option>';
		content += '<option value="4"'+ ((row.nyu_user.role == "4") ? "selected" : "") +'>4 - Superpremium</option>';
		content += '<option value="5"'+ ((row.nyu_user.role == "5") ? "selected" : "") +'>5 - Admin</option>';
		content += '</select></td>';
		content += '<td><input type="checkbox" name="newsletter" id="nyu-newsletter_'+id+'" '+newsletter+'></td>' ;
		content += '<td><input type="checkbox" name="blocked" id="nyu-blocked_'+id+'" '+blocked+'></td>' ;
		content += '<td accept="'+id+'">'+'<span class="dashicons dashicons-yes"></span>'+'</td>' ;
		content += '<td cancel="'+id+'">'+'<span class="dashicons dashicons-no-alt"></span>'+'</td>'+'</tr>';
		return content;
	}

	function editUser(id) {
		if(confirm('Are you sure you want to edit this User?')){
			var role = parseInt($('#user_role_'+id).val());
			var data = {
				action : 'edit_user',
				id : id,
				role : role,
				newsletter : ($('#nyu-newsletter_'+id).prop( "checked" )) ? 1 : 0,
				blocked : ($('#nyu-blocked_'+id).prop( "checked" )) ? 1 : 0,
				special : (role > 2) ? 1 : 0
			};
			$.post({
				url : the_ajax_script.ajaxurl,
				data : data,
				success : function (response){
					if(response == 1){
						displayUsers();
					}
				}
			});
		}
	}

	function deleteUser(id){
		if(confirm('Are you sure you want to delete this user?')){
			var data = {
				action : 'delete_user',
				id : id
			};
			$.post({
				url : the_ajax_script.ajaxurl,
				dataType: "json",
				data : data,
				success : function (response){
					console.log(response);
					if(response.status == 'success'){
						displayUsers();
					}
				}
			});
		}
	}
});


