<?php
$json_file = json_decode(file_get_contents("gap-average.json"));
$json_file->total = 0;
$json_file->totalavg = 0.00;
foreach ($json_file->avg as $key => $value) {
	$json_file->avg[$key] = 0.00;
}
$json_encoded  = json_encode($json_file, true);
file_put_contents("gap-average.json", $json_encoded);
//{"total":108,"totalavg":-6.39,"avg":[-1.55,1.05,-1.79,1.16,-1.44,1.76,1.26,-0.88,-1.28,-1.6,1,-1.01,-0.72,-1.54,-0.81],"avgPankaj":["-0.37","1.2","-1.3","1.2","-1.45","1.8","1.3","-0.85","-1.25","-1.55","1.05","-1.03","-0.7","-1.55","-0.85"]}
?>
