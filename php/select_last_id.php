<?php
require 'connection.php';
function get_last_id($name) {
     $sql = "select id from ".$name." order by id desc limit 1;";
     $result = $GLOBALS["conn"]->query($sql);
     if ($result->num_rows > 0 ){
         $row = $result->fetch_assoc();
         return $row['id'];
     }
     return 0;

}
