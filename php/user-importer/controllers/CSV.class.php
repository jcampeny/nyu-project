<?php 
class CsvImporter { 
    private $fp; 
    private $parse_header; 
    private $header; 
    private $delimiter; 
    private $length;

    public function __construct($file_name, $parse_header = false, $delimiter = ',', $length = 0)
    { 
        $this->fp           = fopen($file_name, "r");
        $this->parse_header = $parse_header;
        $this->length       = $length;
        $this->header       = fgetcsv($this->fp, $this->length);
        $this->delimiter    = $delimiter;
    } 

    public function get() 
    { 
        $data = array();

        if (!$this->parse_header){
            $data['header'] = $this->header;
            $data['rows'] = array();
        }

        while (($row = fgetcsv($this->fp, 0)) !== FALSE) {
            $row_items = $row;
            $a_row = array();

            if (!$this->parse_header){
                foreach ($data['header'] as $key => $value) {
                    $a_row[$value] = $row_items[$key];
                }
                array_push($data['rows'], $a_row);
            }else{
                array_push($data, $row);
            }
        }
        return $data; 
    } 
} 

?>
