<?php
/**
 * Script to submit the contents of the contact form via an XHR. Contents of the form are sent to this script by the
 * site javascript. This just processes the data and sends it to the specified email address.
 *
 * Created by PhpStorm.
 * User: Michael
 * Date: 17/11/13
 * Time: 11:49
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
$mail = "jordicampeny12@gmail.com";

if(mail($mail, $subject, $message, $headers)) {
	//insertToDB($request);
	echo 1;
}
else {
	echo 0;
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
	$date_sent    = $request->date;
	$email        = $request->email;
	$phone        = $request->phone;
	$message      = $request->msg;


	//creating the first query - wp_post
	$sql = "INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_status, post_name, post_modified, post_modified_gmt, post_type)
			VALUES (1, '$date', '$date', '','From: ".$name."', 'private', '".$name."', '$date', '$date', 'message');";

	//creating the second query - wp_postmeta
	if ($conn->query($sql) === TRUE) {
		$id = $conn->insert_id;
		$sql = "INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
				VALUES  ($id, 'name_message', '".		  $name         ."'),
						($id, 'organization_message', '". $organization ."'),
						($id, 'date_sent_message', '".	  $date_sent    ."'),
						($id, 'email_message', '".		  $email 		."'),
						($id, 'phone_message', '".		  $phone 		."'),
						($id, 'message_message', '".	  $message 	  	."');";	     
		$conn->query($sql);
	}

	//close connection
	$conn->close();	
}

?>