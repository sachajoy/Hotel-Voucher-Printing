<?php
$servername = 'localhost';
$username = 'root';
$password = 'arihant';
$dbname = 'shaileshbanthia_hotel_voucher_printing';

$GLOBALS["conn"] = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

?>