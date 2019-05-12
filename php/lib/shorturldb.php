<?php
include_once("mongodb.php");
include_once("public.php");

class shorturlDB extends mongoBase
{
	private $COLLECTION_NAME = "shorturl";
	private $DBNAME = "admin";
	
	public function addOrderSu( $dbname, $id )
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$keyStr = randomStr(6);
		$queryArray["keyStr"] = $keyStr;
		$exitData = $collection->findOne( $queryArray );
		while ( NULL != $exitData  )
		{
			$keyStr = randomStr(6);
			$queryArray["keyStr"] = $keyStr;
			$exitData = $collection->findOne( $queryArray );
		}
		$data["keyStr"] = $keyStr;
		$data["dbname"] = $dbname;
		$data["id"] = $id;
		$collection->insert($data);
		return $keyStr;
	}
	public function getOrderSu( $keyStr )
	{
		$collection = $this->getMongoCol($this->DBNAME, $this->COLLECTION_NAME);
		$queryArray["keyStr"] = $keyStr;
		$exitData = $collection->findOne( $queryArray );
		if ( NULL != $exitData  )
			return $exitData;
		return NULL;
	}
}

?>