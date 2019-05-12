<?php
include_once("public.php");
include_once("mongodb.php");
include_once('HttpClient.class.php');

function updateToken($dbname)
{
	$dbObj = new configDb($dbname);
	$data = $dbObj->getPublicAccount();
	$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$data["account"]."&secret=".$data["password"];
	$returnContent = HttpClient::doCurl($url);
	$tokenValue = json_decode($returnContent);

	$newData["token"] = $tokenValue->access_token;
	$newData["token_time"] = time();
	$dbObj->setPublicAccount($newData);
	
	return $tokenValue->access_token;
}

function getToken($dbname)
{
	$dbObj = new configDb($dbname);
	$data = $dbObj->getPublicAccount();
	if ( array_key_exists( "token", $data ) )
	{
		$curTime = time();
		if ( $curTime - (int)$data["token_time"] < 2400 )
			return $data["token"];
	}
	
	return updateToken($dbname);
}

function createMenu($dbname)
{
	$acceptToken = getToken($dbname);
	if ( $acceptToken == NULL )
		return false;
	$url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=".$acceptToken;
	//$notifyUrl = SIZEURL."/wechat/message.html?type=notify&shopinfo=".$dbname;
	//$introduceUrl = SIZEURL."/wechat/message.html?type=introduce&shopinfo=".$dbname;
	
	$mainUrl = SIZEURL."/wechat/main.html?shopinfo=".$dbname."&version=1.5";
	$mainAuthUrl = sprintf(AUTHTPL,$mainUrl);
	$myorderUrl = SIZEURL."/wechat/allorders.html?shopinfo=".$dbname."&version=1.5";
	$orderAuthUrl = sprintf(AUTHTPL,$myorderUrl);
	
	$phoneUrl = SIZEURL."/wechat/phone.html?shopinfo=".$dbname."&version=1.5";
	
	$postData = '{"button": ['.
	'{"type": "view","name": "叫外卖","url": "'.$mainAuthUrl.'"},'.
	'{"type": "view","name": "我的外卖","url": "'.$orderAuthUrl.'"},'.
	'{"name": "餐厅信息","sub_button": ['.
	'{"type": "view","name": "联系电话","url": "'.$phoneUrl.'"},'.
	'{"type": "click","name": "餐厅介绍","key": "V1002_ShopIntroduce"},'.
	'{"type": "click","name": "订餐须知","key": "V1003_ShopNotify"}'.
	']}'.
	']}';
	//error_log($postData,0);
	$returnValue = HttpClient::doCurl($url,$postData);
	error_log("[createMenu]".$returnValue, 0);
	$returnArray = json_decode($returnValue);
	if ( $returnArray->errcode == 0 )
		return true;
	else
		return false;
}

function sendMsgToUser($dbname, $openid, $content)
{
	$acceptToken = getToken($dbname);
	if ( $acceptToken == NULL )
		return false;
	$url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=".$acceptToken;
	$postData = '{"touser":"'.$openid.'","msgtype":"text","text":{"content":"'.$content.'"}}';
	$returnValue = HttpClient::doCurl($url,$postData);
}

function getOpenId($code)
{
	try
	{
	$url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx5021cf33fd62aed7&secret=d4df785424b1f2a92268ac638e0acd1c&code=".$code."&grant_type=authorization_code";
	
	$returnContent = HttpClient::doCurl($url);
	$tokenValue = json_decode($returnContent);
	
	return $tokenValue->openid;
	}catch(Exception $e)
	{
		error_log($e->getMessage(), 0);
	}
}


?>