var shopinfo="";
var openid = "";
var statusMsg = ["未审核","已接单","已拒绝"];

function init()
{
	shopinfo = GetArgsFromHref(window.location.href, "shopinfo");
	if ( shopinfo == null )	
		shopinfo = getLocalStorage("shopinfo");
	openid = GetArgsFromHref(window.location.href, "openid");
	if ( openid == null )
		openid = getLocalStorage("openid");
		
	var code = GetArgsFromHref(window.location.href, "code");
	
	if ( openid != null && openid != "null" )
	{
		var url = "/wechat/customer.php?opt=getOrderList&shopinfo="+shopinfo+"&openid=" + openid;
		getJson( url, fillOrderList );
	}
	else if ( code != null )
	{
		var url = "/wechat/customer.php?opt=getOpenid&code="+code;
		getJson( url, function handler(result){
									   
									   	openid = result["openid"];
									   	setLocalStorage("openid", openid);
										var url = "/wechat/customer.php?opt=getOrderList&shopinfo="+shopinfo+"&openid=" + openid;
										getJson( url, fillOrderList );
									   } );
	}
}

function fillOrderList( result )
{
	var data = result["data"];
	var length = data.length;
	if ( length <= 0 )
	{
		$F("content").innerHTML = '<dl class="myOrderDl"><dt class="orderState">您还没有任何订单</dt></dl>';
		return;
	}
	var index=0;
	var contentObj = $F("content");
	contentObj.innerHTML = "";
	for ( var i=length-1; i>=0; i-- )
	{
		var newNode = document.createElement("dl");
		newNode.className = "myOrderDl";
		
		var submittime = new Date( parseInt(data[i]["time"]) * 1000 );
		var dtObj = document.createElement("dt");
		dtObj.className = "orderState";
		dtObj.innerHTML = date2str(submittime,"yyyy-MM-dd hh:mm:ss")+"<em></em><i>订单状态：<span style='color:#FF0000;'> "+statusMsg[data[i]["status"]]+" </span></i>";
		newNode.appendChild(dtObj);
			
		var ddObj = document.createElement("dd");
		ddObj.className = "orderMenu";
		var ddObjHtml = '<span class="topjiao"></span>' + 
		'<p><label>联系电话：</label>' + data[i]["phone"] + '</p>' + 
		'<p class="box"><label>详细地址：</label>' + data[i]["address"] +'</p>' + 
		'<p class="zongjia"><label>总&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计：</label><span>'+data[i]["totalPrice"]+'</span>元 </p>';
		
		if ( "orderData" in data[i] )
		{
			var orderData = data[i]["orderData"];
			ddObjHtml += '<dl>';
			for ( var j=0; j<orderData.length; j++ )
			{
				var price = parseInt(orderData[j]["price"]) * parseInt(orderData[j]["selectNum"])
				ddObjHtml += '<dd><span class="fr"><span class="danjia">' + price + 
				'元</span></span><b>'+ orderData[j]["name"] + '</b><i>X' + orderData[j]["selectNum"] + '</i> </dd>';
			}
			ddObjHtml += '</dl>';
		}
		
		if ( "shopResponse" in data[i] && data[i]["shopResponse"]!="")
		{
			ddObjHtml += '<p class="box" style="color:#FF0000; border-top:1px solid #e7e7e7;"><label>商家回复：</label>'+data[i]["shopResponse"]+'</p>';	
		}
		
		ddObj.innerHTML = ddObjHtml;
		newNode.appendChild(ddObj);
		
		contentObj.appendChild(newNode);
	}
	
}

function backToMain()
{
	var url = "/wechat/main.html?shopinfo="+shopinfo+"&openid="+openid+"&useLocalStorage=true"+"&time="+new Date().getTime();
	window.location.href = url;	
}
