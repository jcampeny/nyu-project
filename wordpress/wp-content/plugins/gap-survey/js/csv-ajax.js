

( function( $ ) {

	$('.export-csv').click(function(){

        var ajaxurl = '/wordpress/wp-content/plugins/gap-survey/export-csv.php';
        var data =  {'action': 'insert'};

        $.post(ajaxurl, data, function (response) {
            Download("/wordpress/wp-content/plugins/gap-survey/gap-survey-export.csv");
        });
    });
} )( jQuery );
