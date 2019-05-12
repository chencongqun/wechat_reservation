<?php
include_once("../lib/public.php");
include_once("../lib/mongodb.php");
include_once("../lib/customerDB.php");
include_once("../lib/sms.php");
include_once("../lib/error.php");
include_once("../lib/orderOpt.php");
include_once("../lib/shorturldb.php");
include_once("../lib/consoledb.php");
include_once("../lib/printer.php");

$obj = new ordersInterface();
$obj->dispatcher();

class ordersInterface
{

	public function dispatcher()
	{
		$opt = fcgi_getvar("opt");
		if ( $opt == "addOrder" )
			$this->addOrder();
		else if ( $opt == "checkOrder" )
			$this->checkOrder();
	}
	
	public function sendOrderNotify($dbname, $data)
	{
		$shorturlObj = new shorturlDB();
		$keyStr = $shorturlObj->addOrderSu( $dbname, $data["_id"]->{'$id'} );
		$content = "您有一个新订单！\n送餐地址：" . $data["address"] . "。 \n15t.me/" . $keyStr . " \n打开网址接收订单\n";
		$smsObj = new configDb($dbname);
		$smsData = $smsObj->getShortMessage();
		if ( $smsData["status"] == "1" )
		{
			$mongoObj = new exAdminDB();
			$adminInfo = $mongoObj->getAccountByDbname($dbname);
			$smNum = (int) $adminInfo["smNum"];
			if ( $smNum <= 0 )
				return;
			$mongoObj->renewal($adminInfo["_id"]->{'$id'}, array("smNum"=>-1));
			sendSms($smsData["telephone"],$content);
		}
	}
	public function updateDishesCount($dbname,$orderData)
	{
		try
		{
			$length = sizeof($orderData);
			$mongoObj = new dishesDB();
			for ( $i=0; $i< $length; $i++ )
				$mongoObj->incDishesCountByName($dbname, $orderData[$i]->name, (int)$orderData[$i]->selectNum);
		}catch(Exception $e)
		{
			error_log($e->getMessage(), 0);
		}
	}
	public function getOrderId($dbname)
	{
		$mongoObj = new configDb($dbname);
		$orderid = $mongoObj->getOrderId();
		return $orderid;
	}
	public function addOrder()
	{
		global $ERROR_ACCEPT_ORDER;
		$dbname = fcgi_getvar("shopinfo");
		$openid = fcgi_getvar("openid");
		$customerObj = new customerDB($dbname);
		$orderObj = new orderDB($dbname);
		$historyData = null;
		$queryArray["openid"] = $openid;
		$queryArray["status"] = 0;
		/*$historyData = $orderObj->getOrders( $queryArray, 0, 0 );
		if ( $historyData != null && sizeof($historyData)>0)
		{
			$array_output['code'] = $ERROR_ACCEPT_ORDER;
			$array_output['msg'] = "Failed";
			echo json_encode($array_output);
			return;
		}*/
		$data['orderid'] = $this->getOrderId($dbname);
		$data["openid"] = $openid;
		$data["name"] = fcgi_postvar("name");
		$data["phone"] = fcgi_postvar("phone");
		$data["address"] = fcgi_postvar("address");
		$data["remark"] = fcgi_postvar("remark");
		$data["totalPrice"] = fcgi_postvar("totalPrice");
		$data["deliveryTime"] = fcgi_postvar("deliveryTime");
		$data["time"] = time();
		$data["status"] = 0;
		$orderData = fcgi_postvar("orderData");
		if ( $orderData != null )
		{
			$data["orderData"] = json_decode($orderData);
			$this->updateDishesCount($dbname,$data["orderData"]);
		}
			
		$userData["openid"] = $data["openid"];
		$userData["name"] = $data["name"];
		$userData["phone"] = $data["phone"];
		$userData["address"] = $data["address"];
		
		$customerObj->addCustomer($userData);
		
		
		$orderObj->addOrder($data);
		
		$this->sendOrderNotify($dbname, $data);
		printOrderWhenAdd($dbname, $data["_id"]->{'$id'});
		
		$array_output['code'] = 0;
		$array_output['msg'] = "Success";
		echo json_encode($array_output);
	}
	
	
	
	public function checkOrder()
	{
		$id = fcgi_getvar("id");
		$dbname = fcgi_getvar("shopinfo");
		$status = fcgi_getvar("type");
		$shopResponse = fcgi_getvar("shopResponse");
		handleOrder($dbname, $id, $status, $shopResponse);
		printOrderWhenAuth($dbname, $id);
		$array_output['code'] = 0;
		$array_output['msg'] = "success";
		echo json_encode($array_output);
	}
}

?>
