

function init()
{
	var url = "/admin/systemSetting.php?opt=getAutoResponse";
	getJson( url, function handler(result){
								   
								   	if ( checkExpired(result) )
										return;
									if ( "data" in result )
									{
										var data = result["data"];
										$F("name").value = data["name"];
										$F("keyword").value = data["keyword"];
										$F("type").value = data["type"];
										changeType();
										$F("textContent").value = data["textContent"];
										$F("mediaTitle").value = data["mediaTitle"];
										$F("path").value = data["mediaPicture"];
										$F("mediaContent").value = data["mediaContent"];
										if ( $F("type").value == "media" )
										{
											$F("cover").style.display = "";	
											$F("coverImg").src = data["imagesPath"] + data["mediaPicture"];
										}
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
	$F("spanNameMsg").innerHTML = "";
	$F("spanNameMsg").className = "nowarning";
	if ( $F('name').value == "" )
	{
		$F("spanNameMsg").innerHTML = "请输入规则名称";
		$F("spanNameMsg").className = "warning";
		return;
	}
	if ( $F("type").value == "1" )
	{
		$F("spanTitleMsg").innerHTML = "";
		$F("spanTitleMsg").className = "nowarning";
		$F("spanFileMsg").innerHTML = "";
		$F("spanFileMsg").className = "nowarning";
		if ( $F('mediaTitle').value == "" )
		{
			$F("spanTitleMsg").innerHTML = "请输入标题";
			$F("spanTitleMsg").className = "warning";
			return;
		}
		if ( $F("path").value == "" )
		{
			$F("spanFileMsg").innerHTML = "请选择图片";
			$F("spanFileMsg").className = "warning";
			return;
		}
	}
	$F("form1").submit();
}

function changeType()
{
	if ( $F("type").value == "text" )
	{
		$F("response_text").style.display = "";
		$F("response_media").style.display = "none";
	}
	else
	{
		$F("response_text").style.display = "none";
		$F("response_media").style.display = "";
	}
}