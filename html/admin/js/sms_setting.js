
function init()
{
	var url = "/admin/systemSetting.php?opt=getShortMessage";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									if ( "data" in result )
									{
										$F("status").checked = result["data"]["status"]=="1" ? true: false;
										$F("telephone").value = result["data"]["telephone"];
									}
								  });
}

function submit_data()
{
	var status = $F("status").checked ? 1 : 0;
	var telephone = $F("telephone").value;
	if ( status == 1 && ( telephone == "" || telephone == null ) )
	{
		$F("spanPhoneMsg").className = "warning";
		$F("spanPhoneMsg").innerHTML = "«Î ‰»ÎµÁª∞∫≈¬Î";
		return;	
	}
	var url = "/admin/systemSetting.php?opt=setShortMessage&status="+status+"&telephone="+telephone;
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}
