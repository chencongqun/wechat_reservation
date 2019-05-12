<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	include_once("../lib/error.php");
	
	$dishesObj = new dishesManager();
	$dishesObj->dispatcher();
	
	class dishesManager
	{
		private $pageNum = 20;
		private $adminInfo;
		function dispatcher()
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
			
			//if ( $_SERVER['REQUEST_METHOD'] == 'GET' )
			$opt = fcgi_getvar("opt");
			if ( $opt == "getCategoryList" )
				$this->getCategoryList();
			else if ( $opt == "delCategory" )
				$this->delCategory();
			else if ( $opt == "delallCategory" )
				$this->delallCategory();
			else if ( $opt == "getCategoryInfo" )
				$this->getCategoryInfo();
			else if ( $opt == "addCategory" )
				$this->addCategory();
			else if ( $opt == "editCategory" )
				$this->editCategory();
			else if ( $opt == "getDishesList" )
				$this->getDishesList();
			else if ( $opt == "delDishes" )
				$this->delDishes();
			else if ( $opt == "delallDishes" )
				$this->delallDishes();
			else if ( $opt == "getCategoryNameList" )
				$this->getCategoryNameList();
			else if ( $opt == "getDishInfo" )
				$this->getDishInfo();
			else if ( $opt == "addDish" )
				$this->addDish();
			else if ( $opt == "editDish" )
				$this->editDish();
			else if ( $opt == "setStatus" )
				$this->setStatus();
			else if ( $opt == "backup" )
				$this->backup();
			else if ( $opt == "import" )
				$this->import();
		}
		function getCategoryList()
		{
			$pageCurrent = fcgi_getvar("page");
			if ( $pageCurrent == NULL )
				$pageCurrent = 1;
			
			$mongoObj = new categoryDB();
			$data = $mongoObj->getCategory($this->adminInfo['dbname'], ($pageCurrent-1)*($this->pageNum), $this->pageNum);
			$array_output['total'] = $mongoObj->categoryCount($this->adminInfo['dbname']);
			$array_output['data'] = $data;
			echo json_encode($array_output);
		}
		function getCategoryInfo()
		{
			$id = fcgi_getvar("id");
			$mongoObj = new categoryDB();
			$data = $mongoObj->getCategoryById($this->adminInfo['dbname'], $id);
			echo json_encode($data);
		}
		function addCategory()
		{
			global $ERROR_NAME_EXISTED;
			$ret = false;
			$array_output = array();
			do
			{
				$data['name'] = fcgi_postvar("name");
				$data['desc'] = fcgi_postvar("desc");
				$data['priority'] = fcgi_postvar("priority");
				$data['dishesNum'] = 0;
				if ( $data['name'] == null )
					break;
				$mongoObj = new categoryDB();
				$ret = $mongoObj->addCategory( $this->adminInfo['dbname'], $data );
			}while(0);
			if ( $ret )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = $ERROR_NAME_EXISTED;
				$array_output['msg'] = "name existed";
			}
			echo json_encode($array_output);
		}
		function editCategory()
		{
			global $ERROR_NAME_EXISTED;
			$ret = false;
			$array_output = array();
			do
			{
				$data['name'] = fcgi_postvar("name");
				$data['desc'] = fcgi_postvar("desc");
				$data['priority'] = fcgi_postvar("priority");
				if ( $data['name'] == null )
					break;
				$id = fcgi_postvar("id");
				$mongoObj = new categoryDB();
				$ret = $mongoObj->editCategory( $this->adminInfo['dbname'], $id, $data );
			}while(0);
			if ( $ret )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = $ERROR_NAME_EXISTED;
				$array_output['msg'] = "name existed";
			}
			echo json_encode($array_output);
		}
		function delCategory()
		{
			do
			{
				$dishesObj = new categoryDB();
				$parameter = fcgi_postvar("id");
				if ( $parameter == NULL )
					break;
				$paras = split(",", $parameter);
				if ( $paras == NULL )
					break;
				$length = sizeof($paras);
				for ( $i=0; $i<$length; $i++ )
				{
					$dishesObj->delCategoryById($this->adminInfo['dbname'], $paras[$i]);
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
		function delallCategory()
		{
			$dishesObj = new categoryDB();
			$dishesObj->delAllCategory($this->adminInfo['dbname']);
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		function getDishesList()
		{
			$data = null;
			$totalNum = 0;
			$pageCurrent = fcgi_getvar("page");
			if ( $pageCurrent == NULL )
				$pageCurrent = 1;
			$name = fcgi_getvar("name");
			$type = fcgi_getvar("type");
			$mongoObj = new dishesDB();
			if ( $name !=NULL || $type != NULL )
			{
				$queryArray = array();
				$nameReg = new MongoRegex("/".$name."/");
				$typeReg = new MongoRegex("/".$type."/");
				if ( $name !=NULL  )
					$queryArray['name'] = $nameReg;
				if (  $type != NULL )	
					$queryArray['class'] = $typeReg;
				$data = $mongoObj->getDishes($this->adminInfo['dbname'], $queryArray, ($pageCurrent-1)*($this->pageNum), $this->pageNum);
				$totalNum = $mongoObj->dishesCount($this->adminInfo['dbname'], $queryArray);
			}
			else
			{
				$data = $mongoObj->getDishes($this->adminInfo['dbname'], NULL, ($pageCurrent-1)*($this->pageNum), $this->pageNum);
				$totalNum = $mongoObj->dishesCount($this->adminInfo['dbname'], NULL);
			}
			$array_output['total'] = $totalNum;
			$array_output['data'] = $data;
			echo json_encode($array_output);
		}
		function delDishes()
		{
			do
			{
				$dishesObj = new dishesDB();
				$parameter = fcgi_postvar("id");
				if ( $parameter == NULL )
					break;
				$paras = split(",", $parameter);
				if ( $paras == NULL )
					break;
				$length = sizeof($paras);
				for ( $i=0; $i<$length; $i++ )
				{
					$dishesObj->delDishById($this->adminInfo['dbname'], $paras[$i]);
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
		function delallDishes()
		{
			$dishesObj = new dishesDB();
			$dishesObj->delAllDishes($this->adminInfo['dbname']);
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		function getCategoryNameList()
		{
			$mongoObj = new categoryDB();
			$data = $mongoObj->getCategoryNameList($this->adminInfo['dbname']);
			echo json_encode($data);
		}
		function getDishInfo()
		{
			$id = fcgi_getvar("id");
			$mongoObj = new dishesDB();
			$data = $mongoObj->getDishById($this->adminInfo['dbname'], $id);
			$data['imagesPath'] = "../customer/".$this->adminInfo['dbname']."/images/";
			echo json_encode($data);
		}
		function addDish()
		{
			global $CUSTOMER_HOME_PATH;
			global $ERROR_NAME_EXISTED;
			$ret = false;
			$array_output = array();
			do
			{
				$data['name'] = fcgi_postvar("name");
				$data['desc'] = fcgi_postvar("desc");
				$data['price'] = fcgi_postvar("price");
				$data['class'] = fcgi_postvar("class_select");
				$data['priority'] = fcgi_postvar("priority");
				$data['unit'] = fcgi_postvar("unit");
				$data['hotsale'] = fcgi_postvar("hotsalevalue");
				if ( $data['name'] == null )
					break;
				if (  in_array("name", $_FILES["picture"]) &&  $_FILES["picture"]["name"]!="")
				{
					$data['pictureName'] = $_FILES["picture"]["name"];
					$imagesPath = $CUSTOMER_HOME_PATH.$this->adminInfo['dbname']."/images/";
					check_dir($imagesPath);
					rename( $_FILES["picture"]["tmp_name"], $imagesPath.$_FILES["picture"]["name"] );
				}
				$mongoObj = new dishesDB();
				$ret = $mongoObj->addDish( $this->adminInfo['dbname'], $data );
			}while(0);
			if ( $ret )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = $ERROR_NAME_EXISTED;
				$array_output['msg'] = "name existed";
			}
			echo json_encode($array_output);
		}
		function editDish()
		{
			global $CUSTOMER_HOME_PATH;
			global $ERROR_NAME_EXISTED;
			$ret = false;
			$array_output = array();
			do
			{
				$data['name'] = fcgi_postvar("name");
				$data['desc'] = fcgi_postvar("desc");
				$data['price'] = fcgi_postvar("price");
				$data['class'] = fcgi_postvar("class_select");
				$data['priority'] = fcgi_postvar("priority");
				$data['unit'] = fcgi_postvar("unit");
				$data['hotsale'] = fcgi_postvar("hotsalevalue");
				if ( $data['name'] == null )
					break;
				if (  in_array("name", $_FILES["picture"]) &&  $_FILES["picture"]["name"]!="")
				{
					$data['pictureName'] = $_FILES["picture"]["name"];
					$imagesPath = $CUSTOMER_HOME_PATH.$this->adminInfo['dbname']."/images/";
					check_dir($imagesPath);
					rename( $_FILES["picture"]["tmp_name"], $imagesPath.$_FILES["picture"]["name"] );
				}
				$id = fcgi_postvar("id");
				$mongoObj = new dishesDB();
				$ret = $mongoObj->editDish( $this->adminInfo['dbname'], $id, $data );
			}while(0);
			if ( $ret )
			{
				$array_output['code'] = 0;
				$array_output['msg'] = "success";
			}
			else
			{
				$array_output['code'] = $ERROR_NAME_EXISTED;
				$array_output['msg'] = "name existed";
			}
			echo json_encode($array_output);
		}
		function setStatus()
		{
			$status = fcgi_getvar("status");
			$id = fcgi_getvar("id");
			$mongoObj = new dishesDB();
			$ret = $mongoObj->setStatus( $this->adminInfo['dbname'], $id, $status );
			
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
		function backup()
		{
			$cwd = getcwd();
			$cmdStr = "rm -rf ".$cwd."/backup";
			system($cmdStr);
			$cmdStr = "mkdir -p ".$cwd."/backup";
			system($cmdStr);
			$cmdStr = "cp -r /data/www/html/customer/".$this->adminInfo['dbname']."/images/ ".$cwd."/backup/";
			system($cmdStr);
			$filename = $cwd."/backup/dishes.txt";
			
			$mongoObj = new dishesDB();
			$data = $mongoObj->getDishes($this->adminInfo['dbname'], NULL, 0, 0);
			$fp = fopen($filename, 'w');
			fwrite($fp,"名称,描述,价格,排序,单位,类别,图片");
			fwrite( $fp, "\r\n" );
			$dishItem = array('name','desc','price','priority','unit','class','pictureName');
			foreach( $data as $dish )
			{
				foreach( $dishItem as $item )
				{
					if ( array_key_exists( $item, $dish ) )
						fwrite( $fp, $dish[$item] );
					if ( $item != "pictureName" )
						fwrite( $fp, "," );
				}
				fwrite( $fp, "\r\n" );
			}
			fclose($fp);
			system("zip -r backup.zip backup > /dev/null");
			downloadFile($cwd, "backup.zip");
		}
		function traverse($dirname,$targetDir)
		{
			$current_dir = opendir($dirname);
			while( ($file =readdir($current_dir)) != false )
			{
				$sub_dir = $dirname . DIRECTORY_SEPARATOR . $file;
				if($file == '.' || $file == '..') 
				{
					continue;
				} 
				else if(is_dir($sub_dir)) 
				{
					$this->traverse($sub_dir,$targetDir);
				} 
				else 
				{
					$cmdStr = "cp ".$sub_dir." ".$targetDir;
					system($cmdStr);
				}
			}
		}
		function import()
		{
			$mongoObj = new dishesDB();
			if (  in_array("tmp_name", $_FILES["dishTxt"]) &&  $_FILES["dishTxt"]["tmp_name"]!="")
			{
				$txtpath = $_FILES["dishTxt"]["tmp_name"];
				$file_handle = fopen($txtpath, "r");
				$line = fgets($file_handle);
				while ( !feof($file_handle) ) 
				{
				   $line = fgets($file_handle);
				   $lineLength = strlen($line);
				   /*for( $i=$lineLength-1; $i>0; $i-- )
				   {
						if ( $line[$i] == "\r" || $line[$i] == "\n" )
							$line[$i] = '';
				   }*/
				   if ( $line[$lineLength-1] == "\n" )
				   {
						$line = substr($line, 0, $lineLength-2);
				   }
				   //error_log($line, 0);
				   $array = explode(',', $line);
				   $length = count($array);
				   if ( $length < 7 )
					continue;
				   //error_log($length, 0);
				   //error_log($array[$length-1], 0);
				   //error_log("-------------------------------------------",0);
				    $data = array();
				    $data['name'] = $array[0];
					$data['desc'] = $array[1];
					$data['price'] = $array[2];
					$data['priority'] = $array[3];
					$data['unit'] = $array[4];
					$data['class'] = $array[5];
					$data['pictureName'] = $array[6];
					if ( $data['name'] == "" || $data['price'] == "" || $data['unit'] == "" )
						continue;
					$ret = $mongoObj->importDish( $this->adminInfo['dbname'], $data );
				}
				fclose($file_handle);
			}
			var_dump($_FILES);
			if (  in_array("tmp_name", $_FILES["pictureTar"]) &&  $_FILES["pictureTar"]["tmp_name"]!="")
			{
				$tarpath = $_FILES["pictureTar"]["tmp_name"];
				$tmp = "/tmp/tmpdir";
				$cmdStr = "unzip ".$tarpath." -d ".$tmp;
				system("mkdir -p /tmp/tmpdir");
				system("rm -rf /tmp/tmpdir/*");
				system($cmdStr);
				$targetDir = "/data/www/html/customer/".$this->adminInfo['dbname']."/images/";
				$this->traverse($tmp,$targetDir);
			}
			$array_output['code'] = 0;
			$array_output['msg'] = "success";
			echo json_encode($array_output);
		}
	}

?>