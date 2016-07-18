<?php

if (isset($_POST['action'])) {
    createCSV();
}

function createCSV(){
	$str = file_get_contents('gap-general.json');
	$json_file = json_decode($str, true);
	$f = fopen('gap-survey-export.csv', 'w');

	//Header 
	$header = array(
		'id'         => "User",
		'living'     => "Living",
		'born'       => "Born",
		'occupation' => "Occupation",
		'age'        => "Age",
		'gender'     => "Gender"
    );
    //header's answers
    foreach ($json_file[0]["user"]["answers"] as $x => $y) {
    	array_push($header, $x);
    }
    fputcsv($f, $header, ";");

	//Content
	foreach ($json_file  as $key => $value) {
		$user = array(
			'id'         => $key + 1,
			'living'     => $value["user"]["info"]["living"],
			'born'       => $value["user"]["info"]["born"],
			'occupation' => $value["user"]["info"]["occupation"],
			'age'        => $value["user"]["info"]["age"],
			'gender'     => $value["user"]["info"]["gender"]
	    );
	    //Content's answers
	    foreach ($value["user"]["answers"] as $x => $y) {
	    	array_push($user, $y);
	    }
	   	fputcsv($f, $user, ";");
	}
}

?>