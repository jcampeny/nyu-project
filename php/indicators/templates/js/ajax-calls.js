jQuery(document).ready( function($){
	var data = {
		action : 'get_indicators'
	};

	$.post({
		url : the_ajax_script.ajaxurl,
		data : data,
		dataType: 'json',
		success : function (response){
			$('#loading-indicator').css({'display': 'none'});
			var content = 
				'<tr>' + 
					'<th>ID</th>' + 
					'<th>Name</th>' + 
					'<th>Code</th>' + 
					'<th>User role</th>' + 
					'<th>Edit</th>' + 
				'</tr>';

			var indicators = response.data;

			for (var i = 0; i < indicators.length; i++) {
				var indicator = indicators[i];
				content += createRow(indicator);
			}

			$('#table').append(content);

			bindEvents();

		}
	});

	function createRow(indicator) {
		var row = 
		'<tr>' +
			'<td>' + indicator.id + '</td>' +
			'<td>' + indicator.name + '</td>' +
			'<td>' + indicator.code + '</td>' +
			'<td static="' + indicator.id + '">' + indicator.ulevel + '</td>' +
			'<td editable="' + indicator.id + '">' +
				'<select name="user-role" role-indicator="' + indicator.id + '">' +
					'<option value="1" '+ ((indicator.ulevel == "1") ? "selected" : "") +'>1 - Unregistered</option>' +
					'<option value="2" '+ ((indicator.ulevel == "2") ? "selected" : "") +'>2 - Registered</option>' +
					'<option value="3" '+ ((indicator.ulevel == "3") ? "selected" : "") +'>3 - Premium</option>' +
					'<option value="4" '+ ((indicator.ulevel == "4") ? "selected" : "") +'>4 - Superpremium</option>' +
					'<option value="5" '+ ((indicator.ulevel == "5") ? "selected" : "") +'>5 - Admin</option>' +
				'</select>' +
			'</td>' +
			'<td indicator-edit="' + indicator.id + '"><span class="dashicons dashicons-edit"></span></td>' +
			'<td indicator-options="' + indicator.id + '"">' + 
				'<span save="' + indicator.id + '" class="dashicons dashicons-yes"></span>'+
				'<span cancel="' + indicator.id + '" class="dashicons dashicons-no-alt"></span></td>' +
		'</tr>';

		return row;
	}

	function bindEvents(){
		$('[indicator-edit]').on('click', function(e){
			var id = $(this).attr('indicator-edit');

			$('[static="'+id+'"]').css({'display' : 'none'});
			$(this).css({'display' : 'none'});

			$('[editable="'+id+'"]').css({'display' : 'block'});
			$('[indicator-options="'+id+'"]').css({'display' : 'table-cell'});
		});

		$('[save]').on('click', function(e){
			var id = $(this).attr('save');

			var newRole = $('[role-indicator="'+id+'"]').val();
			save(newRole, id);
		});

		$('[cancel]').on('click', function(e){
			var id = $(this).attr('cancel');

			cancel(id);
		});
	}

	function save(newRole, id){
		var data = {
			action : 'save_indicator',
			role : newRole,
			id : id
		};

		$.post({
			url : the_ajax_script.ajaxurl,
			data : data,
			success : function (response){
				console.log(response);
				if (response == 'success'){
					cancel(id);
					$('[static="'+id+'"]').text(newRole);
				}
			}
		});
	}

	function cancel(id){
		$('[static="'+id+'"]').css({'display' : 'table-cell'});
		$('[indicator-edit="'+id+'"]').css({'display' : 'table-cell'});

		$('[editable="'+id+'"]').css({'display' : 'none'});
		$('[indicator-options="'+id+'"]').css({'display' : 'none'});
	}

});