jQuery(document).ready( function($){

	$('form#create-user').on('submit', function(e){
		e.preventDefault();

		var data = {
			action : 'create_user',

			name : $('#user-name').val(),
			email : $('#user-email').val(),
			password : $('#user-password').val(),
			newsletter : ($('#user-newsletter').prop( "checked" )) ? 1 : 0,
			role : $('#user-role').val(),

			first_name : $('#user-first-name').val(),
			last_name : $('#user-last-name').val(),
			company : $('#user-company').val(),
			addres : $('#user-addres').val(),
			city : $('#user-city').val(),
			state : $('#user-state').val(),
			postcode : $('#user-postcode').val(),
			country : $('#user-country').val(),
			phone : $('#user-phone').val()
		};

		$.post({
			url : the_ajax_script.ajaxurl,
			data : data,
			success : function (response){
				console.log(response);
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
});


