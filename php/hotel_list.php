<?php
require 'connection.php';
$json_res =   array("hotel_list"=>array());
// EXTRACT THE DATA OF THE HOTEL 
$sql =  "select * from hotel_mst";
$result = $GLOBALS["conn"]->query($sql);

if($result->num_rows > 0){
    while ($row = $result->fetch_assoc()) {
        // STORE DATA IN JSON VARIABLE        
       array_push($json_res["hotel_list"],$row);
    }
    echo json_encode($json_res);
}else {
    echo 0;
}
?>