<?php/** * Created by IntelliJ IDEA. * User: Arihant * Date: 11-05-2018 * Time: 17:40 */require 'connection.php';$rec = file_get_contents("php://input");$sql = "delete from `firm_mobile_no` where id = '".$rec."'";$res = $conn->query($sql);if ($res){    echo 1;}else    echo 0;?>