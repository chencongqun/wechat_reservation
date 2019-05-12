<?php
	include_once("../lib/public.php");
	include_once("../lib/shorturldb.php");
	redirectToOrderInfo();
	function redirectToOrderInfo()
	{
		$keyStr = fcgi_getvar("alias");
		$shorturlObj = new shorturlDB();
		$url = "location: /wechat/newOrderInfo.html";
		$data = $shorturlObj->getOrderSu($keyStr);
		if ( $data != NULL )
		$url = $url . "?id=".$data["id"]."&shopinfo=".$data["dbname"];
		header($url);
	}
?>