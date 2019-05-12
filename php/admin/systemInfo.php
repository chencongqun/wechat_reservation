<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	include_once("../lib/error.php");
	include_once("../lib/customerDB.php");
	
	
	$obj = new systemInfoInterface();
	$obj->dispatcher();
	
	class systemInfoInterface
	{
		private $adminInfo;
		public function dispatcher()
		{
			global $ERROR_SESSION_EXPIRED;
			if ( session_auth_ex() != true )
				return;
				
			$mongoObj = new adminDB();
			$this->adminInfo = $mongoObj->getBySession(session_id_get());
			
			if ( $this->adminInfo == NULL )
			{
				$array_output['code'] = $ERROR_SESSION_EXPIRED;
				$array_output['msg'] = "Session has expired";
				echo json_encode($array_output);
				return;
			}
			
			$opt = fcgi_getvar("opt");
			if ( $opt == "getSystemInfo" )
				$this->getSystemInfo();
			else if ( $opt == "getUnauthOrder" )
				$this->getUnauthOrder();
		}
		
		public function getSystemInfo()
		{
			$array_output['data'] = $this->adminInfo;
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		
		public function getUnauthOrder()
		{
			$orderObj = new orderDB($this->adminInfo["dbname"]);
			$count = $orderObj->ordersCount(array("status"=>0));
			$array_output['count'] = $count;
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
	}
	
	
?>