

( function( $ ) {
	$("input:not('input:submit')").click(function(e){
		resetError($(this));
	});

	$(document).on('submit', function(e) {
		//if(!isValid()){
			//e.preventDefault();
		//}
		//e.preventDefault();
		//isValid();
	});

	function isValid () {
		var valid = true;
		$("input:not('input:submit')", 'form').each(function(i){
		    //console.log($(this).prop('name'), $(this).prop('type'), $(this).val());
		    var state = validatorController($(this));
		    if(!state.success){
		    	errorInterface(state.error, $(this));
		    	valid = false;
		    }
		});
		return valid;
	}

	function validatorController (obj) {
		var name = obj.prop('name');
		var type = obj.prop('type');
		var state = {
			success : true,
			error : ''
		};
		if(type == 'text'){
			state = validateText(obj);
		}else if(type != 'checkbox') {
			switch(name) {
			    case 'ulvl':
			        state = validateUser(obj);
			        break;
			    case 'date':
			        state = validateDate(obj);
			        break;
			    case 'file':
			        state = validateFile(obj);
			        break;
			};			
		}else {
			
			if($(obj)[0].checked){
				$(obj).val('efgegerg');
			}
			console.log($(obj));
		}
		return state;
	}

	function validateText(obj){
		var value = obj.val();
		var state = {success : true, error : ''};
		if(value == ''){
			state.success = false;
			state.error = 'The field are empty';
		}
		return state;
	}
	function validateUser(obj){
		var value = obj.val();
		var state = {success : true, error : ''};
		if (!value || value < 0 || value > 4) {
			state.success = false;
			state.error = 'Invalid user level. (Min: 0, Max: 4)';
		}
		return state;
	}
	function validateDate(obj){
		var value = obj.val();
		var state = {success : true, error : ''};
		if(value == ''){
			state.success = false;
			state.error = 'The field are empty';
		}
		return state;
	}
	function validateFile(obj){
		var files = $(obj)[0].files;
		var state = {success : true, error : ''};
		if(files.length < 1){
			state.success = false;
			state.error = 'Upload a file';
		}
		return state;
	}

	function errorInterface(error, obj){
		var type = obj.prop('type');
		if(type != 'checkbox'){
			obj.addClass('has-error');
			$("div." + obj.prop('name')).css({
				'display' : 'block'
			}).text(error);
		}
	}

	function resetError(obj){
		var type = obj.prop('type');
		if(type != 'checkbox'){
			obj.removeClass('has-error');
			$("div." + obj.prop('name')).css({
				'display' : 'none'
			}).text('');
		}

	}
} )( jQuery );
