<?php
require 'controller.php';

print json_encode($woocommerce->get('customers'));
