function $F(name)
{
	return document.getElementById(name);	
}
// JavaScript Document
var _env = (function() {
    var f = navigator.userAgent,
    b = null,
    c = function(h, i) {
        var g = h.split(i);
        g = g.shift() + "." + g.join("");
        return g * 1
    },
    d = {
        ua: f,
        version: null,
        ios: false,
        android: false,
        windows: false,
        blackberry: false,
        meizu: false,
        weixin: false,
        wVersion: null,
        qq: false,
        qVersion: null,
        touchSupport: ("createTouch" in document),
        hashSupport: !!("onhashchange" in window)
    };
    b = f.match(/MicroMessenger\/([\.0-9]+)/);
    if (b != null) {
        d.weixin = true;
        d.wVersion = c(b[1], ".")
    }
    b = f.match(/QQ\/([\d\.]+)$/);
    if (b != null) {
        d.qq = true;
        d.qVersion = c(b[1], ".")
    }
    b = f.match(/Android(\s|\/)([\.0-9]+)/);
    if (b != null) {
        d.android = true;
        d.version = c(b[2], ".");
        d.meizu = /M030|M031|M032|MEIZU/.test(f);
        return d
    }
    b = f.match(/i(Pod|Pad|Phone)\;.*\sOS\s([\_0-9]+)/);
    if (b != null) {
        d.ios = true;
        d.version = c(b[2], "_");
        return d
    }
    b = f.match(/Windows\sPhone\sOS\s([\.0-9]+)/);
    if (b != null) {
        d.windows = true;
        d.version = c(b[1], ".");
        return d
    }
    var e = {
        a: f.match(/\(BB1\d+\;\s.*\sVersion\/([\.0-9]+)\s/),
        b: f.match(/\(BlackBerry\;\s.*\sVersion\/([\.0-9]+)\s/),
        c: f.match(/^BlackBerry\d+\/([\.0-9]+)\s/),
        d: f.match(/\(PlayBook\;\s.*\sVersion\/([\.0-9]+)\s/)
    };
    for (var a in e) {
        if (e[a] != null) {
            b = e[a];
            d.blackberry = true;
            d.version = c(b[1], ".");
            return d
        }
    }
    return d
} ());
_touchSupport = _env.ios || _env.android || _env.touchSupport;
_movestartEvt = _touchSupport ? "touchstart": "mousedown";
_moveEvt = _touchSupport ? "touchmove": "mousemove";
_moveendEvt = _touchSupport ? "touchend": "mouseup";

_onPageLoaded = function(a) 
{
    window.addEventListener("DOMContentLoaded", a)
};

_queryOne = function(obj, src) 
{
    if (src && typeof src === "string") 
	{
        try 
		{
            src = _queryOne(src)
        }
		catch(error) 
		{
            console.log(error);
            return
        }
    }
    return (src || document).querySelector(obj)
};

_queryAll = function(obj, src) 
{
    if (src && typeof src === "string") 
	{
        try 
		{
            src = _queryOne(src)
        }
		catch(error) 
		{
            console.log(error);
            return
        }
    }
    return (src || document).querySelectorAll(obj)
};

_addEventListener = function(obj, type, listener)
{
	try
	{
		obj.addEventListener(type, listener);
	}
	catch(e)
	{
		obj.attachEvent("on"+type, listener);
	}
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

function getEventTarget()
{
	var ev = window.event || arguments.callee.caller.arguments[0];
	var target = ev.srcElement ? ev.srcElement : ev.target;
	return target;
}

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

function GetRandomNum(Min,Max)
{
	var Range = Max - Min;
	var Rand = Math.random();
	return(Min + Math.round(Rand * Range));   
}

function quick_sort(array, compareFun)
{
	var length = array.length;
	recursive_quicksort(array, 0, length-1, compareFun);
}

function recursive_quicksort(array, p, q, compareFun)
{
	if ( p < q )
	{
		var r = partition(array, p, q, compareFun);
		recursive_quicksort(array, p, r-1, compareFun);
		recursive_quicksort(array, r+1, q, compareFun);
	}
}

function partition(array, p, q, compareFun)
{
	var keyvalue = array[p];
	var i = p;
	var j = q;
	
	while( i < j )
	{
		for ( ;j>i;j-- )	
		{
			if ( compareFun( array[j] ,keyvalue ) == false )
			{
				array[i] = array[j];
				break;
			}
		}
		for ( ;i<j;i++ )
		{
			if ( compareFun( array[i] ,keyvalue ) == true )
			{
				array[j] = array[i];
				break;
			}
		}
	}
	array[i] = keyvalue;
	return i;
}

function setLocalStorage(itemName, itemValue)
{
	window.localStorage.setItem(itemName, itemValue);
}

function getLocalStorage(itemName)
{
	return window.localStorage.getItem(itemName);
}

function dialogBox(str, msgw, msgh, functionName)
{ 
    var bordercolor;
    titleheight=25 //title Height
    bordercolor="#336699";//boder color
    titlecolor="#99CCFF";//title color
   
    var sWidth,sHeight; 
    sWidth=document.body.offsetWidth; 
    sHeight=screen.height; 
    var bgObj=document.createElement("div"); 
    bgObj.setAttribute('id','bgDiv'); 
    bgObj.style.position="absolute"; 
    bgObj.style.top="0"; 
    bgObj.style.background="#777"; 
    bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75"; 
    bgObj.style.opacity="0.6"; 
    bgObj.style.left="0"; 
    bgObj.style.width=sWidth + "px"; 
    bgObj.style.height=sHeight + "px"; 
    bgObj.style.zIndex = "10000"; 
    document.body.appendChild(bgObj); 
     
    var msgObj=document.createElement("div") 
    msgObj.setAttribute("id","msgDiv"); 
    msgObj.setAttribute("align","center"); 
    msgObj.style.background="white"; 
    msgObj.style.border="1px solid " + bordercolor; 
    msgObj.style.position = "fixed"; 
    msgObj.style.left = "50%"; 
    msgObj.style.top = "50%"; 
    msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif"; 
    msgObj.style.marginLeft = -msgw/2 + "px"; 
    msgObj.style.marginTop = -75+document.documentElement.scrollTop+"px"; 
    msgObj.style.width = msgw + "px"; 
    msgObj.style.height =msgh + "px"; 
    msgObj.style.textAlign = "center"; 
    msgObj.style.lineHeight ="25px"; 
    msgObj.style.zIndex = "10001"; 
     
    var title=document.createElement("h4"); 
    title.setAttribute("id","msgTitle"); 
    title.setAttribute("align","right"); 
    title.style.margin="0"; 
    title.style.padding="3px"; 
    title.style.background=bordercolor; 
    title.style.filter="progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);"; 
    title.style.opacity="0.75"; 
    title.style.border="1px solid " + bordercolor; 
    title.style.height="18px"; 
    title.style.font="12px microsoft yahei";
    title.style.color="white"; 
    title.style.cursor="pointer";
    document.body.appendChild(msgObj); 
    document.getElementById("msgDiv").appendChild(title); 
    var txt=document.createElement("p"); 
    txt.style.margin="1em 5px" 
    txt.setAttribute("id","msgTxt"); 
	txt.style.font="14px microsoft yahei";
    txt.innerHTML=str; 
    document.getElementById("msgDiv").appendChild(txt); 

	var btnDiv = document.createElement("div");
	btnDiv.setAttribute("align","center");
	
	if ( functionName != null )
	{
		var btn = document.createElement("input");
		btn.setAttribute("type","button");
		btn.setAttribute("value","确定");
		btn.setAttribute("class","btn");
		btn.onclick=function(){ 
			functionName();
			document.body.removeChild(bgObj); 
		   document.getElementById("msgDiv").removeChild(title); 
		   document.body.removeChild(msgObj);
		};
		btnDiv.appendChild(btn);
		
		btn = document.createElement("input");
		btn.setAttribute("type","button");
		btn.setAttribute("value", "取消");
		btn.setAttribute("class","btn");
		btn.onclick=function(){ 
			   document.body.removeChild(bgObj); 
			   document.getElementById("msgDiv").removeChild(title); 
			   document.body.removeChild(msgObj); 
		};
		btnDiv.appendChild(btn);
	}
	else
	{
		var btn = document.createElement("input");
		btn.setAttribute("type","button");
		btn.setAttribute("value","确定");
		btn.setAttribute("class","btn");
		btn.onclick=function(){ 
			   document.body.removeChild(bgObj); 
			   document.getElementById("msgDiv").removeChild(title); 
			   document.body.removeChild(msgObj); 
			 };
		btnDiv.appendChild(btn);
	}
	document.getElementById("msgDiv").appendChild(btnDiv);
 }
 
 function sAlert(str)
 { 
    dialogBox(str, 210, 115, null);
 }
 
 function sConfirm(str, functionName)
 {
	 dialogBox(str, 210, 115, functionName);
 }
 function sAlertBig(str)
 {
	 dialogBox(str, 210, 135, null);
 }
 
 function date2str(x,y) 
 {
	 var z = {M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
	 y = y.replace(/(M+|d+|h+|m+|s+)/g,function(v){return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-2)});
	 return y.replace(/(y+)/g,function(v) {return x.getFullYear().toString().slice(-v.length)});
 }
 
 