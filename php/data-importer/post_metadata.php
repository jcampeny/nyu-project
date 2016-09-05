<?php
global $wpdb;
if ( isset($_POST["submit"]) ) {

print_r($_POST);
    $post_data = array(
        'name'         => $_POST['name'],
        'ulvl'         => $_POST['ulvl'],
        'confidential' => $_POST['confidential'],
        'source'       => $_POST['source'],
        'notes'        => $_POST['notes'],
        'unit'         => $_POST['unit'],
        'the_date'     => $_POST['date'],
        'inotes'       => $_POST['inotes'],
        'levels'       => $_POST['levels'],
        'availability' => $_POST['availability'],
        'datatree'     => $_POST['datatree'],
        'path'         => $file_path,
        'filename'     => $file_name,
        'datafile'     => $_POST['datafile'],
        'varname'      =>  $_POST['varname']   
    );
    $table = 'data_importer';
    $wpdb->insert( $table, $post_data); 
}

/*
CREATE TABLE data_importer ( 
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(20) NOT NULL,
    ulvl INT NOT NULL,
    source VARCHAR(40) NOT NULL,
    notes TEXT,
    unit VARCHAR(20) NOT NULL,
    the_date DATE NOT NULL, 
    inotes TEXT,
    levels VARCHAR(40) NOT NULL,
    availability VARCHAR(40) NOT NULL,
    datatree VARCHAR(40) NOT NULL,
    path VARCHAR(80) NOT NULL,
    filename VARCHAR(20) NOT NULL,
    datafile VARCHAR(20) NOT NULL,
    varname VARCHAR(20) NOT NULL
);

*/
?>