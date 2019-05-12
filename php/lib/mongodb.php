<?php
	class mongoBase
	{
		private $MONGO_USERNAME = "admin";
		private $MONGO_PASSWORD = "ccq245722";
		private $MONGO_HOSTNAME = "localhost";
		private $MONGO_PORT = 27017;
		
		public function getMongoDb($dbname)
		{
			$url = "mongodb://".$this->MONGO_USERNAME.":".$this->MONGO_PASSWORD."@".$this->MONGO_HOSTNAME.":".$this->MONGO_PORT;
			$conn = new MongoClient($url);
			return $conn->$dbname;
		}
		public function getMongoCol($dbname, $collection)
		{
			$db = $this->getMongoDb($dbname);
			return $db->$collection;
		}
		public function getMongoDataList($dbname, $collection, $queryArray, $filedArray, $skip, $need)
		{
			try
			{
				$outArray = array();
				$i = 0;
				$collObj = $this->getMongoCol($dbname, $collection);
				if ( $queryArray!=NULL && $filedArray!=NULL)	
					$cursor = $collObj->find($queryArray, $filedArray);
				else if ( $queryArray!=NULL )
					$cursor = $collObj->find($queryArray);
				else if ( $filedArray!=NULL )
					$cursor = $collObj->find(array(), $filedArray);
				else
					$cursor = $collObj->find();
				if ( $skip > 0 )
					$cursor->skip($skip);
				if ( $need > 0 )
					$cursor = $cursor->limit($need);
				while ( $cursor->hasNext() )
				{
					$data = $cursor->getNext();
					$outArray[$i] = $data;
					$i++;
				}
				return $outArray;
			}
			catch(Exception $e)
			{
				error_log($e->getMessage(), 0);
				return NULL;
			}
		}
		public function mongoCollCount($dbname, $collection)
		{
			$collObj = $this->getMongoCol($dbname, $collection);
			$cursor = $collObj->find();
			return $cursor->count();
		}
		public function mongoCollCountEx($dbname, $collection, $queryArray)
		{
			$collObj = $this->getMongoCol($dbname, $collection);
			$cursor = $collObj->find($queryArray);
			return $cursor->count();
		}
	}
	
	class adminDB extends mongoBase
	{
		public $MONGO_ADMIN_DB = "admin";
		public $COLLECTION_MANAGER = "manager";
		
		/*public function createAdmin($name)
		{
			$data['username'] = $name;
			$data['password'] = "111111";
			$data['dbname'] = $name;
			$data['appid'] = "";
			$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
			$collection->insert($data);
		}*/
		
		public function getAdminUser($username)
		{
			$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
			$data = $collection->findOne(array("username" => $username));
			return $data;
		}
		
		public function updateSession($username, $session)
		{
			$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
			$collection->update(array("username"=>$username), array('$set'=>array("session"=>$session)));
		}
		
		public function getBySession($session)
		{
			$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
			$data = $collection->findOne(array("session" => $session));
			return $data;
		}
		
		public function updatePassword($username, $password)
		{
			$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
			$collection->update(array("username"=>$username), array('$set'=>array("password"=>$password)));
		}
		
		public function updatePasswordBySession($session, $password)
		{
			$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
			$collection->update(array("session"=>$session), array('$set'=>array("password"=>$password)));
		}
	}
	class categoryDB extends mongoBase
	{
		private $COLLECTION_CATE = "category";
		
		public function categoryCount($dbname)
		{
			return $this->mongoCollCount($dbname, $this->COLLECTION_CATE);
		}
		public function getCategory($dbname, $skip, $need)
		{
			return $this->getMongoDataList($dbname, $this->COLLECTION_CATE, NULL, NULL, $skip, $need);
		}
		public function delAllCategory($dbname)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
			$collection->drop();
		}
		public function delCategoryById($dbname, $id)
		{
			try
			{
				static $collection = null;
				if ( $collection == null )
					$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
				return $collection->remove(array('_id' => new MongoId($id)));
			}
			catch(Exception $e)
			{
				error_log($e->getMessage(), 0);
			}
		}
		public function getCategoryById($dbname, $id)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
			return $collection->findOne(array('_id' => new MongoId($id)));
		}
		public function addCategory($dbname, $data)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
			if ( $data['name'] != NULL )
			{
				if ( NULL != $collection->findOne( array('name' => $data['name']) ) )
					return false;
			}
			$collection->insert($data);
			return true;
		}
		public function editCategory($dbname, $id, $data)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
			if ( $data['name'] != NULL )
			{
				$exitData = $collection->findOne( array('name' => $data['name']) );
				if ( NULL != $exitData && $exitData['_id'] != new MongoId($id)  )
					return false;
			}
			$collection->update( array("_id"=>new MongoId($id)), array('$set'=>$data) );
			return true;
		}
		public function getCategoryNameList($dbname)
		{
			$fieldArray = array('name'=>true);
			return $this->getMongoDataList($dbname, $this->COLLECTION_CATE, NULL, $fieldArray, 0, 0);
		}
		public function incDishesNum($dbname, $category)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
			if ( $category != NULL )
			{
				$exitData = $collection->findOne( array('name' => $category) );
				if ( NULL == $exitData  )
					return;
				$dishesNum = (int) $exitData['dishesNum'] + 1; 
				$newData = array('dishesNum'=>$dishesNum); 
				$collection->update( array("_id"=>$exitData["_id"]),  array('$set'=>$newData) );
			}
		}
		public function decDishesNum($dbname, $category)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_CATE);
			if ( $category != NULL )
			{
				$exitData = $collection->findOne( array('name' => $category) );
				if ( NULL == $exitData  )
					return;
				$dishesNum = (int) $exitData['dishesNum'] - 1; 
				if ( $dishesNum < 0 )
					$dishesNum = 0;
				$newData = array('dishesNum'=>$dishesNum);
				$collection->update( array("_id"=>$exitData["_id"]), array('$set'=>$newData) );
			}
		}
		public function clearDishesNum($dbname)
		{
			$collObj = $this->getMongoCol($dbname,  $this->COLLECTION_CATE);
			$cursor = $collObj->find();
			while ( $cursor->hasNext() )
			{
				$data = $cursor->getNext();
				$newData = array('dishesNum'=>0);
				$collObj->update( array("_id"=>$data["_id"]), array('$set'=>$newData) );
			}
		}
	}
	class dishesDB extends mongoBase
	{
		private $COLLECTION_DISH = "dish";
		
		public function getDishes($dbname, $queryArray, $skip, $need)
		{
			return $this->getMongoDataList($dbname, $this->COLLECTION_DISH, $queryArray, NULL, $skip, $need);
		}
		public function dishesCount($dbname, $queryArray)
		{
			if ( $queryArray == NULL )
				return $this->mongoCollCount($dbname, $this->COLLECTION_DISH);
			else
				return $this->mongoCollCountEx($dbname, $this->COLLECTION_DISH, $queryArray);
		}
		public function delDishById($dbname, $id)
		{
			try
			{
				static $collection = null;
				if ( $collection == null )
					$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
				$oldData = $collection->findOne( array("_id"=>new MongoId($id)) );
				if ( $oldData == NULL )
					return false;
				$categoryObj = new categoryDB();
				$categoryObj->decDishesNum($dbname, $oldData['class']);
				return $collection->remove(array('_id' => new MongoId($id)));
			}
			catch(Exception $e)
			{
				error_log($e->getMessage(), 0);
			}
		}
		public function delAllDishes($dbname)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			$collection->drop();
			$categoryObj = new categoryDB();
			$categoryObj->clearDishesNum($dbname);
		}
		public function getDishById($dbname, $id)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			return $collection->findOne(array('_id' => new MongoId($id)));
		}
		public function addDish($dbname, $data)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			if ( $data['name'] != NULL )
			{
				if ( NULL != $collection->findOne( array('name' => $data['name']) ) )
					return false;
			}
			$collection->insert($data);
			$categoryObj = new categoryDB();
			$categoryObj->incDishesNum($dbname, $data['class']);
			return true;
		}
		public function editDish($dbname, $id, $data)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			if ( $data['name'] != NULL )
			{
				$exitData = $collection->findOne( array('name' => $data['name']) );
				if ( NULL != $exitData && $exitData['_id'] != new MongoId($id)  )
					return false;
			}
			$oldData = $collection->findOne( array("_id"=>new MongoId($id)) );
			if ( $oldData == NULL )
				return false;
			if ( in_array("class", $data) && $oldDate['class'] != $data['class'] )
			{
				$categoryObj = new categoryDB();
				$categoryObj->decDishesNum($dbname, $oldData['class']);
				$categoryObj->incDishesNum($dbname, $data['class']);
			}
			$collection->update( array("_id"=>new MongoId($id)), array('$set'=>$data) );
			return true;
		}
		public function incDishesCountByName($dbname, $name, $num)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			$exitData = $collection->findOne( array('name' => $name) );
			if ( NULL == $exitData  )
				return;
			$count = 1;
			if ( array_key_exists("count", $exitData) )
				$count = (int) $exitData['count'] + $num; 
			$newData = array('count'=>$count); 
			$collection->update( array("_id"=>$exitData["_id"]),  array('$set'=>$newData) );
		}
		public function setStatus($dbname, $id, $status)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			$newData = array('status'=>$status);
			return $collection->update( array("_id"=>new MongoId($id)), array('$set'=>$newData) );
		}
		public function importDish($dbname, $data)
		{
			$collection = $this->getMongoCol($dbname, $this->COLLECTION_DISH);
			$oldData = $collection->findOne( array("name"=>$data["name"]) );
			if ( $oldData != NULL )
			{
				if ( in_array("class", $data) && $oldDate['class'] != $data['class'] )
				{
					$categoryObj = new categoryDB();
					$categoryObj->decDishesNum($dbname, $oldData['class']);
					$categoryObj->incDishesNum($dbname, $data['class']);
				}
			}
			$collection->update( array("name"=>$data["name"]), array('$set'=>$data), array("upsert" => true) );
			return true;
		}
	}
	
	class configDb extends mongoBase
	{
		private $COLLECTION_NAME = "configuration";
		private $CONFICTION_KEY = "configkey";
		private $PUBLIC_ACCOUNT = "publicAccount";
		private $USER_DEFINED_MENU = "userDefinedMenu";
		private $AUTO_RESPONSE = "autoResponse";
		private $SYSTEM_INFO = "systeminfo";
		private $SHORT_MESSAGE = "shortmessage";
		private $PRINTER_INFO = "printerInfo";
		private $ORDER_ID = "orderid";
		private $DBNAME = null;
		function __construct($dbname) 
		{
			$this->DBNAME = $dbname;
		}
		public function setPublicAccount($data)
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$data[$this->CONFICTION_KEY] = $this->PUBLIC_ACCOUNT;
			$queryArray[$this->CONFICTION_KEY] = $this->PUBLIC_ACCOUNT;
			$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
			return true;
		}
		public function getPublicAccount()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->PUBLIC_ACCOUNT;
			return $collection->findOne( $queryArray );
		}
		public function setUserDefinedMenu($data)
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$data[$this->CONFICTION_KEY] = $this->USER_DEFINED_MENU;
			$queryArray[$this->CONFICTION_KEY] = $this->USER_DEFINED_MENU;
			$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
			return true;
		}
		public function getUserDefinedMenu()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->USER_DEFINED_MENU;
			return $collection->findOne( $queryArray );
		}
		public function setAutoResponse($data)
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$data[$this->CONFICTION_KEY] = $this->AUTO_RESPONSE;
			$queryArray[$this->CONFICTION_KEY] = $this->AUTO_RESPONSE;
			$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
			return true;
		}
		public function getAutoResponse()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->AUTO_RESPONSE;
			return $collection->findOne( $queryArray );
		}
		public function setSystemInfo($data)
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$data[$this->CONFICTION_KEY] = $this->SYSTEM_INFO;
			$queryArray[$this->CONFICTION_KEY] = $this->SYSTEM_INFO;
			$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
			return true;
		}
		public function getSystemInfo()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->SYSTEM_INFO;
			return $collection->findOne( $queryArray );
		}
		public function setShortMessage($data)
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$data[$this->CONFICTION_KEY] = $this->SHORT_MESSAGE;
			$queryArray[$this->CONFICTION_KEY] = $this->SHORT_MESSAGE;
			$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
			return true;
		}
		public function getShortMessage()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->SHORT_MESSAGE;
			return $collection->findOne( $queryArray );
		}
		public function setPrinterInfo($data)
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$data[$this->CONFICTION_KEY] = $this->PRINTER_INFO;
			$queryArray[$this->CONFICTION_KEY] = $this->PRINTER_INFO;
			$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
			return true;
		}
		public function getPrinterInfo()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->PRINTER_INFO;
			return $collection->findOne( $queryArray );
		}
		public function getOrderId()
		{
			$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			$queryArray[$this->CONFICTION_KEY] = $this->ORDER_ID;
			$data = $collection->findOne( $queryArray );
			$orderid = 0;
			if ( $data != null )
			{
				$orderid = (int)$data['orderid'];
				$orderid = $orderid + 1;
			}
			$collection->update( $queryArray, array('$set'=>array('orderid'=>$orderid)), array("upsert" => true) );
			if ( $orderid < 10 )
				return "00".$orderid;
			else if ( $orderid < 100 )
				return "0".$orderid;
			return "".$orderid;
		}
	}
?>