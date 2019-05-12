<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	
	changePassword();
	
	function changePassword()
	{
		$success = -1;
		$mongoObj = new adminDB();
		$old_pass = fcgi_getvar("oldpass");
		$new_pass = fcgi_getvar("newpass");
		
		if ( session_auth() != true )
		{
			$array_output['code'] = -101;
			$array_output['msg'] = "Session has expired";
			echo json_encode($array_output);
			return;
		}
		
		$mongoObj = new adminDB();
		$data = $mongoObj->getBySession(session_id_get());
		if ($old_pass!=NULL && $new_pass!=NULL && $data!=NULL && $old_pass == $data['password'] )
		{
			$mongoObj->updatePassword($data['username'], $new_pass);
			$success = 0;
		}
		
		$array_output['code'] = $success;
		if ( $success == 0 )
			$array_output['msg'] = "success";
		else
			$array_output['msg'] = "failed";
		echo json_encode($array_output);
	}

?>