

function init(type)
{
	var url = "/admin/systemSetting.php?opt=getSystemInfo";
	getJson( url, function handler(result){
								   
								   	if ( checkExpired(result) )
										return;
									if ( "data" in result )
									{
										var data = result["data"];
										if ( type == 1 )
										{
											$F("title").value = data["title"];
											$F("phone").value = data["phone"];
											if ( "cover" in data )
											{
												$F("path").value = data["cover"];
												$F("cover").style.display = "";	
												$F("coverImg").src = data["imagesPath"] + data["cover"];
											}
										}
										
										if ( type==2 )
											$F("shopInfo").innerHTML = data["shopInfo"];
										if ( type==3 )
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

function submit_data(type)
{
	if ( type == 1 )
	{
		$F("spanFileMsg").innerHTML = "";
		$F("spanFileMsg").className = "nowarning";
		$F("spanTitleMsg").innerHTML = "";
		$F("spanTitleMsg").className = "nowarning";
		$F("spanPhoneMsg").innerHTML = "";
		$F("spanPhoneMsg").className = "nowarning";
		if ( $F("title").value == "" )
		{
			$F("spanTitleMsg").innerHTML = "请输入商户名称";
			$F("spanTitleMsg").className = "warning";
			$F("title").focus();
			return;
		}
		if ( $F("phone").value == "" )
		{
			$F("spanPhoneMsg").innerHTML = "请输入订餐电话";
			$F("spanPhoneMsg").className = "warning";
			$F("phone").focus();
			return;
		}
	}
	$F("form1").submit();
}
