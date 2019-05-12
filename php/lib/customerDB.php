<?php

include_once("mongodb.php");

class customerDB extends mongoBase
{
	private $COLLECTION_NAME = "customers";
	private $CONFICTION_KEY = "openid";
	private $DBNAME = null;
	
	function __construct( $dbname )
	{
		$this->DBNAME = $dbname;
	}
	public function addCustomer( $data )
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$queryArray[$this->CONFICTION_KEY] = $data["openid"];
		
		$exitData = $collection->findOne( $queryArray );
		if ( NULL != $exitData  )
		{
			$orderNum = 1;
			if ( array_key_exists("orderNum",$exitData) )
				$orderNum = (int) $exitData['orderNum'] + 1;
			$data["orderNum"] = $orderNum;
		}
		
		$collection->update( $queryArray, array('$set'=>$data), array("upsert" => true) );
	}
	public function getCustomerByOpenid( $openid )
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$queryArray[$this->CONFICTION_KEY] = $openid;
		return $collection->findOne( $queryArray );
	}
	public function getCustomers($queryArray, $skip, $need)
	{
		return $this->getMongoDataList($this->DBNAME, $this->COLLECTION_NAME, $queryArray, NULL, $skip, $need);
	}
	public function customersCount($queryArray)
	{
		if ( $queryArray == NULL )
				return $this->mongoCollCount($this->DBNAME, $this->COLLECTION_NAME);
		else
			return $this->mongoCollCountEx($this->DBNAME, $this->COLLECTION_NAME, $queryArray);
	}
	public function delCustomerById($id)
	{
		try
		{
			static $collection = null;
			if ( $collection == null )
				$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			return $collection->remove(array('_id' => new MongoId($id)));
		}
		catch(Exception $e)
		{
			error_log($e->getMessage(), 0);
		}
	}
	public function delAllCustomers()
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$collection->drop();
	}
}

class orderDB extends mongoBase
{
	private $COLLECTION_NAME = "orders";
	private $DBNAME = null;
	
	function __construct( $dbname )
	{
		$this->DBNAME = $dbname;
	}
	
	public function addOrder( $data )
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$collection->insert($data);
	}
	public function getOrders($queryArray, $skip, $need)
	{
		return $this->getMongoDataList($this->DBNAME, $this->COLLECTION_NAME, $queryArray, NULL, $skip, $need);
	}
	
	public function getOrdersEx($queryArray, $filedArray)
	{
		return $this->getMongoDataList($this->DBNAME, $this->COLLECTION_NAME, $queryArray, $filedArray, 0, 0);
	}
	public function ordersCount($queryArray)
	{
		if ( $queryArray == NULL )
				return $this->mongoCollCount($this->DBNAME, $this->COLLECTION_NAME);
		else
			return $this->mongoCollCountEx($this->DBNAME, $this->COLLECTION_NAME, $queryArray);
	}
	public function delOrderById($id)
	{
		try
		{
			static $collection = null;
			if ( $collection == null )
				$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
			return $collection->remove(array('_id' => new MongoId($id)));
		}
		catch(Exception $e)
		{
			error_log($e->getMessage(), 0);
		}
	}
	public function delAllOrders()
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$collection->drop();
	}
	public function setOrderStatus($id, $status, $shopResponse)
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$data["status"] = (int)$status;
		if ( $shopResponse != null )
			$data["shopResponse"] = $shopResponse;
		$collection->update( array("_id"=>new MongoId($id)), array('$set'=>$data) );
	}
	public function getOrderById($id)
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		return $collection->findOne(array('_id' => new MongoId($id)));
	}
}

class smsDB extends mongoBase
{
	private $COLLECTION_NAME = "shortMessage";
	private $CONFIG_NUM = "smNum";
	private $DBNAME = null;
	
	function __construct( $dbname )
	{
		$this->DBNAME = $dbname;
	}
	
	public function updateSmsInfo( $num )
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$queryArray["configKey"] = $this->CONFIG_NUM;
		
		$total = $num;
		$exitData = $collection->findOne( $queryArray );
		if ( NULL != $exitData  )
		{
			if ( array_key_exists("total",$exitData) )
				$total += (int) $exitData['total'];
		}
		
		$collection->update( $queryArray, array('$set'=>array("total"=>$total)), array("upsert" => true) );
	}
	
	public function decreaseSmsUsed()
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$queryArray["configKey"] = $this->CONFIG_NUM;
		
		$exitData = $collection->findOne( $queryArray );
		if ( NULL == $exitData || !array_key_exists("total",$exitData) )
			return false;
		$total = (int) $exitData["total"];	
		$used = 0;
		if ( array_key_exists("used",$exitData) )
		{
			$used = (int) $exitData['used'];
			
			if ( $total - $used <= 0 )
				return false;
		}
		$used += 1;
		
		$collection->update( $queryArray, array('$set'=>array("used"=>$used)), array("upsert" => true) );
	}
}

?>