

function init()
{
	var url = "/admin/systemSetting.php?opt=getSystemInfo";
	getJson( url, function handler(result){
								   
								   	if ( checkExpired(result) )
										return;
									if ( "data" in result )
									{
										var data = result["data"];
										$F("title").value = data["title"];
										if ( "cover" in data )
										{
											$F("path").value = data["cover"];
											$F("cover").style.display = "";	
											$F("coverImg").src = data["imagesPath"] + data["cover"];
										}
										if ( $F("shopInfo") != null )
											$F("shopInfo").innerHTML = data["shopInfo"];
										if ( $F("userNotice") != null )
											$F("userNotice").innerHTML = data["userNotice"];	
									}
								   });
								 
}

function iframeOnload()
{
	var result = $F('uploadframe').contentWindow.document.body.innerText;
	if ( result == null || result=="" )
		return;
	window.location.reload();
}

function submit_data()
{
	$F("spanFileMsg").innerHTML = "";
	$F("spanFileMsg").className = "nowarning";
	$F("spanTitleMsg").innerHTML = "";
	$F("spanTitleMsg").className = "nowarning";
	if ( $F("title").value == "" )
	{
		$F("spanTitleMsg").innerHTML = "请输入标题";
		$F("spanTitleMsg").className = "warning";
		$F("title").focus();
		return;
	}
	/*if ( $F("path").value == "" )
	{
		$F("spanFileMsg").innerHTML = "请选择图片";
		$F("spanFileMsg").className = "warning";
		$F("path").focus();
		return;
	}*/
	$F("form1").submit();
}
