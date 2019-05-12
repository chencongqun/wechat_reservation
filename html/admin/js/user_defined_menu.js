
function init()
{
	var url = "/admin/systemSetting.php?opt=getUserDefinedMenu";
	getJson( url, function handler(result){
								   	if ( checkExpired(result) )
										return;
									if ( "data" in result )
									{
										var data = result["data"];
										for ( var i=0; i<3; i++ )
										{
											var key = ""+i;
											if ( key in data )
											{
												$F("name"+i).value = data[key]["name"];
												$F("type"+i).value = data[key]["type"];
												changeType(i);
												$F("standardValue"+i).value = data[key]["standardValue"];
												$F("urlValue"+i).value = data[key]["urlValue"];
											}
										}
										if ( "shopInfo" in data )
											$F("shopInfo").value = data["shopInfo"];
										if ( "userNotice" in data )
											$F("userNotice").value = data["userNotice"];
									}
								   });
}

function submit_data()
{
	var url = "/admin/systemSetting.php?opt=setUserDefinedMenu";
	var parameter = "";
	for ( var i=0; i<3; i++ )
	{
		if ( i != 0 )
			parameter += "&";
		parameter += "name" + i + "=" + $F("name"+i).value;
		parameter += "&type" + i + "=" + $F("type"+i).value;
		parameter += "&standardValue" + i + "=" + $F("standardValue"+i).value;
		parameter += "&urlValue" + i + "=" + $F("urlValue"+i).value;
	}
	parameter += "&shopInfo=" + $F("shopInfo").value;
	parameter += "&userNotice=" + $F("userNotice").value;
	postJson(url, parameter, function handler(result){
										if ( checkExpired(result) )
											return;
										window.location.reload();
									});
}

function changeType(itemid)
{
	if ( $F("type"+itemid).value == "url" )
	{
		$F("standardValue"+itemid).style.display = "none";
		$F("urlValue"+itemid).style.display = "";
	}
	else
	{
		$F("standardValue"+itemid).style.display = "";
		$F("urlValue"+itemid).style.display = "none";
	}
}
