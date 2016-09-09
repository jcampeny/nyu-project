jQuery(document).ready( function($){
	$('.error-content').css({'display' : 'none'});
	$('.product-created').css({'display' : 'none'});
	displaySubscription ();

	$('form#new-product').on('submit', function(e){
		e.preventDefault();
		var errorHandler = '';
		var data = {
			action : 'create_product',

			name : $('#product-name').val(),
			description : $('#description').val(),
			type_cycle : $('#type_cycle').val(),
			cost_cycle_USD : $('#cost_cycle_USD').val(),
			cost_cycle_EUR : $('#cost_cycle_EUR').val(),
			student : ($('#nyu-student').prop( "checked" )) ? 1 : 0
		};

		if(data.cost_cycle_USD === '') errorHandler = 'Cost USD not valid';
		if(data.cost_cycle_EUR === '') errorHandler = 'Cost EUR not valid';
		if(data.name === '') errorHandler = 'Name not valid';

		if(errorHandler === ''){
			$('.error-content').css({'display' : 'none'});
			$.post({
				url : the_ajax_script.ajaxurl,
				data : data,
				success : function (response){
					if(response == 1){
						$('.product-created').css({'display' : 'block'});
						$('form#new-product').css({'display' : 'none'});
						displaySubscription ();
					}
				}
			});			
		}else{
			$('.error-content')
				.css({'display' : 'block'})
				.text(errorHandler);
		}
	});

	$('.create-subscription').on('click', function(e){
		$('.product-created').css({'display' : 'none'});
		$('form#new-product').css({'display' : 'block'});
	});



	function displaySubscription (){
		var data = {action : 'select_product'};
		$('.subscriptions-container').empty();
		$.post({
			dataType: "json",
			url : the_ajax_script.ajaxurl,
			data : data,
			success : function (response){
				var content = '<tr><th>ID</th><th>Name</th><th>Description</th><th>For students</th><th>Plan</th><th>USD</th><th>EUR</th><th></th><th></th></tr>';
				for (var i = response.length - 1; i >= 0; i--) {
					var row = response[i];
					content += createRow(row);
				}
				
				$('.subscriptions-container').append(content);

				$('[delete]').on('click', function(e){
					var id = $(this).attr('delete');
					deleteSubscription(id);
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
					editSubscription(id);
				});
			}
		});
	}

	function createRow (row){
		var content;
		var checked = (row.student != 0) ? 'checked' : '';
		content += '<tr info-row="'+row.id+'">'+'<td>'+row.id+'</td>' ;
		content += '<td>'+row.name+'</td>' ;
		content += '<td>'+row.description+'</td>' ;
		content += '<td>'+row.student+'</td>' ;
		content += '<td>'+row.type_cycle+'</td>' ;
		content += '<td>'+row.cost_cycle_USD+'</td>' ;
		content += '<td>'+row.cost_cycle_EUR+'</td>' ;
		content += '<td edit="'+row.id+'">'+'<span class="dashicons dashicons-edit"></span>'+'</td>' ;
		content += '<td delete="'+row.id+'">'+'<span class="dashicons dashicons-trash"></span>'+'</td>'+'</tr>';
		//edit
		content += '<tr class="edit" edit-row="'+row.id+'">'+'<td>'+row.id+'</td>' ;
		content += '<td><input type="text" name="name" id="product-name_'+row.id+'" value="'+row.name+'"></td>' ;
		content += '<td><input type="text" name="description" id="description_'+row.id+'" value="'+row.description+'"></td>' ;
		content += '<td><input type="checkbox" name="student" id="nyu-student_'+row.id+'" '+checked+'></td>' ;
		content += '<td><select name="type_cycle" id="type_cycle_'+row.id+'">';
		content += '<option value="D"'+ ((row.type_cycle == "D") ? "selected" : "") +'>Daily</option>';
		content += '<option value="W"'+ ((row.type_cycle == "W") ? "selected" : "") +'>Weekly</option>';
		content += '<option value="M"'+ ((row.type_cycle == "M") ? "selected" : "") +'>Monthly</option>';
		content += '<option value="Y"'+ ((row.type_cycle == "Y") ? "selected" : "") +'>Yearly</option>';
		content += '</select></td>';
		content += '<td><input type="text" name="cost_cycle_USD" id="cost_cycle_USD_'+row.id+'" value="'+row.cost_cycle_USD+'"></td>' ;
		content += '<td><input type="text" name="cost_cycle_EUR" id="cost_cycle_EUR_'+row.id+'" value="'+row.cost_cycle_EUR+'"></td>' ;
		content += '<td accept="'+row.id+'">'+'<span class="dashicons dashicons-yes"></span>'+'</td>' ;
		content += '<td cancel="'+row.id+'">'+'<span class="dashicons dashicons-no-alt"></span>'+'</td>'+'</tr>';
		return content;
	}

	function deleteSubscription(id){
		if(confirm('Are you sure you want to delete this subscription?')){
			var data = {
				action : 'delete_product',
				id : id
			};
			$.post({
				url : the_ajax_script.ajaxurl,
				data : data,
				success : function (response){
					if(response == 1){
						displaySubscription ();
					}
				}
			});
		}
	}
	function editSubscription(id) {
		if(confirm('Are you sure you want to edit this subscription?')){
			var data = {
				action : 'edit_product',
				id : id,
				name : $('#product-name_'+id).val(),
				description : $('#description_'+id).val(),
				type_cycle : $('#type_cycle_'+id).val(),
				cost_cycle_USD : $('#cost_cycle_USD_'+id).val(),
				cost_cycle_EUR : $('#cost_cycle_EUR_'+id).val(),
				student : ($('#nyu-student_'+id).prop( "checked" )) ? 1 : 0
			};
			$.post({
				url : the_ajax_script.ajaxurl,
				data : data,
				success : function (response){
					if(response == 1){
						displaySubscription();
					}
				}
			});
		}
	}

});


