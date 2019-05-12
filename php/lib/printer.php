<?php

include_once("mongodb.php");
include_once("customerDB.php");

function postToPrinter($params) {
    $host = '114.215.116.141';
    $port = '8888';
    $p = '';
    foreach ($params as $k => $v) {
        $p .= $k.'='.$v.'&';
    }
    $p = rtrim($p, '&');
    $header = "POST / HTTP/1.1\r\n";
    $header .= "Host:$host:$port\r\n";
    $header .= "Content-Type: application/x-www-form-urlencoded\r\n";
	$header .= "Expect:\r\n";
    $header .= "Content-Length: " . strlen($p) . "\r\n";
    $header .= "Connection: Close\r\n\r\n";
    $header .= $p;
    $fp = fsockopen($host, $port);
    fwrite($fp, $header, 3024546);
    while (!feof($fp)) {
        $str = fgets($fp);
    }
    fclose($fp);
	$retCode = (int)$str;
	return $retCode;
}

function generateSign($params, $apiKey, $msign)
{
    ksort($params);
    $stringToBeSigned = $apiKey;
    foreach ($params as $k => $v)
    {
        $stringToBeSigned .= urldecode($k.$v);
    }
    unset($k, $v);
    $stringToBeSigned .= $msign;
    return strtoupper(md5($stringToBeSigned));
}

/*function getOrderId( $id )
{
	$mapArray = array("0"=>0,"1"=>1,"2"=>2,"3"=>3,"4"=>4,"5"=>5,"6"=>6,"7"=>7,"8"=>8,"9"=>9,'a'=>10,'b'=>11,'c'=>12,'d'=>13,'e'=>14,'f'=>15);
	$length = strlen($id);
	$value = (int)$mapArray[$id[$length-1]] + (int)$mapArray[$id[$length-2]] * 16;
	
	if ( $value < 10 )
		return "00".$value;
	else if ( $value < 100 )
		return "0".$value;
	return "".$value;
}*/

function printOrder( $data, $machine_code, $mKey )
{
	$contentTpl = "-------------------------------
订单编号：%s
姓名: %s
电话：%s
地址：%s
下单时间： %s
配送时间： %s
-------------------------------
商品          单价   数量   金额
%s

备注： %s
-------------------------------
                   合计： %s元
				   
  谢谢您的惠顾，欢迎下次光临
-------------------------------";
	$orderId = $data['orderid'];
	$orderDate = $data["orderData"];
	$orderStr = "";
	for ( $i=0; $i< sizeof($orderDate); $i++ )
	{
		$orderStr .= $orderDate[$i]["name"];
		$length = strlen($orderDate[$i]["name"]);
		$length = $length/3*2;
		if ( $length > 14 )
		{
			$orderStr .= "\n";
			$length = 0;
		}
		$length = 14 - $length;
		for ( $j = 0; $j <= $length; $j++ )
			$orderStr .= " ";
		
		$orderStr .= $orderDate[$i]["price"];
		$length = 7 - strlen($orderDate[$i]["price"]);
		for ( $j = 0; $j < $length; $j++ )
			$orderStr .= " ";
		
		$orderStr .= $orderDate[$i]["selectNum"];
		$length = 7 - strlen($orderDate[$i]["selectNum"]);
		for ( $j = 0; $j < $length; $j++ )
			$orderStr .= " ";
		
		$price = (int) $orderDate[$i]["selectNum"]  * (int)$orderDate[$i]["price"];
		$orderStr .= $price;
		$orderStr .= "\n";
	}
	$content = sprintf($contentTpl, $orderId, $data["name"], $data["phone"], $data["address"], date( "Y-m-d H:i:s", (int)$data["time"] ), $data["deliveryTime"], $orderStr, $data["remark"], $data["totalPrice"]);
	$apiKey       = 'f3178e94bd5cb97306132c42e5a39847a53d7bd1';
	$partner      = '475';
	
	$params = array(
            'partner'=>$partner,
            'machine_code'=>$machine_code,
            'content'=>$content,
    );
    $sign = generateSign($params,$apiKey,$mKey);
    $params['sign'] = $sign;
    $retCode = postToPrinter($params);
	if ( $retCode != 1 )
	{
		error_log("[printOrder]failed, machine_code: ".$machine_code.", retCode: ".$retCode, 0);
		return false;
	}
	return true;
}

function printOrderWhenAdd( $dbname, $id )
{
	$orderObj = new orderDB($dbname);
	$data = $orderObj->getOrderById($id);
	if ( $data == NULL )
		return;
	$dbObj = new configDb($dbname);
	$printerInfo = $dbObj->getPrinterInfo();
	if ( $printerInfo==NULL || $printerInfo["status"] == 0 )
		return;
	if ( $printerInfo["printType"] != "1" )
		return;
	$ret = printOrder( $data, $printerInfo["machine_code"], $printerInfo["machine_key"] );
	if ( !$ret )
		error_log("[printOrderWhenAdd]dbname: ".$dbname.", print failed!", 0);
}

function printOrderWhenAuth( $dbname, $id )
{
	$orderObj = new orderDB($dbname);
	$data = $orderObj->getOrderById($id);
	if ( $data == NULL )
		return;
	if ( $data["status"] != "1" )
		return;
	$dbObj = new configDb($dbname);
	$printerInfo = $dbObj->getPrinterInfo();
	if ( $printerInfo==NULL || $printerInfo["status"] == 0 )
		return;
	if ( $printerInfo["printType"] == "1" )
		return;
	$ret = printOrder( $data, $printerInfo["machine_code"], $printerInfo["machine_key"] );
	if ( !$ret )
		error_log("[printOrderWhenAuth]dbname: ".$dbname.", print failed!", 0);
}

?>