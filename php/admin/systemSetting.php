<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	include_once("../lib/wechat.php");
	include_once("../lib/error.php");
	
	$systemObj = new systemSetInterface();
	$systemObj->dispatcher();
	
	class systemSetInterface
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
			if ( $opt == "setPublicAccount" )
				$this->setPublicAccount();
			else if ( $opt == "getPublicAccount" )
				$this->getPublicAccount();
			else if ( $opt == "setUserDefinedMenu" )
				$this->setUserDefinedMenu();
			else if ( $opt == "getUserDefinedMenu" )
				$this->getUserDefinedMenu();
			else if ( $opt == "setAutoResponse" )
				$this->setAutoResponse();
			else if ( $opt == "getAutoResponse" )
				$this->getAutoResponse();
			else if ( $opt == "getSystemInfo" )
				$this->getSystemInfo();
			else if ( $opt == "setSystemInfo" )
				$this->setSystemInfo();
			else if ( $opt == "setShortMessage" )
				$this->setShortMessage();
			else if ( $opt == "getShortMessage" )
				$this->getShortMessage();
			else if ( $opt == "getPrinterInfo" )
				$this->getPrinterInfo();
			else if ( $opt == "setPrinterInfo" )
				$this->setPrinterInfo();
		}
		
		public function setPublicAccount()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			if ( fcgi_getvar("account") != null )
				$data['account'] = fcgi_getvar("account");
			if ( fcgi_getvar("password") != null )
				$data['password'] = fcgi_getvar("password");
			$dbObj->setPublicAccount($data);
			updateToken($this->adminInfo['dbname']);
			createMenu($this->adminInfo['dbname']);
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function getPublicAccount()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			$data = $dbObj->getPublicAccount();
			if ( $data != null )
				$array_output['account'] = $data['account'];
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function setUserDefinedMenu()
		{
			$data = array();
			for ( $i=0;$i<3;$i++ )
			{
				$data[$i]['name'] = fcgi_postvar("name".$i);
				$data[$i]['type'] = fcgi_postvar("type".$i);
				$data[$i]['standardValue'] = fcgi_postvar("standardValue".$i);
				$data[$i]['urlValue'] = fcgi_postvar("urlValue".$i);
			}
			$data["shopInfo"] = fcgi_postvar("shopInfo");
			$data["userNotice"] = fcgi_postvar("userNotice");
			$dbObj = new configDb($this->adminInfo['dbname']);
			$dbObj->setUserDefinedMenu($data);
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function getUserDefinedMenu()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			$data = $dbObj->getUserDefinedMenu();
			if ( $data != null )
				$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function setAutoResponse()
		{
			try
			{
				global $CUSTOMER_HOME_PATH;
				$data['name'] = fcgi_postvar("name");
				$data['keyword'] = fcgi_postvar("keyword");
				$data['type'] = fcgi_postvar("type");
				if ( $data['type'] == "text" )
				{
					$data['textContent'] = fcgi_postvar("textContent");
				}
				else
				{
					$data['mediaTitle'] = fcgi_postvar("mediaTitle");
					$data['mediaContent'] = fcgi_postvar("mediaContent");
					if (  in_array("name", $_FILES["picture"]) &&  $_FILES["picture"]["name"]!="")
					{
						$data['mediaPicture'] = $_FILES["picture"]["name"];
						$imagesPath = $CUSTOMER_HOME_PATH.$this->adminInfo['dbname']."/images/";
						check_dir($imagesPath);
						rename( $_FILES["picture"]["tmp_name"], $imagesPath.$_FILES["picture"]["name"] );
					}
				}
				$dbObj = new configDb($this->adminInfo['dbname']);
				$dbObj->setAutoResponse($data);
				$array_output['code'] = 0;
				$array_output['msg'] = "Success";
				echo json_encode($array_output);
			}
			catch( Exception $e)
			{
				error_log($e->getMessage(), 0);
				return;
			}
		}
		
		public function getAutoResponse()
		{
			global $CUSTOMER_HOME_PATH;
			$dbObj = new configDb($this->adminInfo['dbname']);
			$data = $dbObj->getAutoResponse();
			if ( $data != null )
			{
				$data['imagesPath'] = "../customer/".$this->adminInfo['dbname']."/images/";
				$array_output['data'] = $data;
			}
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		public function setSystemInfo()
		{
			try
			{
				global $CUSTOMER_HOME_PATH;
				$data = array();
				if ( fcgi_postvar("title") != NULL )
					$data['title'] = fcgi_postvar("title");
				if ( fcgi_postvar("phone") != NULL )
					$data['phone'] = fcgi_postvar("phone");
				if ( fcgi_postvar("shopInfo") != NULL )
					$data['shopInfo'] = fcgi_postvar("shopInfo");
				if ( fcgi_postvar("userNotice") != NULL )
					$data['userNotice'] = fcgi_postvar("userNotice");
				if (   in_array("name", $_FILES["picture"]) &&  $_FILES["picture"]["name"]!="")
				{
					$data['cover'] = $_FILES["picture"]["name"];
					$imagesPath = $CUSTOMER_HOME_PATH.$this->adminInfo['dbname']."/images/";
					check_dir($imagesPath);
					rename( $_FILES["picture"]["tmp_name"], $imagesPath.$_FILES["picture"]["name"] );
				}
				
				$dbObj = new configDb($this->adminInfo['dbname']);
				$dbObj->setSystemInfo($data);
				$array_output['code'] = 0;
				$array_output['msg'] = "Success";
				echo json_encode($array_output);
			}
			catch( Exception $e)
			{
				error_log($e->getMessage(), 0);
				return;
			}
		}
		
		public function getSystemInfo()
		{
			global $CUSTOMER_HOME_PATH;
			$dbObj = new configDb($this->adminInfo['dbname']);
			$data = $dbObj->getSystemInfo();
			if ( $data != null )
			{
				$data['imagesPath'] = "../customer/".$this->adminInfo['dbname']."/images/";
				$array_output['data'] = $data;
			}
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function setShortMessage()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			if ( fcgi_getvar("status") != null )
				$data['status'] = fcgi_getvar("status");
			if ( fcgi_getvar("telephone") != null )
				$data['telephone'] = fcgi_getvar("telephone");
			$dbObj->setShortMessage($data);
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function getShortMessage()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			$data = $dbObj->getShortMessage();
			if ( $data != null )
				$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function getPrinterInfo()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			$data = $dbObj->getPrinterInfo();
			if ( $data != null )
				$array_output['data'] = $data;
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
		public function setPrinterInfo()
		{
			$dbObj = new configDb($this->adminInfo['dbname']);
			if ( fcgi_getvar("status") != null )
				$data['status'] = fcgi_getvar("status");
			if ( fcgi_getvar("printType") != null )
				$data['printType'] = fcgi_getvar("printType");
			if ( fcgi_getvar("machine_code") != null )
				$data['machine_code'] = fcgi_getvar("machine_code");
			if ( fcgi_getvar("machine_key") != null )
				$data['machine_key'] = fcgi_getvar("machine_key");
			$dbObj->setPrinterInfo($data);
			$array_output['code'] = 0;
			$array_output['msg'] = "Success";
			echo json_encode($array_output);
		}
		
	}

?>