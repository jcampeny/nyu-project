<?php

class ConnectionController {
	private $host = 'local';
	//private $host = 'nyu';

    public $servername;
	public $username;
	public $password;
	public $dbname;
	public $url;
	public $ck;
	public $cs;

	function __construct(){
		switch ($this->host) {
			case 'local':
				$this->servername = "localhost";
				$this->username = "root";
				$this->password = "";
				$this->dbname = "nyu";

				$this->url = 'http://nyu.com/wordpress/';
				$this->ck = 'ck_eb821bfb21a78f231c1f19c5e996c977c98f06c1';
				$this->cs = 'cs_49fee84e1eeb65f6c67eccea76bcd02b4fed3e37';
				break;

			case 'nyu':
				$this->servername = "db541891912.db.1and1.com";
				$this->username = "dbo541891912";
				$this->password = "k1zCbksPR1cHhxOs%L";
				$this->dbname = "db541891912";

				$this->url = 'http://test-nyu.elkanodata.com/wordpress/';
				$this->ck = 'ck_25e59e85acaac57b69613f68b88bb97e861418b0';
				$this->cs = 'cs_08b1557d3d9c2f1662fee2ddc6764afec3968ce9';
				break;

			default:
				# code...
				break;
		}
	}
}

