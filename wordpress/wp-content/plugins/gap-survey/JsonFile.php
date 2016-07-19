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
		?><h4>Custom Average: </h4>
		<form class="form-container" method="post">
			<table class="table table-striped">
				<tr>
				<?php
				foreach ($this->json["avg"] as $key => $value) {
					?><th><?php echo "q".($key + 1);?></th><?php
				}
				?>
				</tr>
				<tr>
				<?php
				foreach ($this->json["avgPankaj"] as $name => $value) {
					?><td><input value="<?php echo $value;?>" name="<?php echo $name;?>"></input></td><?php
				}
				?>
				</tr>
				</table>
			<input type="submit" value="Save" class="btn btn-primary btn-lg"></input>
		</form>
		<h4>Total: </h4>
		<p><?php echo $this->json["total"];?></p>
		<h4>Gap Average: </h4>
		<p><?php echo $this->json["totalavg"];?></p>
		<h4> Average per question: </h4>
		<table class="table table-striped">
			<tr>
				<?php
				foreach ($this->json["avg"] as $key => $value) {
					?><th><?php echo "q".($key + 1);?></th><?php
				}
				?>
			</tr>
			<tr>
		<?php
		foreach ($this->json["avg"] as $key => $value) {
			?><td><?php echo $value;?></td><?php
		}
		?>
			</tr>
		</table>
		<div class="reset">
			<button class="btn btn-primary btn-lg reset-btn">Reset</button>
		</div>
		<hr>
		<?php
	}
	//contenido de average
	private function print_general (){
		?>
		<h4>Information per Gap: </h4>
		<table class="table table-striped">
			<tr>
				<th>User</th>
				<th>Living</th>
				<th>Born</th>
				<th>Occupation</th>
				<th>Age</th>
				<th>Gender</th>
				<th>Answers</th>
			</tr>
		<?php
		foreach ($this->json as $key => $value) {?>
			<tr>
				<td><?php echo $key + 1;?></td>
				<td><?php echo $value["user"]["info"]["living"] ;?></td>
				<td><?php echo $value["user"]["info"]["born"] ;?></td>
				<td><?php echo $value["user"]["info"]["occupation"] ;?></td>
				<td><?php echo $value["user"]["info"]["age"] ;?></td>
				<td><?php echo $value["user"]["info"]["gender"] ;?></td>
				<td>
			<?php
			foreach ($value["user"]["answers"] as $x => $y) {
				if($y== null) $y = "n/a";
				?> <strong> <?php echo $x; ?> </strong> <?php echo ": ".$y.", ";
			}
			?></td></tr<?php
		}
		?>
		</table>
		<div class="delete-all">
			<button class="btn btn-primary btn-lg delete-all-btn">Delete</button>
		</div>
		<?php
	}

}
//{"user":{"info":{"living":"Sweden","born":"Saint Vincent and the Grenadines","occupation":"Government \/ Non-profit \/ NGO","age":"30 - 39","gender":"Male"},"answers":{"q1":"-2","q2":"-1","q3":"0","q4":"1","q5":"2","q6":"-2","q7":"-2","q8":"-2","q9":"-1","q10":"0","q11":"0","q12":"2","q13":"0","q14":"1","q15":"1"}}}
//{"total":70,"totalavg":-6,"avg":[-1.42,1.1,-1.8,1.2,-1.45,1.8,1.3,-0.85,-1.25,-1.55,1.05,-1.03,-0.7,-1.55,-0.85],"avgPankaj":[-1.37,1.1,-1.8,1.2,-1.45,1.8,1.3,-0.85,-1.25,-1.55,1.05,-1.03,-0.7,-1.55,-0.85]}
?>
