<?php/** * Created by IntelliJ IDEA. * User: Arihant * Date: 11-05-2018 * Time: 15:41 */require 'connection.php';require 'select_last_id.php';$id = get_last_id("hotel_email_id") +1;$rec = json_decode(file_get_contents("php://input"));$sql = "insert into hotel_email_id (id,hotel_id,email_id) ".    "values ('".$id."','".$rec->hotel_id."','".$rec->mail."') ";//echo $sql;$res = $conn->query($sql);if ($res)    echo 1;else    echo 0;?>