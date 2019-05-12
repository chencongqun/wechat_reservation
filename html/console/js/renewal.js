var currentId = null;
var currentPage = null;
function init()
{
	currentId = GetArgsFromHref(window.location.href, "id");
	currentPage = GetArgsFromHref(window.location.href, "page");
}

function submit_data()
{
	$F("form1").action = "/console/account.php?opt=renewal";
	$F("id").value = currentId;
	$F("form1").submit();
}

function reset_data()
{
	$F("smNum").value = "0";
	$F("tenancy").value = "0";
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
				$F("spanErrorMsg").innerHTML = "–¯∑— ß∞‹£¨«Î÷ÿ ‘£°";
		}
	}
	catch(e)
	{
		window.location.reload();
	}
}
