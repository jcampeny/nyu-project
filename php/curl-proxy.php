<?php

$data = file_get_contents("php://input");
$data = json_decode($data);
$url = $data->url;

$ch = curl_init(); 

curl_setopt($ch, CURLOPT_URL, $url); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
$output = curl_exec($ch); 
curl_close($ch);   

echo $output;

?>