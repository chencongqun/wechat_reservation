<?php

include_once('HttpClient.class.php');

function sendSms( $telephone, $msg )
{
	$url = "http://sz.ipyy.com/sms.aspx";
	$account = "szzd0013";
	$password = "ccq245722";
	$params = array( 'action'=>"send",
				'userid'=>"",
				'account'=>$account,
				'password'=>$password,
				'mobile'=>$telephone,
				'content'=>$msg,
				'sendTime'=>"",
				'extno'=>"" );  
	$pageContents = HttpClient::quickPost($url, $params); 	
	$xml = simplexml_load_string($pageContents); 
	if ( $xml->remainpoint == 0 )
	{
		error_log("[sms.php][sendSms]reaminpoint 0", 0);
	}
	if ( $xml->successCounts == 0 )
	{
		error_log("[sms.php][sendSms]send sortmessage failed! ".$telephone, 0);
	}
}

?>