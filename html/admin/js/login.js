function rememberPwd()
{
	var currentValue = getCookie("needRememberPwd");
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
	setCookie("needRememberPwd", currentValue);
}

function init()
{
	var currentValue = getCookie("needRememberPwd");
	if ( currentValue == 0 || currentValue == null )
		$F("rememberPwdIcon").className = "icon_login checkbox";
	else
	{
		var account = getCookie("adminAccount");
		$F("username").value = account;
		$F("rememberPwdIcon").className = "icon_login checkbox_checked";
	}
	
}

function login_response(response)
{
	
	if ( response.code == 0 )
		window.location.href = "/admin/main.html";
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
	if ( getCookie("needRememberPwd") == 1 )
		setCookie("adminAccount", username);
		
	var url = "/admin/adminLogin.php?username="+username+"&password="+md5(password);
	getJson(url, login_response);
}

