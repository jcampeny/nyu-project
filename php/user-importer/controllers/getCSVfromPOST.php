<?php 
if ( isset($_POST["submit"]) ) {

    if ( isset($_FILES["file"])) {

        if ($_FILES["file"]["error"] > 0) {
            echo "Return Code: " . $_FILES["file"]["error"] . "<br />";

        } else {
            $CSV = new CsvImporter($_FILES["file"]["tmp_name"]);
            $parse_CSV = $CSV->get();

            foreach ($parse_CSV['rows'] as $user) {

                if($user['Account'] != null){
                    $registered_user = register_imported_user($user);

                    if($registered_user['error']){
                        echo 'User ' . $user['Account'] . ' can\'t be created. ERROR:' . $registered_user['error'];
                    }else{
                        $date_object = date_create($user['ExpireDate']);
                        $date_parsed = date_format($date_object, 'Y-m-d');

                        create_new_purchase($registered_user['id'], $date_parsed);

                         echo 'User ' . $user['Account'] . '  created. ID: ' . $registered_user['id'] . ' </br>';
                    }
               
                }
            }
        }

    } else {
        echo "No file selected <br />";
    }
} 

function create_new_purchase ($user_id, $expired_date) {
    global $wpdb;
    $table = 'nyu_purchase'; 

    $purchase_data = array(
        'id_user'        => $user_id,
        'id_product'     => 5,
        'state'          => 'Completed',
        'paypal_request' => '',
        'purchase_date'  => $expired_date,
        'total_cycle'    => 0  
    );

    $wpdb->insert( $table, $purchase_data);
}
//INSERT
function register_imported_user ($user) {//request
    require $_SERVER['DOCUMENT_ROOT'].'/php/woocommerce/controller.php';
    global $wpdb;
    $table = 'nyu_user';

    $role_int      = 2;
    $user_name     = $user['Account'];
    $password      = $user['Password'];
    $expired_date  = $user['ExpireDate'];
    $register_date = $user['Register Time'];

    $user_data = array(
        'name'       => $user_name,
        'email'      => $user_name,
        'role'       => $role_int,
        'special'    => 0,
        'newsletter' => 0,
        'blocked'    => 0  
    );

    $woo_data = [
        'email'      => $user_name,
        'first_name' => '',
        'last_name'  => '',
        'username'   => $user_name,
        'password'   => $password,
        'billing' => [
            'first_name' => '',
            'last_name'  => '',
            'company'    => '',
            'address_1'  => '',
            'address_2'  => '',
            'city'       => '',
            'state'      => '',
            'postcode'   => '',
            'country'    => '',
            'email'      => $user_name,
            'phone'      => ''
        ],
        'shipping' => [
            'first_name' => '',
            'last_name'  => '',
            'company'    => '',
            'address_1'  => '',
            'address_2'  => '',
            'city'       => '',
            'state'      => '',
            'postcode'   => '',
            'country'    => ''
        ]
    ];

    $user_id = null;
    $error = null;

    try {
        $woocommerce->post('customers', $woo_data);
        $wpdb->insert( $table, $user_data);
        $user_id = $wpdb->insert_id;
    } catch (Exception $e) {
        $error = $e->getMessage();
    }

    return array(
        'id'    => $user_id,
        'error' => $error
    );
}

?>