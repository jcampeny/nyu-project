<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
//$to = $request; 
$to = 'jordicampeny12@gmail.com'; 
$subject = "Contact Web";
$message = 'test:'.$_SERVER['SERVER_NAME'].'/localdata/mediakit/MediaKit.zip';
$headers = "From: Pankaj Ghemawat\r\n";

if(mail($to, $subject, $message, $headers)) {
	//insertToDB($request);
	echo 1;
}
else {
	echo 0;
}
