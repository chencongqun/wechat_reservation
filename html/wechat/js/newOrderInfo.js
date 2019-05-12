var id;
var shopinfo
var statusMsg = ["未审核","已接单","已拒绝"];
function init()
{
	id = GetArgsFromHref(window.location.href, "id");
	shopinfo = GetArgsFromHref(window.location.href, "shopinfo");
	var url = "/wechat/customer.php?opt=getOrderInfo&id=" + id + "&shopinfo=" + shopinfo + "&time=" + new Date().getTime();
	getJson( url, fillOrderInfo );
}

function fillOrderInfo(result)
{
	if ( "data" in result )
	{
		var data = result["data"];
		$F("phone").innerHTML = data["phone"];
		$F("address").innerHTML = data["address"];
		var submittime = new Date( parseInt(data["time"]) * 1000 );
		$F("submitDate").innerHTML = date2str(submittime,"yyyy-MM-dd hh:mm:ss");
		$F("status").innerHTML = statusMsg[data["status"]];
		$F("totalPrice").innerHTML = data["totalPrice"];
		$F("deliveryTime").innerHTML = data["deliveryTime"];
		
		var orderData = data["orderData"];
		var length = orderData.length;
		var ordersHtml = "";
		for ( var i =0; i<length; i++ )
		{
			ordersHtml += '<dd><span class="fr"><span class="danjia">'+parseInt(orderData[i]["price"])*parseInt(orderData[i]["selectNum"])+ 
			'元</span></span><b>'+orderData[i]["name"]+'</b><i>X'+orderData[i]["selectNum"]+'</i> </dd>';
		}
		$F("orders").innerHTML = ordersHtml;
	}
}

function acceptOrder()
{
	$F("accept_btn").style.backgroundColor = "#66CC99";
	var url = "/wechat/orders.php?opt=checkOrder&type=1&id=" + id + "&shopinfo=" + shopinfo;
	getJson(url, function handler(result){window.location.reload();});
}

function rejectOrder()
{
	$F("reject_btn").style.backgroundColor = "#66CC99";	
	$F("orderInfo").style.display = "none";
	$F("rejectMsg").style.display = "";
	
}

function showAndHide(type)
{
	if(type==1)
		$F("msgList").style.display="block";
	else
		$F("msgList").style.display="none";
}
 
function selectMsg(obj)
{
	var selectObj = $F(obj);
	var str = selectObj.innerHTML;
	$F("rejectText").value = str;
}

function rejectOrderConfirm()
{
	var str = $F("rejectText").value;
	var url = "/wechat/orders.php?opt=checkOrder&type=2&id=" + id + "&shopinfo=" + shopinfo + "&shopResponse=" + str;
	getJson(url, function handler(result){window.location.reload();});	
}
