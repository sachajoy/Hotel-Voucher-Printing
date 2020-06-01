<?php

require 'connection.php';

$recived = json_decode(file_get_contents("php://input"));
$user = $recived->username;
$pass = $recived->password;
$sql = "select username as user, password as pass from login where username = '".$user."' and password = '".$pass."'";
//echo $sql;
$result = $GLOBALS["conn"]->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
echo 1;
} else {
    echo 0;
}


?>