<?php

include_once("mongodb.php");

class consoleAccountDB extends mongoBase
{
	private $MONGO_ADMIN_DB = "admin";
	private $COLLECTION_MANAGER = "super";
	
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

class exAdminDB extends adminDB
{
	public $COLLECTION_INDEX = "accountIndex";
	public function getNewAccount($city)
	{
		$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_INDEX);
		$data = $collection->findOne(array("cityAccountIndex" => $city));
		if ( $data == NULL )
		{
			$data = array("cityAccountIndex"=>$city, "index"=>1);
			$collection->insert($data);
		}
		else
		{	
			$data["index"] = (int)$data["index"] + 1;
		}
		$indexNum = $data["index"];
		$collection->update( array("cityAccountIndex" => $city), array('$set'=>array("index"=>$indexNum)) );
		$account = $city;
		if ( $indexNum >= 1000 )
			$account = $account.$indexNum;
		else if ( $indexNum >= 100 )
			$account = $account."0".$indexNum;
		else if ( $indexNum >= 10 )
			$account = $account."00".$indexNum;
		else
			$account = $account."000".$indexNum;
		error_log("[getNewAccount]".$account, 0);
		return $account;
	}
	
	public function createAdmin($data)
	{
		if ( !array_key_exists("city",$data) || $data["city"]==NULL )
			return false;
		$account = $this->getNewAccount($data["city"]);
		$data["username"] = $account;
		$data["password"] = "111111";
		$data["dbname"] = $account;
		$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
		error_log("[createAdmin]".$data["username"]." ".$data["smNum"]." ".$data["tenancy"]." ".$data["accountType"], 0);
		return $collection->insert($data); // return bool or message array
	}
	
	public function editAccount( $id, $data )
	{
		$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
		$oldData = $collection->findOne( array("_id"=>new MongoId($id)) );
		if ( $oldData == NULL )
			return false;
		$collection->update( array("_id"=>new MongoId($id)), array('$set'=>$data) );
		error_log("[editAccount]".$data["username"]." ".$data["accountType"]." ".$data["city"]." ".$data["district"], 0);
		return true;
	}
	
	public function getAccounts($queryArray, $skip, $need)
	{
		return $this->getMongoDataList($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER, $queryArray, NULL, $skip, $need);
	}
	
	public function adminCount($queryArray)
	{
		if ( $queryArray == NULL )
				return $this->mongoCollCount($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
		else
			return $this->mongoCollCountEx($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER, $queryArray);
	}
	
	public function getAccountById($id)
	{
		$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
		return $collection->findOne(array('_id' => new MongoId($id)));
	}
	
	public function getAccountByDbname($dbname)
	{
		$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
		$data = $collection->findOne(array("dbname" => $dbname));
		return $data;
	}
	
	public function renewal( $id, $data )
	{
		$collection = $this->getMongoCol($this->MONGO_ADMIN_DB, $this->COLLECTION_MANAGER);
		$oldData = $collection->findOne( array("_id"=>new MongoId($id)) );
		if ( $oldData == NULL )
			return false;
		
		if ( array_key_exists("tenancy",$data) && $data["tenancy"]!=NULL )
		{
			$newTenancy = (int)$oldData["tenancy"] + (int)$data["tenancy"];
			$collection->update( array("_id"=>new MongoId($id)), array('$set'=>array("tenancy"=>$newTenancy)) );
			error_log("[renewal]".$oldData["username"]." ".$data["tenancy"], 0);
		}
		if ( array_key_exists("smNum",$data) && $data["smNum"]!=NULL )
		{
			$newSmNum = (int)$oldData["smNum"] + (int)$data["smNum"];
			$collection->update( array("_id"=>new MongoId($id)), array('$set'=>array("smNum"=>$newSmNum)) );
			error_log("[renewal]".$oldData["username"]." ".$data["smNum"], 0);
		}
		return true;
	}
}

?>