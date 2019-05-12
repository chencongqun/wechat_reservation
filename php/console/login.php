<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	include_once("../lib/consoledb.php");
	
	$authObj = new consoleAuthInterface();
	$authObj->auth();
	class consoleAuthInterface
	{
		public function auth()
		{
			$authed = -1;
			$username_in = fcgi_getvar("username");
			$password_in = fcgi_getvar("password");
			$mongoObj = new consoleAccountDB();
			$account = $mongoObj->getAdminUser($username_in);
			if ( NULL != $account )
			{
				$password = $account['password'];
				$password = utf8_decode($password);
				$password = md5($password);
				$array_output = array();
				if ( $password == $password_in )
					$authed = 0;
				else
					$authed = -2;
			}
			
			if ( $authed != 0 )
			{
				//echo "auth employee";
			}
			
			if ( $authed == 0 )
			{
				session_create();
				$mongoObj->updateSession($username_in, session_id_get());
				$array_output['msg'] = "success";
			}
			else
				$array_output['msg'] = "failed";
			$array_output['code'] = $authed;
			echo json_encode($array_output);
		}
	}
?>