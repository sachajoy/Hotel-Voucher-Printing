<?php
ini_set('max_execution_time', 30000);

require 'connection.php';
require 'insert_tran.php';
//echo $id;
$recived = json_decode(file_get_contents("php://input"));
$json_res = array();
$sql = "START TRANSACTION";
$result = $conn->query($sql);
if ($result) {
    $query_res = tran_insert_function($recived);
//echo json_encode($query_res);
    if ($query_res['result']) {
// echo "query done";
        if ($recived->guestPresent == 1) {
//   echo "guest prensent";
            $room_count = sizeof($recived->room_det);
            $i = 0;
            while ($i < $room_count) {
//       echo "adding";
                $query_res_tran = tran_det_insert_function_room_det($query_res['tran_id'], $recived->room_det[$i]->meal_plan,
                    $recived->room_det[$i]->ext_bed, $recived->room_det[$i]->room, $recived->room_det[$i], $recived, $i);
                $i++;
            }
        } else {
//   echo "2 called";
            $query_res_tran = tran_det_insert_function_room_type($query_res['tran_id'], $recived);
        }
        echo $query_res_tran;
    } else {
        $sql = "ROLLBACK ";
        $result = $conn->query($sql);
    }
}

?>





