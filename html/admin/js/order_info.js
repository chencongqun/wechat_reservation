var id;
var statusMsg = ["未审核","已接单","已拒绝"];
function init()
{
	id = GetArgsFromHref(window.location.href, "id");
	var url = "/admin/customerOrder.php?opt=getOrderInfo&id=" + id + "&time=" + new Date().getTime();
	getJson( url, fillOrderInfo );
}

function fillOrderInfo(result)
{
	if ( checkExpired(result) )
		return;
	if ( "data" in result )
	{
		var data = result["data"];
		$F("phone").innerHTML = data["phone"];
		$F("address").innerHTML = data["address"];
		var submittime = new Date( parseInt(data["time"]) * 1000 );
		$F("submitDate").innerHTML = date2str(submittime,"yyyy-MM-dd hh:mm:ss");
		$F("status").innerHTML = statusMsg[data["status"]];
		$F("totalPrice").innerHTML = data["totalPrice"] + '&nbsp;元';
		$F("deliveryTime").innerHTML = data["deliveryTime"];
		var orderData = data["orderData"];
		var length = orderData.length;
		var ordersHtml = "";
		for ( var i =0; i<length; i++ )
		{
			ordersHtml += '<p><label>'+orderData[i]["name"]+'</label><b>X'+orderData[i]["selectNum"]+'</b><b>'+parseInt(orderData[i]["price"])*parseInt(orderData[i]["selectNum"])+'&nbsp;元</b></p>';
		}
		$F("orders").innerHTML = ordersHtml;
	}
}

function acceptOrder()
{
	var url = "/admin/customerOrder.php?opt=checkOrder&type=1&id=" + id;
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.href = "/admin/order_list.html";
								  });
}

function rejectOrder()
{
	window.location.href = "/admin/reject_msg.html?id="+id;
}

