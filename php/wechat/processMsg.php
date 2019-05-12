<?php
	include_once("../lib/public.php");
	include_once("../lib/mongodb.php");
	
	class msgController
	{
		private $postStr = "";
		private $shopinfo = "";
		private $postObj = NULL;
		function msg_dispatcher()
		{
			//get post data, May be due to the different environments
			if ( !array_key_exists("HTTP_RAW_POST_DATA", $GLOBALS) )
				return;
			$this->postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
			$this->shopinfo = fcgi_getvar("shopinfo");
			if ( empty($this->postStr) )
				return;
			$this->postObj = simplexml_load_string($this->postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
			
			$msgType = $this->postObj->MsgType;

			if ( $msgType == "event" )
			{
				$event = $this->postObj->Event;
				if ( $event == "subscribe" )
				{
					$this->sendShopMsg(2);
				}
				else if ( $event == "CLICK" )
				{
					$eventKey = $this->postObj->EventKey;
					if ( $eventKey == "K1001_MainMenu" )
						$this->sendMenu();
					else if ( $eventKey == "V1002_ShopIntroduce" )
						$this->sendShopMsg(1);
					else if ( $eventKey == "V1003_ShopNotify" )
						$this->sendShopMsg(2);
				}
			}
			else if ( $msgType == "text" )
			{
				$this->sendMenu();
			}
			
			
		}
		function process_text_msg()
		{	
			$fromUsername = $this->postObj->FromUserName;
			$toUsername = $this->postObj->ToUserName;
			$keyword = trim($this->postObj->Content);
			$time = time();
			
			$textTpl = "<xml>
						<ToUserName><![CDATA[%s]]></ToUserName>
						<FromUserName><![CDATA[%s]]></FromUserName>
						<CreateTime>%s</CreateTime>
						<MsgType><![CDATA[%s]]></MsgType>
						<Content><![CDATA[%s]]></Content>
						<FuncFlag>0</FuncFlag>
						</xml>";
			if(!empty( $keyword ))
			{
				$msgType = "text";
				$contentStr = "请您使用底部菜单栏自助订餐!";
				$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
				//error_log($resultStr,0);
				echo $resultStr;
			}else{
				echo "Input something...";
			}
		}
		function sendMenu()
		{
			$this->postObj = simplexml_load_string($this->postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
			if ( $this->postObj == NULL )
				return;
			$fromUsername = $this->postObj->FromUserName;
			$toUsername = $this->postObj->ToUserName;
			$time = time();
			$textTpl = "<xml>
						<ToUserName><![CDATA[%s]]></ToUserName>
						<FromUserName><![CDATA[%s]]></FromUserName>
						<CreateTime>%s</CreateTime>
						<MsgType><![CDATA[%s]]></MsgType>
						<ArticleCount>4</ArticleCount>
						<Articles>
						%s
						</Articles>
						</xml>";
			$itemTpl = "<item>
						<Title><![CDATA[%s]]></Title> 
						<Description><![CDATA[description]]></Description>
						<PicUrl><![CDATA[%s]]></PicUrl>
						<Url><![CDATA[%s]]></Url>
						</item>";
			$titleText = "欢迎使用微信订餐！";
			$coverImage = SIZEURL."/public/images/cover.jpg";
			$dbObj = new configDb($this->shopinfo);
			$data = $dbObj->getSystemInfo();
			if ( $data != null && array_key_exists("title", $data ) )
			{
				$titleText = $data["title"];
			}
			if ( $data != null && array_key_exists("cover", $data) )
			{
				$coverImage = SIZEURL."/customer/dbname/images/".$data["cover"];
			}
			$mainUrl = SIZEURL."/wechat/main.html?shopinfo=".$this->shopinfo."&time=".$time;
			$authUrl = sprintf(AUTHTPL,$mainUrl);
			$item1 = sprintf($itemTpl, $titleText, $coverImage, "");
			$item2 = sprintf($itemTpl, "在线订餐", SIZEURL."/public/images/wmdc.jpg", $authUrl);
			
			$phoneUrl = SIZEURL."/wechat/phone.html?telephone=".$data["phone"]."&time=".$time;
			$item3 = sprintf($itemTpl, "联系电话", SIZEURL."/public/images/phone.jpg", $phoneUrl);
			
			/*$introduceUrl = SIZEURL."/wechat/message.html?type=introduce&shopinfo=".$this->shopinfo."&openid=".$fromUsername."&time=".$time;
			$item4 = sprintf($itemTpl, "餐厅介绍", SIZEURL."/public/images/ctjs.jpg", $introduceUrl);*/
			
			$myorderUrl = SIZEURL."/wechat/allorders.html?version=V1.4&shopinfo=".$this->shopinfo."&time=".$time;
			$authUrl = sprintf(AUTHTPL,$myorderUrl);
			$item4 = sprintf($itemTpl, "我的订单", SIZEURL."/public/images/ctjs.jpg", $authUrl);
			
			$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, "news", $item1.$item2.$item4.$item3);
			echo $resultStr;
		}
		
		
		public function sendShopMsg($type)
		{
			$this->postObj = simplexml_load_string($this->postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
			if ( $this->postObj == NULL )
				return;
			$fromUsername = $this->postObj->FromUserName;
			$toUsername = $this->postObj->ToUserName;
			$time = time();
			$textTpl = "<xml>
						<ToUserName><![CDATA[%s]]></ToUserName>
						<FromUserName><![CDATA[%s]]></FromUserName>
						<CreateTime>%s</CreateTime>
						<MsgType><![CDATA[news]]></MsgType>
						<ArticleCount>1</ArticleCount>
						<Articles>
						%s
						</Articles>
						</xml>";
			$itemTpl = "<item>
						<Title><![CDATA[%s]]></Title> 
						<Description><![CDATA[%s]]></Description>
						<PicUrl><![CDATA[%s]]></PicUrl>
						<Url><![CDATA[%s]]></Url>
						</item>";
			$notifyText = "";
			$introduceText = "";
			$coverImage = SIZEURL."/public/images/cover.jpg";
			$dbObj = new configDb($this->shopinfo);
			$data = $dbObj->getSystemInfo();
			if ( $data != null && array_key_exists("cover", $data) )
			{
				$coverImage = SIZEURL."/customer/".$this->shopinfo."/images/".$data["cover"];
			}
			if ( $data != null && array_key_exists("userNotice", $data) )
			{
				$notifyText = $data["userNotice"];
			}
			if ( $data != null && array_key_exists("shopInfo", $data) )
			{
				$introduceText = $data["shopInfo"];
			}
			//error_log($coverImage,0);
			$mainUrl = SIZEURL."/wechat/main.html?shopinfo=".$this->shopinfo."&time=".$time;
			$authUrl = sprintf(AUTHTPL,$mainUrl);
			if ( $type == 1 )
				$item1 = sprintf($itemTpl, "餐厅介绍", $introduceText, $coverImage, $authUrl);
			else if ( $type == 2 )
				$item1 = sprintf($itemTpl, "订餐须知", $notifyText, $coverImage, $authUrl);
				
			$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $item1);
			
			echo $resultStr;
		}
	}
?>
