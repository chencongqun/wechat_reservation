var currentPage = null;
var phoneSearch = null;
var addrSearch = null;
var statusSearch = null;
var statusMsg = ["未审核","已接单","已拒绝"];
function init()
{
	var page = GetArgsFromHref(window.location.href, "page");
	if (  page == null )
		page = 1;
	phoneSearch = GetArgsFromHref(window.location.href, "phoneSearch");
	addrSearch = GetArgsFromHref(window.location.href, "addrSearch");
	statusSearch = GetArgsFromHref(window.location.href, "statusSearch");
	if ( phoneSearch!=null )
		$F("phoneSearch").value = decodeURIComponent(phoneSearch);
	if ( addrSearch!=null )
		$F("addrSearch").value = decodeURIComponent(addrSearch);
	if ( statusSearch!=null )
		$F("statusSearch").value = decodeURIComponent(statusSearch);
	page = parseInt(page);
	get_list(page);
}

function fill_list(result)
{
	if ( checkExpired(result) )
		return;
	var data = result.data;
	if ( data != null && data != "" )
	{
		var targetObj = $F('content');
		rown = targetObj.rows.length;
		for(var i=rown-1; i>=0; i--)
		{
			targetObj.deleteRow(i);
		}
		var rowId = 0;
		for(var i = data.length; i >= 0; i--)
		{
			try
			{
			var orderPrice = 0;
			var orderData = data[i].orderData;
			for ( var orderIndex = 0; orderIndex<orderData.length; orderIndex++ )
			{
				orderPrice += parseInt(orderData[orderIndex].price) * parseInt(orderData[orderIndex].selectNum)
			}
			var newRow = targetObj.insertRow(rowId);
			newRow.setAttribute("orderId", data[i]._id.$id);
			newRow.onmouseover = function(){this.style.background='#FBF5E5';};
			newRow.onmouseout =  function(){this.style.background='';};
			var newCell = newRow.insertCell(0);
			newCell.innerHTML = '<input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" >';
			newCell = newRow.insertCell(1);
			newCell.innerHTML = data[i].name;
			newCell = newRow.insertCell(2);
			newCell.innerHTML = data[i].address;
			newCell = newRow.insertCell(3);
			if ( "remark" in data[i] )
				newCell.innerHTML = data[i].remark;
			else
				newCell.innerHTML = "";
			newCell = newRow.insertCell(4);
			newCell.innerHTML = orderPrice + "元";
			newCell = newRow.insertCell(5);
			if ( "status" in data[i] )
				newCell.innerHTML = statusMsg[parseInt(data[i].status)];
			else 
				newCell.innerHTML = statusMsg[0];
			
			var optHtml='<img src="images/icon_edit.gif" align="absmiddle"/><a href="javascript:get_info(\''+data[i]._id.$id+'\')">查看</a>';
			if ( parseInt(data[i].status) != 0 )
			{
				optHtml += '<img src="images/icon_edit.gif" align="absmiddle" /><a href="javascript:auditOrder(\''+data[i]._id.$id+'\',0)">重新审核</a>';
			}
			else
			{
				optHtml += '<img src="images/icon_edit.gif" align="absmiddle" /><a href="javascript:auditOrder(\''+data[i]._id.$id+'\',1)">接单</a>';
				optHtml += '<img src="images/icon_edit.gif" align="absmiddle" /><a href="javascript:auditOrder(\''+data[i]._id.$id+'\',2)">拒绝</a>';
			}
			newCell = newRow.insertCell(6);
			newCell.innerHTML = optHtml;
			rowId++;
			}catch(e){}
		}
	}
	initPage(result.total, currentPage);
}

function get_list(page)
{
	currentPage = page;
	var url = "/admin/customerOrder.php?opt=getOrderList&page="+page;
	if ( phoneSearch != null )
		url += "&phone=" + phoneSearch;
	if ( addrSearch != null )
		url += "&address=" + addrSearch;
	if ( statusSearch != null )
		url += "&status=" + statusSearch;
	getJson(url, fill_list);
}

function selectAll(element)
{
	var checked = element.checked;
	var length = $F("content").children.length;
	for (var i=0; i<length; i++)
	{
		$F("select"+i).checked = checked;
	}
}

function del_orders()
{
	if ( !confirm('确定删除所选订单记录?') )
		return;
	var url = "/admin/customerOrder.php?opt=delOrders";
	var parameter = "id=";
	var checkCount = 0;
	var length = $F("content").children.length;
	for (var i=0; i<length; i++)
	{
		var itemObj = $F("select"+i);
		if ( itemObj.checked )
		{
			if ( checkCount > 0 )
				parameter += ",";
			parameter += itemObj.value;
			checkCount++;
		}
	}
	if ( checkCount == 0 )
	{
		confirm('请选择要删除的记录');
		return;
	}
	postJson(url, parameter, function handler(result){
												if ( checkExpired(result) )
													return;
												window.location.reload();
											  });
}

function delall_orders()
{
	if ( !confirm('确定删除所有订单记录？') )
		return;
	var url = "/admin/customerOrder.php?opt=delallOrders";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}

function searchOrders()
{
	
	var url = "/admin/order_list.html?page="+currentPage;
	if ( $F("phoneSearch").value != "" )
		url += "&phoneSearch=" + encodeURIComponent($F("phoneSearch").value);
	if ( $F("addrSearch").value != "" )
		url += "&addrSearch=" + encodeURIComponent($F("addrSearch").value);
	if ( $F("statusSearch").value != "" )
		url += "&statusSearch=" + encodeURIComponent($F("statusSearch").value);
	window.location.href = url;
}

function setOrderMenu( id, status )
{
	var obj = null;
	var contentObj = $F('content');
	var rown = contentObj.rows.length;
	for(var i=0; i<rown; i++)
	{
		if ( contentObj.childNodes[i].getAttribute("orderId") == id )
		{
			obj = contentObj.childNodes[i];
			break;
		}
	}
	
	if ( obj == null )
		return;
	
	obj.childNodes[5].innerHTML = statusMsg[parseInt(status)];
	var optHtml='<img src="images/icon_edit.gif" align="absmiddle"/><a href="javascript:get_info(\''+id+'\')">查看</a>';
	if ( parseInt(status) != 0 )
	{
		optHtml += '<img src="images/icon_edit.gif" align="absmiddle" /><a href="javascript:auditOrder(\''+id+'\',0)">重新审核</a>';
	}
	else
	{
		optHtml += '<img src="images/icon_edit.gif" align="absmiddle" /><a href="javascript:auditOrder(\''+id+'\',1)">接单</a>';
		optHtml += '<img src="images/icon_edit.gif" align="absmiddle" /><a href="javascript:auditOrder(\''+id+'\',2)">拒绝</a>';
	}
	obj.childNodes[6].innerHTML = optHtml;
}

function auditOrder( id, opt )
{
	if ( opt == 1 )
	{
	var url = "/admin/customerOrder.php?opt=checkOrder&type=" + opt + "&id=" + id;
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
								  });
	}
	else if ( opt == 2 )
		window.location.href = "/admin/reject_msg.html?id="+id;
		
		
	if ( opt == 3 )
		setOrderMenu( id, 0 );
	else
		setOrderMenu( id, opt );
}

function get_info( id )
{
	window.location.href = "/admin/order_info.html?id=" + id + "&time=" + new Date().getTime();
	
}