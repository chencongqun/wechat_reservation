var type = "addAccount";
var currentId = null;
var currentPage = null;
function init()
{
	currentId = GetArgsFromHref(window.location.href, "id");
	if (  currentId != null )
	{
		type = "editAccount";
		getAccountInfo(currentId);
	}
	currentPage = GetArgsFromHref(window.location.href, "page");
}

function getAccountInfo(id)
{
	var url = "/console/account.php?opt=getAccountInfo&id="+id;
	getJson(url, function handler(result){
								    if ( checkExpired(result) )
										return;
								  	var data = result.data;
									$F("companyName").value = data.companyName;
									$F("remark").value = data.remark;
									$F("city").value = data.city;
									$F("district").value = data.district;
								  	$F("address").value = data.address;
									$F("accountType").value = data.accountType;
									
									$F("account").style.display = "";
									$F("accountName").value = data.username;
									$F("registerDate").style.display = "";
									$F("registerDateStr").value = date2str(new Date(parseInt(data.registerDate)*1000),"yyyy-MM-dd");
									$F("license").style.display = "";
									var tenancy = parseInt(data.registerDate) + parseInt(data.tenancy) * 2630000;
									tenancy = tenancy * 1000;
									$F("licenseDate").value = date2str(new Date(tenancy),"yyyy-MM-dd");
									$F("shortMessage").style.display = "";
									$F("shortMessageNum").value = data.smNum;
									
								  });
}

function submit_data()
{
	if ( $F("companyName").value == "" )
	{
		$F("spanCompanyNameMsg").className = "warning";
		$F("spanCompanyNameMsg").innerHTML = "«Î ‰»Î√˚≥∆";
		return;
	}
	if ( $F("address").value == "" )
	{
		$F("spanAddressMsg").className = "warning";
		$F("spanAddressMsg").innerHTML = "«Î ‰»Îµÿ÷∑";
		return;
	}
	$F("form1").action = "/console/account.php?opt="+type;
	$F("id").value = currentId;
	$F("form1").submit();
}

function reset_data()
{
	$F("companyName").value = "";
	$F("remark").value = "";
	$F("address").value = "";
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
				window.location.href = "/console/accountManager.html?page=" + currentPage;
			else
				window.location.href = "/console/accountManager.html";
		}
		else if ( jsonObj.code = -102 )
		{
				$F("spanErrorMsg").className = "warning";
				$F("spanErrorMsg").innerHTML = "ÃÌº”’À∫≈ ß∞‹£¨«Î÷ÿ ‘£°";
		}
	}
	catch(e)
	{
		window.location.reload();
	}
}
