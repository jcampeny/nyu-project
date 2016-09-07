<?php
require 'controller.php';
require 'validate-user.php';
require 'db-connection.php';


$postdata = file_get_contents("php://input");
$user_data = json_decode($postdata);

$user = new User($user_data->name, $user_data->pass);
$conn = getConnection();

$response_array['status'] = 'error';
$response_array['content'] = '';

$rows = array();
if($user->status == "success"){
	if($user_data->name && $user_data->email){
		$sql = "SELECT * FROM data_importer";
		if ($resultado = $conn->query($sql)) {
		    $response_array['status'] = 'success';
		    while($row = $resultado->fetch_array(MYSQLI_ASSOC)){
		    	array_push($rows, $row);
			}
			$rows = parse_CSV($rows);
			$response_array['content'] = $rows;
			$resultado->close();
			print json_encode($response_array);
		}else{
			$response_array['content'] = "Not saved";
			print json_encode($response_array);
		}
	}else{
		$response_array['content'] = "csv not set";
		print json_encode($response_array);
	}
}else{
	$response_array['content'] = $user->error;
	print json_encode($response_array);
}

function parse_CSV($csv_rows){
	foreach ($csv_rows as $csv_key => $csv_row) {
		$importer = new CsvImporter($csv_row['path'] . $csv_row['filename']); 
		$csv = $importer->get(); 
		$csv_rows[$csv_key]['csv'] = $csv;
	}
	return $csv_rows;
}

class CsvImporter { 
    private $fp; 
    private $parse_header; 
    private $header; 
    private $delimiter; 
    private $length;
private $test;
    function __construct($file_name, $parse_header = false, $delimiter = ',', $length = 0){ 
		$this->fp           = fopen($file_name, "r");
		$this->parse_header = $parse_header;
		$this->length       = $length;
		$this->header       = str_replace('"', '',fgetcsv($this->fp, $this->length)[0]);
		$this->delimiter    = (count(explode($delimiter, $this->header)) < 2 ) ? ';': ',';
    } 

    function get() { 
    	$data = array();
    	if (!$this->parse_header) 
    		$data['header'] = explode($this->delimiter, $this->header);

    	while (($row = fgetcsv($this->fp, 0)) !== FALSE) {
    		$row_items = explode($this->delimiter, str_replace('"', '', $row[0]));
    		$a_row = array();

    		if (!$this->parse_header){
    			foreach ($data['header'] as $key => $value) {
    				$a_row[$value] = $row_items[$key];
    			}
    			array_push($data, $a_row);
    		}else{
				array_push($data, $row);
    		}
    	}
        return $data; 
    } 

} 

?>