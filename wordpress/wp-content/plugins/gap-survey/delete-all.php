<?php
$json_file = json_decode(file_get_contents("gap-general.json"));
$json_file = [];
$json_encoded  = json_encode($json_file, true);
file_put_contents('gap-general.json', $json_encoded);
?>
