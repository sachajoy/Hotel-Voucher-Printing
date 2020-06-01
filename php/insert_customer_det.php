<?php
require 'connection.php';
require 'select_last_id.php';

//recevie the data
$recived = json_decode(file_get_contents("php://input"));
//json output varable
$json_output = array('success'=>1);
//fetch the last id
$id = get_last_id("cust_mst") + 1;
$result = $conn->query("START TRANSACTION");
//echo $id;
$sql = "INSERT INTO `cust_mst` "
        ."(`id`, `fname`, `mname`, `lname`,"
        ." `pass_no`, `place_of_birth`, `place_of_issue`, `expriy_date`, "
        ."`dob`, `gender`, `f_name`, `m_name`, `title`, "
        ."`gst_no`, `pan_no`, `email_id`, "
        ."`add1`, `add2`, `phn_no`,"
        ."`nationality`,`issue_date`,`spouse_name`)"
        ."VALUES ('".$id."', '".$recived->f_name."', '".$recived->m_name."', '".$recived->l_name."',"
        ." '".$recived->pass_no."', '".$recived->place_of_birth."', '".$recived->place_of_issue."', '".$recived->exp_date."', "
        ."'".$recived->dob."', '".$recived->gender."', '".$recived->fname."', '".$recived->mname."', '".$recived->title."',"
        ." '".$recived->gst_no."', '".$recived->pan_no."', '".$recived->email_id."', "
        ."'".$recived->add1."', '".$recived->add2."', '".$recived->phn_no."',"
        ." '".$recived->nation."','".$recived->issue_date."','".$recived->spouse."');";
//echo $sql;
$result = $conn->query($sql);

if ($result){
    if (sizeof($recived->airlines) > 0){
        $count = sizeof($recived->airlines);
        $i = 0;
        while ($i < $count){
            $air_id = get_last_id("cust_airline_det")+1;
            $sql = "INSERT INTO cust_airline_det".
                "(id , cust_id , xname,".
                " mem, pass)".
                "VALUES('".$air_id."','".$id."','".$recived->airlines[$i]->name."',".
                "'".$recived->airlines[$i]->mem."','".$recived->airlines[$i]->pass."')";
//            echo $sql;
            $result = $conn->query($sql);
            if (!$result){
                $result = $conn->query("ROLLBACK");
                $json_output['success'] = 0;
                break;
            }
            $i++;
        }
    }
    if ($json_output['success'] == 1){
        $result = $conn->query("COMMIT");
        echo json_encode($json_output);
    }
}else{
    echo 0;

}
?>