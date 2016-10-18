jQuery(document).ready( function($){
	var data = {
		action : 'hello_world'
	};
	console.log('sgerg');
	$.post({
		url : the_ajax_script.ajaxurl,
		data : data,
		success : function (response){
			console.log(response);
		}
	});

});