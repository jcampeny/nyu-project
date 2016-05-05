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
	Nombre: ".$request->name."
	Empresa: ".$request->company."
	Interés: ".$request->interest."
	Mensaje:".$request->textarea;

$subject = "Contacto Web";
$headers = "From: $fromEmail\r\n";
$mail = "cristiam86@gmail.com";

if(mail($mail, $subject, $message, $headers)) {
	echo 1;
}
else {
	echo 0;
}
