<?php
include ('JsonFile.php');

$data = json_decode(file_get_contents("php://input"));
$average_encoded  = json_encode($data->average, true);
file_put_contents('gap-average.json', $average_encoded);



$json_file = json_decode(file_get_contents("gap-general.json"));
array_push($json_file, $data->general);
$json_encoded  = json_encode($json_file, true);

file_put_contents('gap-general.json', $json_encoded);
echo "saved";
