<?php

function encrypt_decrypt($action, $string) {
	
    $encrypt_method = "AES-256-CBC";
    $secret_key = 'xKEP1gG4MO5Q}z+1YTvV[c|Ex8FD]ts_4vp1rxPl9xpxe3+6>A0q217FRlDLZ35';
    $secret_iv = 'il<R?iuAB7G1sMcHN3A(~2~gr[=1y3aM3>sF?Pl#u1hjs31&Nmn016K6i4994iX';

    $key = hash('sha256', $secret_key);
    
    $iv = substr(hash('sha256', $secret_iv), 0, 16);

    if( $action == 'encrypt' ) {
        $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
        $output = base64_encode($output);
    }
    else if( $action == 'decrypt' ){
        $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    }

    return $output;
}