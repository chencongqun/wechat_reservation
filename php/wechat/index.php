<?php
/**
  * index page
  */

include_once("../lib/public.php");
include_once("processMsg.php"); 
$wechatObj = new weChatInterface();
$wechatObj->event_dispatcher();

class weChatInterface
{

	private function checkSignature()
    {
        $signature = fcgi_getvar("signature");
        $timestamp = fcgi_getvar("timestamp");
        $nonce = fcgi_getvar("nonce");
        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );
        if( $tmpStr == $signature )
        {
            return true;
        }else{
            return false;
        }
	}
	
    public function event_dispatcher()
    {
        try
        {
			$echoStr = fcgi_getvar("echostr");
			if( $echoStr && $this->checkSignature() )
			{
				echo $echoStr;
				exit;
			}
			else
			{
				$msgCtrObj = new msgController();
				$msgCtrObj->msg_dispatcher();
			}
        }
		catch(Exception $e)
        {
            error_log($e->getMessage(), 0);
        }
    }
}
?>
