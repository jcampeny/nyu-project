<?php

class JsonFile {
	private $path; //absolute path
	private $link; //path with file name
	private $json; //json (array)
	public  $name;

	//Constructor
	function __construct($name_file){
		$this->name = $name_file;
		$this->path = plugin_dir_path(__FILE__);
		$this->link = $this->path.$name_file;
		$this->json = $this->get_json();
	}

	//getters
	public function get_json() {
		$str = file_get_contents($this->link);
		$json_array = json_decode($str, true);

		return  $json_array;
	}

	//setters
	public function set_json($newJson) {
		$json_encoded  = json_encode($newJson);
		file_put_contents($this->link, $json_encoded );
	}

	//crea contenido dependiendo del tipo que sea (average / general)
	public function create_content ($type){
		if($type == 'average'){
			$this->print_average();
		}
		if($type == 'general'){
			$this->print_general();
		}
	}

	//contenido de average
	private function print_average (){
		?><div><?php echo 'Editable: ';?></div>
		<form class="form-container" method="post">
			<?php
			foreach ($this->json["avgPankaj"] as $name => $value) {
				?><input value="<?php echo $value;?>" name="<?php echo $name;?>"></input><?php
			}
			?>
			<input type="submit" value="save"></input>
		</form>
		<div><?php echo 'Total: '.$this->json["total"];?></div><?php
		?><div><?php echo 'Gap Average: '.$this->json["totalavg"];?></div><?php
		?><div><?php echo 'Average: ';?></div><?php
		foreach ($this->json["avg"] as $key => $value) {
			?><div><?php echo "Question".($key + 1).": ".$value;?></div><?php
		}
		?>

		<?php
	}
	//contenido de average
	private function print_general (){
		?>
		<?php
		foreach ($this->json as $key => $value) {
			?><h3>User <?php echo $key + 1 ?></h3><?php
			?><h4>Information:</h4><?php
			?><h6>Living:</h6><?php
			?><div><?php echo $value["user"]["info"]["living"];?></div><?php
			?><h6>Born:</h6><?php
			?><div><?php echo $value["user"]["info"]["born"];?></div><?php
			?><h6>Occupation:</h6><?php
			?><div><?php echo $value["user"]["info"]["occupation"];?></div><?php
			?><h6>Age:</h6><?php
			?><div><?php echo $value["user"]["info"]["age"];?></div><?php
			?><h6>Gender:</h6><?php
			?><div><?php echo $value["user"]["info"]["gender"];?></div><?php
			foreach ($value["user"]["answers"] as $x => $y) {
				echo $y."//";
			}
		}
		?>
		<?php
	}

}
//{"user":{"info":{"living":"Sweden","born":"Saint Vincent and the Grenadines","occupation":"Government \/ Non-profit \/ NGO","age":"30 - 39","gender":"Male"},"answers":{"q1":"-2","q2":"-1","q3":"0","q4":"1","q5":"2","q6":"-2","q7":"-2","q8":"-2","q9":"-1","q10":"0","q11":"0","q12":"2","q13":"0","q14":"1","q15":"1"}}}
//{"total":70,"totalavg":-6,"avg":[-1.42,1.1,-1.8,1.2,-1.45,1.8,1.3,-0.85,-1.25,-1.55,1.05,-1.03,-0.7,-1.55,-0.85],"avgPankaj":[-1.37,1.1,-1.8,1.2,-1.45,1.8,1.3,-0.85,-1.25,-1.55,1.05,-1.03,-0.7,-1.55,-0.85]}
?>
