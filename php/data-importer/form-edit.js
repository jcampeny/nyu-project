jQuery(document).ready( function($){
	$('.file-editor-btn').on('click', function(e){
			var id = $(this).attr('id-file');
			var data = {};
			data.action = 'test_response';
			data.id = id ;
			$('input[id-file="' + id + '"]').each(function(i){
				if($(this).attr('name') == 'confidential'){
					data[$(this).attr('name')] = ($(this).attr('checked')) ? 1 : 0;
				}else{
					data[$(this).attr('name')] = $(this).val();
				}
			});
			$.post({
				//url : '/wordpress/wp-content/plugins/data-importer/update-db.php',
				url : the_ajax_script.ajaxurl,
				data : data,
				success : function(dataa){
					if(dataa == 1){
						var editForm = $('div[edit-form = "'+id+'"]');
						if(editForm.hasClass('hide-form')){
							editForm.removeClass('hide-form');
						}else{
							editForm.addClass('hide-form');
						}

					}
				}
			});
	});


	$('.delete-form').on('click', function(e){
		if (confirm('Are you sure you want to delete this file?')) {
			var domElement = $(this);
		    var id = domElement.attr('edit-form-id');
		    var path = domElement.attr('path');
		    var filename = domElement.attr('filename');
		    var data = {};

		    data.action = 'delete_response';
		    data.id = id;
		    data.path = path;
			data.filename = filename;

		    $.post({
		    	//url : '/wordpress/wp-content/plugins/data-importer/update-db.php',
		    	url : the_ajax_script.ajaxurl,
		    	data : data,
		    	success : function(dataa){
		    		if(dataa == 'deleted'){
		    			domElement.parent().css({'display' : 'none'});		    			
		    		}
		    	}
		    });
		}
	});
});


