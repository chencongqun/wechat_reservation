<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	include_once("../lib/customerDB.php");
	include_once("../lib/error.php");
	include_once("../lib/wechat.php");
	
	$obj = new customerInterface();
	$obj->dispatcher();
	
	class customerInterface
	{
		private $dbname = null;
		private $openid = null;
		public function dispatcher()
		{
			$this->dbname = fcgi_getvar("shopinfo");
			$this->openid = fcgi_getvar("openid");
			
			$opt = fcgi_getvar("opt");
			if ( $opt == "getDishes" )
				$this->getDishes();
			else if ( $opt == "getCategory" )
				$this->getCategory();
			else if ( $opt == "getCustomerInfo" )
				$this->getCustomerInfo();
			else if ( $opt == "getSystemInfo" )
				$this->getSystemInfo();
			else if ( $opt == "getOrderList" )
				$this->getOrderList();
			else if ( $opt == "getOrderInfo" )
				$this->getOrderInfo();
			else if ( $opt == "getOpenid" )
				$this->getOpenid();
		}
		
		public function getCategory()
		{
			$mongoObj = new categoryDB();
			$data = $mongoObj->getCategory($this->dbname, 0, 20);
			echo json_encode($data);
		}
		
		public function getDishes()
		{
			$type = fcgi_getvar("type");
			$mongoObj = new dishesDB();
			$queryArray['class'] = $type;
			$queryArray['$or'] = array( array( "status"=>"1" ), array ( "status" => array('$exists'=>0) ) );
			$data = $mongoObj->getDishes($this->dbname, $queryArray, 0, 0);
			echo json_encode($data);
		}
		
		public function getCustomerInfo()
		{
			$mongoObj = new customerDB($this->dbname);
			$data = $mongoObj->getCustomerByOpenid($this->openid);
			echo json_encode($data);
		}
		
		public function getSystemInfo()
		{
			$dbObj = new configDb($this->dbname);
			$data = $dbObj->getSystemInfo();
			if ( $data != null )
			{
				$array_output['data'] = $data;
			}
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function getOrderList()
		{
			$data = null;
			$queryArray["openid"] = $this->openid;
			
			$mongoObj = new orderDB($this->dbname);
			$count = $mongoObj->ordersCount($queryArray);
			$skip = 0;
			if ( $count > 10 )
				$skip = $count - 10;
			$data = $mongoObj->getOrders( $queryArray, $skip, 0 );
			$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function getOrderInfo()
		{
			$id = fcgi_getvar("id");
			$orderObj = new orderDB($this->dbname);
			$data = $orderObj->getOrderById($id);
			if ( $data != null )
				$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
			return;	
		}
		
		public function getOpenid()
		{
			$code = fcgi_getvar("code");
			$openid = getOpenId($code);
			if ( $openid == NULL )
				error_log("[getOpenid] invalid code!",0);
			$array_output['code'] = 0;
			$array_output['openid'] = $openid;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
	}
?>