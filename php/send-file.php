<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$to = $request->email; 
//$to = 'jordicampeny12@gmail.com'; 
$subject = "Contact Web";
$message = 'MediaKit.zip: '.$request->zip;
$headers = "From: Pankaj Ghemawat\r\n";

if(mail($to, $subject, $message, $headers)) {
	//insertToDB($request);
	echo 1;
}
else {
	echo 0;
}
