<?php
	include_once("lib/public.php");
	$adminAuthObj = new adminAuthInterface();
	$adminAuthObj->auth();
	class adminAuthInterface
	{
		public function auth()
		{
			try
			{
			//$username = fcgi_getvar("username");
			//$password = fcgi_getvar("password");
			$conn = new Mongo("mongodb://admin:ccq245722@localhost");
			$db = $conn->admin;
			$collection = $db->manager;
			$data = array(
				"username"=>"testAdmin",
				"password"=>"111111",
				"appid"=>"app1",
				"dbname"=>"testDb"
			);
			$collection->insert($data);
			}catch(Exception $e){
				error_log($e->getMessage(), 0);
			}
		}
	}
?>
