
function init()
{
	var url = "/admin/systemSetting.php?opt=getPublicAccount";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									if ( "account" in result )
									{
										$F("account").value = result["account"];
										$F("password").value = "HelloWorld123!@#";
									}
								  });
}

function submit_data()
{
	var account = $F("account").value;
	var password = $F("password").value;
	if ( account == "" || account == null )
	{
		$F("spanAccountMsg").innerHTML = "请输入公众号账号";
		return;	
	}
	if ( password == "" || password == null )
	{
		$F("spanPasswdMsg").innerHTML = "请输入公众号密码";
		return;	
	}
	var url = "/admin/systemSetting.php?opt=setPublicAccount&account="+account;
	if ( password != "HelloWorld123!@#" )
		url +="&password=" + password;
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}
