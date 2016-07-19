<?php
/**
 * Script to submit the contents of the contact form via an XHR. Contents of the form are sent to this script by the
 * site javascript. This just processes the data and sends it to the specified email address.
 *
 */


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$fromEmail = $request->email;
$message = "
	Name: ".$request->name."
	Organization: ".$request->organization."
	Anticipated Date: ".$request->date."
	E-MAIL: ".$request->email."
	Phone Number: ".$request->phone."
	Message:".$request->msg;

$subject = "Contact Web";
$headers = "From: $fromEmail\r\n";
$mail = "jordicampeny12@gmail.com,jcampeny@elkanodata.com";

if($request->nature > 0){

	if($request->nature == 1) /*$mail = 'pankaj@ghemawat.com'*/ $mail = "jordicampeny12@gmail.com";
	if($request->nature == 2) /*$mail = 'online@ghemawat.com'*/ $mail = "jordicampeny12@gmail.com";
	if($request->nature == 3) /*$mail = 'globecourse@ghemawat.com'*/ $mail = "jordicampeny12@gmail.com";
	$message = "
		Name: ".$request->name."
		Organization: ".$request->organization."
		E-MAIL: ".$request->email."
		Message:".$request->msg;
}else{
	$mail = getMailTo();
}

if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
  	echo -1;
}else{
	if(mail($mail, $subject, $message, $headers)) {
		//insertToDB($request);
		echo 1;
	}
	else {
		echo 0;
	}
}

function getMailTo(){
	$mailTO = '';
	//DB connection
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "nyu";
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);echo $conn->connect_error;
	} 

	$sql = "SELECT option_value FROM wp_options WHERE wp_options.option_name = 'mail_to_request'";

	if ($resultado = $conn->query($sql)) {
	    $row = $resultado->fetch_row();
	    $mailTO = $row[0];
	    $resultado->close();
	}
	return $mailTO;
}

/*for test*/
/*
class Test {
	public $name="Jordi Campeny";
	public $email="jcampeny@elkanodata.com";
	public $company="elkanodata";
	public $interest="testeando esto";
	public $textarea="esto es el contenido del mensaje";
}

$test = new Test;
insertToDB($test);
*/
/**/
function insertToDB($request) {
	//DB connection
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "nyu";
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);

	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);echo $conn->connect_error;
	} 

	// Get actual date
	/*  for gmt date:
	*	$d =  gmdate("Y-m-d H:i:s"); 
	*/
	$d =  date("Y-m-d H:i:s"); 
	$date = date($d);

	// setting parameters from request
	$name         = $request->name;
	$organization = $request->organization;
	$email        = $request->email;
	$phone        = $request->phone;
	$message      = $request->msg;

	if($request->nature > 0){
		$nature = $request->nature;
		$sql = "INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_status, post_name, post_modified, post_modified_gmt, post_type)
				VALUES (1, '$date', '$date', '','From: ".$name."', 'private', '".$name."', '$date', '$date', 'contact');";
	}else{
		$date_sent = $request->date;
		$sql = "INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_status, post_name, post_modified, post_modified_gmt, post_type)
				VALUES (1, '$date', '$date', '','From: ".$name."', 'private', '".$name."', '$date', '$date', 'message');";
	}
	//creating the first query - wp_post


	//creating the second query - wp_postmeta
	if ($conn->query($sql) === TRUE) {
		$id = $conn->insert_id;
		if($request->nature > 0){
			$sql = "INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
					VALUES  ($id, 'name_contact', '".		  $name         ."'),
							($id, 'organization_contact', '". $organization ."'),
							($id, 'email_contact', '".		  $email 		."'),
							($id, 'nature_contact', '".		  $nature 		."'),
							($id, 'message_contact', '".	  $message 	  	."');";				
		}else{
			$sql = "INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
					VALUES  ($id, 'name_message', '".		  $name         ."'),
							($id, 'organization_message', '". $organization ."'),
							($id, 'date_sent_message', '".	  $date_sent    ."'),
							($id, 'email_message', '".		  $email 		."'),
							($id, 'phone_message', '".		  $phone 		."'),
							($id, 'message_message', '".	  $message 	  	."');";				
		}


     
		$conn->query($sql);
	}

	//close connection
	$conn->close();	
}

?>