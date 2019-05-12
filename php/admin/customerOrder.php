<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	include_once("../lib/customerDB.php");
	include_once("../lib/error.php");
	include_once("../lib/orderOpt.php");
	include_once("../lib/printer.php");
	
	$obj = new customerOrderInterface();
	$obj->dispatcher();
	
	class customerOrderInterface
	{
		private $pageNum = 20;
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
			if ( $opt == "getCustomerList" )
				$this->getCustomerList();
			else if ( $opt == "delCustomers" )
				$this->delCustomers();
			else if ( $opt == "delallCustomers" )
				$this->delallCustomers();
			else if ( $opt == "getOrderList" )
				$this->getOrderList();
			else if ( $opt == "delOrders" )
				$this->delOrders();
			else if ( $opt == "delallOrders" )
				$this->delallOrders();
			else if ( $opt == "checkOrder" )
				$this->checkOrder();
			else if ( $opt == "getOrderInfo" )
				$this->getOrderInfo();
			else if ( $opt == "getOrderStatiInfo" )
				$this->getOrderStatiInfo();
		}
		
		public function getCustomerList()
		{
			$data = null;
			$queryArray = NULL;
			$pageCurrent = fcgi_getvar("page");
			if ( $pageCurrent == NULL )
				$pageCurrent = 1;
			$phone = fcgi_getvar("phone");
			$address = fcgi_getvar("address");
			$mongoObj = new customerDB($this->adminInfo['dbname']);
			if ( $phone !=NULL || $address != NULL )
			{
				$queryArray = array();
				$phoneReg = new MongoRegex("/".$phone."/");
				$addressReg = new MongoRegex("/".$address."/");
				if ( $phone !=NULL  )
					$queryArray['phone'] = $phoneReg;
				if ( $address != NULL )	
					$queryArray['address'] = $addressReg;
			}
			$data = $mongoObj->getCustomers($queryArray, ($pageCurrent-1)*($this->pageNum), $this->pageNum);
			$array_output['total'] = $mongoObj->customersCount($queryArray);
			$array_output['data'] = $data;
			echo json_encode($array_output);
		}
		
		public function delCustomers()
		{
			do
			{
				$customerObj = new customerDB($this->adminInfo['dbname']);
				$parameter = fcgi_postvar("id");
				if ( $parameter == NULL )
					break;
				$paras = split(",", $parameter);
				if ( $paras == NULL )
					break;
				$length = sizeof($paras);
				for ( $i=0; $i<$length; $i++ )
				{
					$customerObj->delCustomerById( $paras[$i] );
				}
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
				echo json_encode($array_output);
				return;
			}while(0);
			$array_output['code'] = -1;
			$array_output['msg'] = "failed";
			echo json_encode($array_output);
		}
		
		public function delallCustomers()
		{
			$customerObj = new customerDB($this->adminInfo['dbname']);
			$customerObj->delAllCustomers();
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		
		public function getOrderList()
		{
			$data = null;
			$queryArray = NULL;
			$pageCurrent = fcgi_getvar("page");
			if ( $pageCurrent == NULL )
				$pageCurrent = 1;
			$phone = fcgi_getvar("phone");
			$address = fcgi_getvar("address");
			$status = fcgi_getvar("status");
			if ( $phone !=NULL || $address != NULL  || $status != NULL )
			{
				$queryArray = array();
				$phoneReg = new MongoRegex("/".$phone."/");
				$addressReg = new MongoRegex("/".$address."/");
				if ( $phone !=NULL  )
					$queryArray['phone'] = $phoneReg;
				if ( $address != NULL )	
					$queryArray['address'] = $addressReg;
				if ( $status != NULL )	
					$queryArray['status'] = (int)$status;
			}
			
			$mongoObj = new orderDB($this->adminInfo['dbname']);
			$totalNum = $mongoObj->ordersCount($queryArray);
			$skip = $totalNum - $pageCurrent*($this->pageNum);
			$need = $this->pageNum;
			if ( $skip <= 0 )
			{
				$need += $skip;
				$skip = 0;
			}
			$data = $mongoObj->getOrders($queryArray, $skip, $need);
			$array_output['total'] = $totalNum;
			$array_output['data'] = $data;
			echo json_encode($array_output);
		}
		
		public function delOrders()
		{
			do
			{
				$customerObj = new orderDB($this->adminInfo['dbname']);
				$parameter = fcgi_postvar("id");
				if ( $parameter == NULL )
					break;
				$paras = split(",", $parameter);
				if ( $paras == NULL )
					break;
				$length = sizeof($paras);
				for ( $i=0; $i<$length; $i++ )
				{
					$customerObj->delOrderById( $paras[$i] );
				}
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
				echo json_encode($array_output);
				return;
			}while(0);
			$array_output['code'] = -1;
			$array_output['msg'] = "failed";
			echo json_encode($array_output);
		}
		
		public function delallOrders()
		{
			$customerObj = new orderDB($this->adminInfo['dbname']);
			$customerObj->delAllOrders();
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		
		public function checkOrder()
		{
			do
			{
				$id = fcgi_getvar("id");
				$status = fcgi_getvar("type");
				$message = fcgi_getvar("shopResponse");
				if ( $id == NULL || $status == NULL )
					break;
				handleOrder($this->adminInfo['dbname'], $id, $status, $message);
				printOrderWhenAuth($this->adminInfo['dbname'], $id);
				$array_output['id'] = $id;
				$array_output['status'] = $status;
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
				echo json_encode($array_output);
				return;	
			}while(0);
			$array_output['id'] = $id;
			$array_output['status'] = 0;
			$array_output['code'] = -1;
			$array_output['msg'] = "failed";
			echo json_encode($array_output);
		}
		
		public function getOrderInfo()
		{
			$id = fcgi_getvar("id");
			$orderObj = new orderDB($this->adminInfo['dbname']);
			$data = $orderObj->getOrderById($id);
			if ( $data != null )
				$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
			return;	
		}
		
		public function getOrderStatiInfo()
		{
			$month = fcgi_getvar("month");
			$curMonth = (int) date("m",time());
			$year = (int) date("Y",time());
			if ( $month > $curMonth )
				$year -= 1;
			$nextYear = $year;
			$nextMonth = $month + 1;
			if ( $nextMonth > 12 )
			{
				$nextMonth -= 12;
				$nextYear += 1;
			}
			$startTime = mktime(0,0,0,$month,1,$year);
			$endTime = mktime(0,0,0,$nextMonth,1,$nextYear);
			
			$orderObj = new orderDB($this->adminInfo['dbname']);
			$totalCount = 0;
			$filedArray = array( "time"=>true,"totalPrice"=>true,"status"=>true );
			$queryArray = array( "time"=>array('$gt'=>$startTime, '$lt'=>$endTime) );
			
			$allData = $orderObj->getOrdersEx( NULL, $filedArray );
			$curMonthData = $orderObj->getOrdersEx( $queryArray, $filedArray );
			
			$totalPrice = 0;
			foreach ( $allData as $item )
			{
				if ( (int)$item["status"] == 1 )
				{
					$totalPrice += (int)$item["totalPrice"];
					$totalCount += 1;
				}
			}
			
			$array_output['totalCount'] = $totalCount;
			$array_output['totalPrice'] = $totalPrice;
			$array_output['data'] = $curMonthData;
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		
	}

?>