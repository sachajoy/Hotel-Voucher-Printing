<?php/** * Created by IntelliJ IDEA. * User: Arihant * Date: 10-05-2018 * Time: 15:30 */require 'connection.php';$rec = file_get_contents("php://input");$sql = "delete from `cust_airline_det` where id = '".$rec."'";$res = $conn->query($sql);if ($res){    echo 1;}else    echo 0;?>