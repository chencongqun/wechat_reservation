
function init()
{
	var url = "/admin/systemSetting.php?opt=getPrinterInfo";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									if ( "data" in result )
									{
										$F("status").checked = result["data"]["status"]=="1" ? true: false;
										$F("printType").value = result["data"]["printType"];
										$F("machine_code").value = result["data"]["machine_code"];
										$F("machine_key").value = result["data"]["machine_key"];
									}
								  });
}

function submit_data()
{
	var status = $F("status").checked ? 1 : 0;
	var machine_code = $F("machine_code").value;
	var machine_key = $F("machine_key").value;
	var printType = $F("printType").value;
	if ( status == 1 )
	{
		if ( machine_code == "" || machine_code== null )
		{
			$F("spanCodeMsg").className = "warning";
			$F("spanCodeMsg").innerHTML = "«Î ‰»Î¥Ú”°ª˙±‡∫≈";
			return;	
		}
		if ( machine_key == "" || machine_key == null )
		{
			$F("spanKeyMsg").className = "warning";
			$F("spanKeyMsg").innerHTML = "«Î ‰»Î¥Ú”°ª˙√‹‘ø";
			return;	
		}
	}
	var url = "/admin/systemSetting.php?opt=setPrinterInfo&status=" + status + "&printType=" + printType + "&machine_code=" + machine_code + "&machine_key=" + machine_key;
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}
