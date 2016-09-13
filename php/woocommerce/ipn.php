<?php
    require_once 'encrypt_ekd/encrypt_ekd.php';
    require 'controller.php';
    include 'validate-user.php';
    require_once 'db-connection.php';
    //Build the data to post back to Paypal
    $postback = 'cmd=_notify-validate'; 

    //TEST CUSTOM
    $headers = 'From: webmaster@ejemplo.com' . "\r\n" .
    'Reply-To: webmaster@ejemplo.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();


    //GET PURCHASE 
    $purchase = getPurchase($_POST['custom']);

    // go through each of the posted vars and add them to the postback variable
    foreach ($_POST as $key => $value) {
    $value = urlencode(stripslashes($value));
    $postback .= "&$key=$value";
    }


    // build the header string to post back to PayPal system to validate
    $header = "POST /cgi-bin/webscr HTTP/1.0\r\n";
    $header .= "Content-Type: application/x-www-form-urlencoded\r\n";
    $header .= "Content-Length: " . strlen($postback) . "\r\n\r\n";

    // Send to paypal or the sandbox depending on whether you're live or developing
    // comment out one of the following lines
     //$fp = fsockopen ('ssl://www.sandbox.paypal.com', 443, $errno, $errstr, 30);//open the connection
    $fp = fsockopen ('ssl://www.paypal.com', 443, $errno, $errstr, 30);
    // or use port 443 for an SSL connection
    //$fp = fsockopen ('ssl://www.paypal.com', 443, $errno, $errstr, 30);

    if (!$fp) {
        // HTTP ERROR Failed to connect
        //error handling or email here
    }
    else{ // if we've connected OK
        fputs ($fp, $header . $postback);//post the data back
        while (!feof($fp)){
             $response = fgets ($fp, 1024);

            if (strcmp ($response, "VERIFIED") == 0){ //It's verified
             
                // assign posted variables to local variables, apply urldecode to them all at this point as well, makes things simpler later
                $payment_status = $_POST['payment_status'];//read the payment details and the account holder

                if($payment_status == 'Completed'){                  
                    //Do something
                }else if($payment_status == 'Denied' || $payment_status == 'Failed' || $payment_status == 'Refunded' || $payment_status == 'Reversed' || $payment_status == 'Voided'){
                    //Do something
                }
                else if($payment_status == 'In-Progress' || $payment_status == 'Pending' || $payment_status == 'Processed'){
                    //Do something
                }
                else if($payment_status == 'Canceled_Reversal'){
                    //Do something
                }

                /**********************
                ****UPDATE PURCHASE****
                ***********************/
                $conn = getConnection();
                $paypal_request = json_encode($_POST);
                $purchase_date = date("Y-m-d");
                $sql = "UPDATE nyu_purchase 
                    SET state = $payment_status, paypal_request = $paypal_request, purchase_date = $purchase_date 
                    WHERE id = $_POST['custom']";

                $resultado = $conn->query($sql);
                $resultado->close();

            }
            else if (strcmp ($response, "INVALID") == 0){ 
                 //the Paypal response is INVALID, not VERIFIED
            }
        } //end of while
        fclose ($fp);
     }




    function getPurchase($id){
        $conn = getConnection();
        $sql = "SELECT * FROM nyu_purchase WHERE id = $_POST['custom']";

        if ($resultado = $conn->query($sql)) {
            $rows = array();
            while($row = $resultado->fetch_array(MYSQLI_ASSOC)){
                $rows[] = $row;
            }
            $resultado->close();
            return $rows[0];
        }else{
            return FALSE;
        }
    }

/*************
**ENCAPSULAR**
**************/
    /*//desencriptación de la información del usuario
    $decrypted = $customInfo = encrypt_decrypt('decrypt', encrypt_decrypt('decrypt', $_POST['custom']));
    $userInfo = explode("-ekd-", $decrypted);
    
    //checkeamos que el usuario es correcto 
    $user = new User($userInfo[0], $userInfo[1]);
    if($user->status == "success"){
        $customers = $woocommerce->get('customers');

        $actualCustomer = null;
        foreach ($customers as &$customer) {
            //
            if( $userInfo[0]  == $customer["username"]){
                $actualCustomer = $customer;
            }
        }

        if($actualCustomer){

            $data = [
                'payment_method' => 'bacs',
                'payment_method_title' => 'Paypal',
                'set_paid' => true,
                'customer_id' => $actualCustomer['id'],
                'billing' => $actualCustomer['billing'],
                'shipping' => $actualCustomer['shipping'],
                'line_items' => [
                    [
                        'product_id' => 2039,
                        'quantity' => 1
                    ]
                ],
                'shipping_lines' => [
                    [
                        'method_id' => 'flat_rate',
                        'method_title' => 'Flat Rate',
                        'total' => 0
                    ]
                ]
            ];

            $woocommerce->post('orders', $data);
            mail("jordicampeny12@gmail.com", "tipo_venta_auxx", json_encode($data), $headers); 
            
        }else{
            mail("jordicampeny12@gmail.com", "tipo_venta_auxx", 'Usuario no encontrado', $headers);
        }
    }else{
        mail("jordicampeny12@gmail.com", "tipo_venta_auxx", $user->error, $headers);
    }
*/ ?>