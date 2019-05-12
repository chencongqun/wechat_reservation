<?php
	define("TOKEN", "E625F388EEABB36274B8559D6A0B23B7");
	define("SIZEURL", "http://www.fcanting.com/");
	define("AUTHTPL", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5021cf33fd62aed7&redirect_uri=%s&response_type=code&scope=snsapi_base&state=15tec#wechat_redirect");
	function fcgi_inputdata()
	{
		try
		{
			$value = $GLOBALS["HTTP_RAW_POST_DATA"];
			if ( !empty($value) )
				return $value;
			else
				return file_get_contents("php://input");
		}
		catch( Exception $e)
		{
			error_log($e->getMessage(), 0);
			return NULL;
		}
	}
	function fcgi_getvar($key)
	{
		try
		{
			if ( array_key_exists($key, $_GET) )
				return $_GET[$key];
			else
				return NULL;
		}
		catch( Exception $e)
		{
			error_log($e->getMessage(), 0);
			return NULL;
		}
	}
	function fcgi_postvar($key)
	{
		try
		{
			if ( array_key_exists($key, $_POST) )
				return $_POST[$key];
			else
				return NULL;
		}
		catch( Exception $e)
		{
			error_log($e->getMessage(), 0);
			return NULL;
		}
	}
	function session_create()
	{
		$lifeTime = 86400;
		session_set_cookie_params($lifeTime); 
		if( !isset($_SESSION) )
			session_start();
		session_regenerate_id();
		$_SESSION["login"] = true;
	}
	function session_id_get()
	{
		if( !isset($_SESSION) )
			session_start(); 
		return session_id();
	}
	function session_auth()
	{
		if( !isset($_SESSION) )
			session_start(); 

		if (isset($_SESSION["login"]) && $_SESSION["login"] === true) 
			return true;
		else
			return false;
	}
	function session_drop()
	{
		if( !isset($_SESSION) )
			session_start(); 
		unset($_SESSION["login"]); 
		session_destroy();
	}
	function session_auth_ex()
	{
		if ( session_auth() != true )
		{
			$array_output['code'] = -101;
			$array_output['msg'] = "Session has expired";
			echo json_encode($array_output);
			return false;
		}
		else
		{
			return true;
		}
	}
	function check_dir($dir)
	{
		if ( $dir == NULL || $dir == "" )
			return;
		$tmp_dir = "/";
		$paras = split("/", $dir);
		if ( $paras == NULL )
			break;
		$length = sizeof($paras);
		for ( $i=0; $i<$length; $i++ )
		{
			if ( $paras[$i] == "" )
				continue;
			$tmp_dir = $tmp_dir.$paras[$i]."/";
			if ( !is_dir($tmp_dir) )
			{
				mkdir($tmp_dir, 0777);
			}
		}
	}
	function randomStr($length)
	{
		$random = "";
		$pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		srand ((double)microtime()*1000000);
		for($i = 0; $i < $length; $i++)
			$random .= substr( $pool,( rand()%(strlen($pool)) ), 1 );
		return $random;
	}
	
	/**
	 +------------------------------------------------------------------------------
	 *                等比例压缩图片
	 +------------------------------------------------------------------------------
	 * @param  String $src_imagename 源文件名        比如 “source.jpg”
	 * @param  int    $maxwidth      压缩后最大宽度
	 * @param  int    $maxheight     压缩后最大高度
	 * @param  String $savename      保存的文件名    “d:save”
	 * @param  String $filetype      保存文件的格式 比如 ”.jpg“
	 * @author  Yovae     <yovae@qq.com>
	 * @version  1.0
	 * size=array(//压缩后各种规格大小
         'small'=>array('width'=>75,'height'=>75),
         'origin'=>array('width'=>180,'height'=>240),
         'big'=>array('width'=>800,'height'=>600),
         );
	 +------------------------------------------------------------------------------
	 */
	function resizeImage($src_imagename,$maxwidth,$maxheight,$savename,$filetype)
	{
		$im=imagecreatefromjpeg($src_imagename);
		$current_width = imagesx($im);
		$current_height = imagesy($im);

		if(($maxwidth && $current_width > $maxwidth) || ($maxheight && $current_height > $maxheight))
		{
			if($maxwidth && $current_width>$maxwidth)
			{
				$widthratio = $maxwidth/$current_width;
				$resizewidth_tag = true;
			}

			if($maxheight && $current_height>$maxheight)
			{
				$heightratio = $maxheight/$current_height;
				$resizeheight_tag = true;
			}

			if($resizewidth_tag && $resizeheight_tag)
			{
				if($widthratio<$heightratio)
					$ratio = $widthratio;
				else
					$ratio = $heightratio;
			}

			if($resizewidth_tag && !$resizeheight_tag)
				$ratio = $widthratio;
			if($resizeheight_tag && !$resizewidth_tag)
				$ratio = $heightratio;

			$newwidth = $current_width * $ratio;
			$newheight = $current_height * $ratio;

			if(function_exists("imagecopyresampled"))
			{
				$newim = imagecreatetruecolor($newwidth,$newheight);
				imagecopyresampled($newim,$im,0,0,0,0,$newwidth,$newheight,$current_width,$current_height);
			}
			else
			{
				$newim = imagecreate($newwidth,$newheight);
			   imagecopyresized($newim,$im,0,0,0,0,$newwidth,$newheight,$current_width,$current_height);
			}

			$savename = $savename.$filetype;
			imagejpeg($newim,$savename);
			imagedestroy($newim);
		}
		else
		{
			$savename = $savename.$filetype;
			imagejpeg($im,$savename);
		}           
	}
	
	function downloadFile($path, $filename)
	{
		ob_clean();
		$filename=iconv("UTF-8","GB2312",$filename);
		$filepath=$path.'/'.$filename;
		
		if(!file_exists($filepath)){
		echo "文件不存在";
		return;
		}

		$fp=fopen($filepath,"r");

		$file_Size=filesize($filepath);

		header("Content-type:application/octet-stream");
		header("Accept-Ranges:bytes");
		header("Accept-Length:".$file_Size);
		header("Content-Disposition: attachment; filename=".$filename);

		$buffer=1024;
		$buffer_count=0;

		while( !feof($fp) && $file_Size-$buffer_count>0 )
		{
			$data=fread($fp,$buffer);
			$buffer_count+=$buffer;
			echo $data;

		}
		fclose($fp);
	}
   
?>
