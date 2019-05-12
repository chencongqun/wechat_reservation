<?php
	include_once("../lib/public.php");
	session_drop();
	$array_output['code'] = 0;
	$array_output['msg'] = "success";
	echo json_encode($array_output);
?>