

( function( $ ) {

	$('.export-csv').click(function(){

        var ajaxurl = '/wordpress/wp-content/plugins/gap-survey/export-csv.php';
        var data =  {'action': 'insert'};

        $.post(ajaxurl, data, function (response) {
            Download("/wordpress/wp-content/plugins/gap-survey/gap-survey-export.csv");
        });
    });
	$(document).on("click", ".delete-all-btn", function() {
	    if (confirm('Are you sure?')) {

	        var url = '/wordpress/wp-content/plugins/gap-survey/delete-all.php';
	        var data2 =  {'action': 'delete'};

	        $.post(url, data2, function (response) {
	            location.reload();
	        });
	    }
	});
	$(document).on("click", ".reset-btn", function() {
	    if (confirm('Are you sure?')) {

	        var url = '/wordpress/wp-content/plugins/gap-survey/reset-average.php';
	        var data2 =  {'action': 'reset'};

	        $.post(url, data2, function (response) {
	            location.reload();
	        });
	    }
	});

} )( jQuery );
