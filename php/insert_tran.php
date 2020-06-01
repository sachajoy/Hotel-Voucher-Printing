<?php
ini_set('max_execution_time', 30000);
require 'connection.php';
require 'select_last_id.php';

    // function to insert when the 
    function tran_insert_function($tran_data){
//        echo "done tran 1";
        $res = array();
        $tran_id = get_last_id('tran')+1;
            $sql = "INSERT INTO `tran`(`id`, `hotel_booking_id`,"
                    ." `booking_id`, `cust_id`, `hotel_id`,`room_count`,"
                    ." `chk_in_date`, `chk_out_date`, `cancel_policy`"
                    .",`adults`,`child`,`total`,`inclusion`,`booking_company`,`booking_date`,"
                    ."`res_days`, `remarks`,`amount`)"
                    ." VALUES ('".$tran_id."', '".$tran_data->htl_bk_id."',".
                    " '".$tran_data->bk_id."', '".$tran_data->mst_guest_name->id."', ".$tran_data->hotel_id->id.", '".$tran_data->room_count."',"
                    ." '".$tran_data->chk_in_date."', '".$tran_data->chk_out_date."', '".$tran_data->cancel_pol."',".
                    "".$tran_data->adult_count.",".$tran_data->child_count.",".$tran_data->total.",'".$tran_data->inclusion."','".$tran_data->booking_company."','".$tran_data->booking_date."',"
                    ."datediff('".$tran_data->chk_out_date."','".$tran_data->chk_in_date."'),'".$tran_data->remarks."','".$tran_data->amt."')";
//              echo $sql;
            $result = $GLOBALS["conn"]->query($sql);
            if ($result) {
                $res['result'] = 1;
                $res['tran_id'] = $tran_id;
//                echo "done tran";
                return $res;
            } else {
                $res['result'] = 0;
                $res['error']= $GLOBALS['conn']->error;
                return $res;
            }
    }
  
     function tran_det_insert_function_room_type($tran_id,$tran_det_data){
            $tran_det_id = get_last_id('tran_det') + 1;
            $sql = "INSERT INTO `tran_det`"
                    ." (`id`, `tran_id`,"
                    ." `room_type`, `meal_plan`)"
                    ." VALUES ('".$tran_det_id."', '".$tran_id."',"
                    ." '".$tran_det_data->room_type."', '".$tran_det_data->meal_plan."')";
//             echo $sql;
            $result = $GLOBALS["conn"]->query($sql);
            if ($result) {
                $commit  = $GLOBALS["conn"]->query("COMMIT");
                if ($commit){
                    return 1;
                }
            }else {
                return 0;
            }
        // if(isset($tran_det->room_det[0]->name_list[1]->name) and $tran_det->room_det[0]->name_list[1]->name != ''){
        //     echo 1;
        // }else{
        //     echo 0;
        // }
    }
    function tran_det_insert_function_room_det($tran_id,$meal_plan,$ext_bed,$room_type,$tran_det_data,$tran_det_test,$i)
    {
        $tran_det_id = get_last_id('tran_det') + 1;
        $guest_id = get_last_id('guest_list') + 1;
        $sql = "INSERT INTO `tran_det`"
        ." (`id`, `tran_id`,"
        ." `room_type`, `meal_plan`,`ext_bed`)"
        ." VALUES ('".$tran_det_id."', '".$tran_id."',"
        ." '".$room_type."', '".$meal_plan."','".$ext_bed."')";
        // $room_count -= 1;
//            echo $sql;
        $result = $GLOBALS["conn"]->query($sql);
        if ($result)
        {
            //echo "adding guest";
            $count = 0;
//                //  echo $tran_det_data->room_det[$i]->name_list[$count]->name;
            while ($count < 4)
            {
                //echo json_encode($tran_det_test->room_det[$count]);
                $chk = $tran_det_data->name_list[$count]->name;
//                    echo $chk;
                if ($chk != "")
                {
//                        echo "1";
                    //$guest_id = get_last_id('guest_list') + 1;
                    $sql = "INSERT INTO `guest_list` (`id`, `tran_det_id`, "
                        . "`guest_type`, `guest__name`,`guest_age`, `tran_id`) "
                        . "VALUES ('" . $guest_id . "', '" . $tran_det_id . "',"
                        . " '" . $tran_det_data->name_list[$count]->cat . "',"
                        . " '" . $tran_det_data->name_list[$count]->name . "', '" . $tran_det_data->name_list[$count]->age . "', '". $tran_id ."')";
                    //echo $sql;
                    $result = $GLOBALS["conn"]->query($sql);
                    $guest_id += 1;
                    if (!$result)
                    {
                        $rollback = $GLOBALS["conn"]->query("ROLLBACK");
                        if ($rollback){
                            return 0;
                        }
                    }
                }
                $count = $count + 1;
            }
            $commit = $GLOBALS["conn"]->query("COMMIT");
            if ($commit){
                return 1;
            }
        }
        else
        {
            $rollback = $GLOBALS["conn"]->query("ROLLBACK");
            if ($rollback){
                return 0;
            }
        }
        // echo $sql;
    }


// $test = new tran;
// $test->get_id();
?>