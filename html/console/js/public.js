function getCookie(name) 
{
	var result = null;
	var cookieValue = document.cookie;
	var pos = cookieValue.indexOf(name + "=");
	if (pos > -1) 
	{
		var start = cookieValue.indexOf("=", pos) + 1;
		var end = cookieValue.indexOf(";", start);
		if (end == -1) 
		{
			end = cookieValue.length;
		}
		result = unescape(cookieValue.substring(start, end));
	}
	return result;
}

function setCookie(cookiename, cookievalue) 
{
	var date = new Date();
	date.setTime(date.getTime() + 10*365*24*3600*1000);
	var value = cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString();
	document.cookie = value;
}

function Deletecookie (name)
{ 		
	var exp = new Date();    
	exp.setTime (exp.getTime() - 1);    
	var cval = GetCookie (name);    
	document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();  
}

function $F(name)
{
	return document.getElementById(name);	
}

/**
 * 发送ajax请求
 * url--url
 * methodtype(post/get)
 * con (true(异步)|false(同步))
 * parameter(参数)
 * functionName(回调方法名)
 */
function ajaxrequest(url,methodtype,con,parameter,functionName){
    var xmlhttp;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
	} catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } 
			catch (e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					console.log("Create XMLHttpObj failed!");
					return false;
				}
       		 }
    }
    xmlHttp.onreadystatechange=function()
	{
        if(xmlHttp.readyState==4)
		{
			if ( functionName != null )
           		functionName(xmlHttp.responseText);
        }
    };
    xmlHttp.open(methodtype,url,con);
    xmlHttp.send(parameter);
}

function createXMLObj()
{
	var xmlHttp;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
	} catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } 
			catch (e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
					console.log("Create XMLHttpObj failed!");
					return false;
				}
       		 }
    }
	return xmlHttp;
}

function getJson(url, functionName)
{
	try
	{
		var xmlHttp = createXMLObj();
		if ( !xmlHttp )
			return null;
		 xmlHttp.onreadystatechange=function()
		{
			if(xmlHttp.readyState==4)
			{
				if ( functionName != null )
				{
					var response = xmlHttp.responseText;
					if ( typeof(response)=='undefined' || response=="" )
						return;
					jsonObj = eval("("+response+")");
					functionName(jsonObj);
				}
			}
		};
		xmlHttp.open("get", url, true);
		xmlHttp.send(null);
	}
	catch(e)
	{
		console.log(e.message);
	}
}

function postJson(url, parameter, functionName)
{
	
	try
	{
		var xmlHttp = createXMLObj();
		if ( !xmlHttp )
			return null;
		 xmlHttp.onreadystatechange=function()
		{
			if(xmlHttp.readyState==4)
			{
				if ( functionName != null )
				{
					var response = xmlHttp.responseText;
					if ( typeof(response)=='undefined' || response=="" )
						return;
					jsonObj = eval("("+response+")");
					functionName(jsonObj);
				}
			}
		};
		xmlHttp.open("POST",url,true);
		xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
		xmlHttp.send(parameter);	
	}
	catch (e) {
		console.log(e.message);	
	}
}

String.prototype.applyTemplate = function(obj) {
	var str = this;
	for (key in obj) {
		var reg = new RegExp("%" + key + "%", "g");
		str = str.replace(reg, obj[key]);
		reg = null;
	}
	return str;
}

function GetArgsFromHref(sHref, sArgName)
{
	try
	{
		if ( sHref == null )
			return null;
		var args = sHref.split("?");
		var retval = null;
		if ( args[0] == sHref )
		{
			return retval;
		}
		var str = args[1];
		args = str.split("&");
		for ( var i = 0; i<args.length; i++)
		{
			str = args[i];
			var arg = str.split("=");
			if ( arg.length <= 1 )
				continue;
			if ( arg[0] == sArgName )
				retval = arg[1];
		}
		return retval;
	}
	catch(e)
	{
		return null;
	}
	
}

function checkExpired(result)
{
	if ( result.code == -101 )
	{
		parent.parent.location.href = "/admin/login.html"
		return true;
	}
	return false;
}

function date2str(x,y) 
{
	 var z = {M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
	 y = y.replace(/(M+|d+|h+|m+|s+)/g,function(v){return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-2)});
	 return y.replace(/(y+)/g,function(v) {return x.getFullYear().toString().slice(-v.length)});
}
 
