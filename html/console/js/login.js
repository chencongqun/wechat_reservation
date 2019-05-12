function rememberPwd()
{
	var currentValue = getCookie("needRememberPwdConsole");
	if ( currentValue == null )
		currentValue = 0;
	if ( currentValue == 0 )
	{
		currentValue = 1;
		$F("rememberPwdIcon").className = "icon_login checkbox_checked";
	}
	else
	{
		currentValue = 0;
		$F("rememberPwdIcon").className = "icon_login checkbox";
	}
	setCookie("needRememberPwdConsole", currentValue);
}

function init()
{
	var currentValue = getCookie("needRememberPwdConsole");
	if ( currentValue == 0 || currentValue == null )
		$F("rememberPwdIcon").className = "icon_login checkbox";
	else
	{
		var account = getCookie("consoleAccount");
		$F("username").value = account;
		$F("rememberPwdIcon").className = "icon_login checkbox_checked";
	}
	
}

function login_response(response)
{
	
	if ( response.code == 0 )
		window.location.href = "/console/main.html";
	else if ( response.code == -1 )
		$F("err_msg").innerHTML="账号不存在";
	else 
		$F("err_msg").innerHTML="用户名密码错误";
}

function login()
{
	var username = $F("username").value;	
	var password = $F("password").value;
	$F("err_msg").innerHTML="";
	if ( getCookie("needRememberPwdConsole") == 1 )
		setCookie("consoleAccount", username);
		
	var url = "/console/login.php?username="+username+"&password="+md5(password);
	getJson(url, login_response);
}

