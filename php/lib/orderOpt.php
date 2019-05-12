<?php
	include_once("wechat.php");
	
	function handleOrder($dbname, $id, $opt, $message)
	{
		$opt = (int)$opt;
		$orderObj = new orderDB($dbname);
		$orderObj->setOrderStatus($id, $opt, $message);
		/*$data = $orderObj->getOrderById($id);
		if ( $data == null )
			return false;
		if ( $opt == 1 )  //accept
		{
			if ( $message == NULL )
				$message = "非常抱歉，您的订单暂时无法配送！原因可能是联系信息不准确、配送时间或地点无法送达！给您造成不便，希望您能谅解！";
			sendMsgToUser($dbname, $data["openid"], $message);
		}
		else if ( $opt == 2 ) //reject
		{
			if ( $message == NULL )
				$message = "您的订单已经接收，我们将尽快为您配送，请您稍作等待，并保持电话畅通！";
			sendMsgToUser($dbname, $data["openid"], $message);
		}
		else //reauth, do nothing
		{
		
		}*/
	}
?>
