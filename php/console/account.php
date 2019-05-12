<?php
	include_once("../lib/public.php");
	include_once("../lib/consoledb.php");
	include_once("../lib/error.php");
	
	$dishesObj = new accountManager();
	$dishesObj->dispatcher();
	
	class accountManager
	{
		private $pageNum = 20;
		private $adminInfo;
		public function dispatcher()
		{
			global $ERROR_SESSION_EXPIRED;
			if ( session_auth_ex() != true )
				return;
				
			$mongoObj = new consoleAccountDB();
			$this->adminInfo = $mongoObj->getBySession(session_id_get());
			
			if ( $this->adminInfo == NULL )
			{
				$array_output['code'] = $ERROR_SESSION_EXPIRED;
				$array_output['msg'] = "Session has expired";
				echo json_encode($array_output);
				return;
			}
			
			$opt = fcgi_getvar("opt");
			if ( $opt == "addAccount" )
				$this->addAccount();
			else if ( $opt == "getAccountList" )
				$this->getAccountList();
			else if ( $opt == "getAccountInfo" )
				$this->getAccount();
			else if ( $opt == "renewal" )
				$this->renewal();
			else if ( $opt == "editAccount" )
				$this->editAccount();
		}
		public function addAccount()
		{
			$data["companyName"] = fcgi_postvar("companyName");
			$data["remark"] = fcgi_postvar("remark");
			$data["address"] = fcgi_postvar("address");
			$data["accountType"] = fcgi_postvar("accountType");
			$data["city"] = fcgi_postvar("city");
			$data["district"] = fcgi_postvar("district");
			$data["registerDate"] = time();
			$data["smNum"] = 0;
			$data["tenancy"] = 0;
			
			$mongoObj = new exAdminDB();
			$retValue = $mongoObj->createAdmin($data);
			if( $retValue )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = -1;
				$array_output['msg'] = "failed";
			}
			echo json_encode($array_output);
 		}
		public function getAccountList()
		{
			$data = null;
			$queryArray = NULL;
			$pageCurrent = fcgi_getvar("page");
			if ( $pageCurrent == NULL )
				$pageCurrent = 1;
			$companyName = fcgi_getvar("companyName");
			$address = fcgi_getvar("address");
			$accountType = fcgi_getvar("accountType");
			if ( $companyName !=NULL || $address != NULL  || $accountType != NULL )
			{
				$queryArray = array();
				$companyNameReg = new MongoRegex("/".$companyName."/");
				$addressReg = new MongoRegex("/".$address."/");
				if ( $companyName !=NULL  )
					$queryArray['companyName'] = $companyNameReg;
				if ( $address != NULL )	
					$queryArray['address'] = $addressReg;
				if ( $accountType != NULL )	
					$queryArray['accountType'] = $accountType;
			}
			
			$mongoObj = new exAdminDB();
			
			$totalNum = $mongoObj->adminCount($queryArray);
			$skip = $totalNum - $pageCurrent*($this->pageNum);
			$need = $this->pageNum;
			if ( $skip <= 0 )
			{
				$need += $skip;
				$skip = 0;
			}
			$data = $mongoObj->getAccounts($queryArray, $skip, $need);
			
			$array_output['total'] = $totalNum;
			$array_output['data'] = $data;
			echo json_encode($array_output);
		}
		
		public function getAccount()
		{
			$id = fcgi_getvar("id");
			if ( $id == NULL )
			{
				$array_output['code'] = -1;
				$array_output['msg'] = "Failed";
				echo json_encode($array_output);
				return;
			}
			$mongoObj = new exAdminDB();
			$data = $mongoObj->getAccountById($id);
			$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		public function editAccount()
		{
			$id = fcgi_postvar("id");
			$data["companyName"] = fcgi_postvar("companyName");
			$data["remark"] = fcgi_postvar("remark");
			$data["address"] = fcgi_postvar("address");
			$data["accountType"] = fcgi_postvar("accountType");
			$data["city"] = fcgi_postvar("city");
			$data["district"] = fcgi_postvar("district");
			
			$mongoObj = new exAdminDB();
			$retValue = $mongoObj->editAccount($id, $data);
			if( $retValue )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = -1;
				$array_output['msg'] = "failed";
			}
			echo json_encode($array_output);
		}
		public function renewal()
		{
			$id = fcgi_postvar("id");
			$data["smNum"] = fcgi_postvar("smNum");
			$data["tenancy"] = fcgi_postvar("tenancy");
			
			$mongoObj = new exAdminDB();
			$retValue = $mongoObj->renewal($id, $data);
			if( $retValue )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = -1;
				$array_output['msg'] = "failed";
			}
			echo json_encode($array_output);
			
		}
		
	}

?>