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
				var content = '<tr><th>ID</th><th>Name</th><th>Description</th><th>For students</th><th>Plan</th><th>USD</th><th>EUR</th><th>Delete</th></tr>';
				for (var i = response.length - 1; i >= 0; i--) {
					var row = response[i];
					content += '<tr>'+createContent(row)+'</tr>';
				}
				
				$('.subscriptions-container').append(content);

				$('[delete]').on('click', function(e){
					var id = $(this).attr('delete');
					deleteSubscription(id);
				});
			}
		});
	}

	function createContent (row){
		var content;
		content += '<td>'+row.id+'</td>' ;
		content += '<td>'+row.name+'</td>' ;
		content += '<td>'+row.description+'</td>' ;
		content += '<td>'+row.student+'</td>' ;
		content += '<td>'+row.type_cycle+'</td>' ;
		content += '<td>'+row.cost_cycle_USD+'</td>' ;
		content += '<td>'+row.cost_cycle_EUR+'</td>' ;
		content += '<td delete="'+row.id+'">'+'<span class="dashicons dashicons-trash"></span>'+'</td>' ;
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
});


