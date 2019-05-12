var type = "addDish";
var currentId = null;
var currentPage = null;
function init()
{
	currentId = GetArgsFromHref(window.location.href, "id");
	initOptionValue();
	if (  currentId != null )
	{
		type = "editDish";
		getDishInfo(currentId);
	}
	currentPage = GetArgsFromHref(window.location.href, "page");
}

function initOptionValue()
{
	var url = "/admin/dishes.php?opt=getCategoryNameList";
	getJson(url, function handler(result){
								  
								  	var length = result.length;
									var optionHtml = "";
									for ( var i=0; i<length; i++ )
									{
										optionHtml += '<option value="'+result[i].name+'">' + result[i].name + '</option>';
									}
									$F("class_select").innerHTML = optionHtml;
								  });
}

function getDishInfo(id)
{
	var url = "/admin/dishes.php?opt=getDishInfo&id="+id;
	getJson(url, function handler(result){
								  	
									$F("name").value = result.name;
									$F("desc").value = result.desc;
									$F("price").value = result.price;
									$F("class_select").value = result["class"];
								  	$F("priority").value = result.priority;
									$F("unit").value = result["unit"];
									if ( "hotsale" in result )
										$F("hotsale").checked = result["hotsale"]=="1" ? true: false;
									if ( "pictureName" in result )
									{
										$F("path").value = result.pictureName;
										$F("cover").style.display = "";	
										$F("coverImg").src = result["imagesPath"] + result.pictureName;
									}
								  });
}

function submit_data()
{
	if ( $F("name").value == "" )
	{
		$F("spanNameMsg").className = "warning";
		$F("spanNameMsg").innerHTML = "请输入名称";
		return;
	}
	if ( $F("price").value == "" )
	{
		$F("spanPriceMsg").className = "warning";
		$F("spanPriceMsg").innerHTML = "请输入价格";
		return;
	}
	if ( $F("unit").value == "" )
	{
		$F("spanUnitMsg").className = "warning";
		$F("spanUnitMsg").innerHTML = "请输入单位";
		return;
	}
	$F("hotsalevalue").value = $F("hotsale").checked ? 1 : 0;
	$F("form1").action = "/admin/dishes.php?opt="+type;
	$F("id").value = currentId;
	$F("form1").submit();
}

function reset_data()
{
	$F("name").value = "";
	$F("desc").value = "";
	$F("price").value = "";
	$F("class_select").value = "";
	$F("priority").value = "";
}

function iframeOnload()
{
	try
	{
		var result = $F('uploadframe').contentWindow.document.body.innerText;
		if ( result == null || result=="" )
			return;
		jsonObj = eval("("+result+")");
		if ( jsonObj.code == 0 )
		{
			if ( currentPage != null )
				window.location.href = "/admin/dishes_list.html?page=" + currentPage;
			else
				window.location.href = "/admin/dishes_list.html";
		}
		else if ( jsonObj.code = -102 )
		{
				$F("spanErrorMsg").className = "warning";
				$F("spanErrorMsg").innerHTML = "名称已存在";
		}
	}
	catch(e)
	{
		window.location.reload();
	}
}
