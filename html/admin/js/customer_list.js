var currentPage = null;
var phoneSearch = null;
var addrSearch = null;
function init()
{
	var page = GetArgsFromHref(window.location.href, "page");
	if (  page == null )
		page = 1;
	phoneSearch = GetArgsFromHref(window.location.href, "phoneSearch");
	addrSearch = GetArgsFromHref(window.location.href, "addrSearch");
	if ( phoneSearch!=null )
		$F("phoneSearch").value = decodeURIComponent(phoneSearch);
	if ( addrSearch!=null )
		$F("addrSearch").value = decodeURIComponent(addrSearch);
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
		for(var i = 0, j = data.length; i < j; i++)
		{
			var newRow = targetObj.insertRow(i);
			newRow.onmouseover = function(){this.style.background='#FBF5E5';};
			newRow.onmouseout =  function(){this.style.background='';};
			var newCell = newRow.insertCell(0);
			newCell.innerHTML = '<input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" >';
			newCell = newRow.insertCell(1);
			newCell.innerHTML = data[i].name;
			newCell = newRow.insertCell(2);
			newCell.innerHTML = data[i].phone;
			newCell = newRow.insertCell(3);
			newCell.innerHTML = data[i].address;
			newCell = newRow.insertCell(4);
			if ( "remark" in data[i] )
				newCell.innerHTML = data[i].remark;
			else
				newCell.innerHTML = "";
			newCell = newRow.insertCell(5);
			if ( "orderNum" in data[i] )
				newCell.innerHTML = data[i].orderNum;
			else
				newCell.innerHTML = 0;
			newCell = newRow.insertCell(6);
			newCell.innerHTML = '<img src="images/icon_del.gif" align="absmiddle" /> <a href="javascript:del_one( \''+data[i]._id.$id+'\')">删除</a>';
		}
	}
	initPage(result.total, currentPage);
}

function get_list(page)
{
	currentPage = page;
	var url = "/admin/customerOrder.php?opt=getCustomerList&page="+page;
	if ( phoneSearch != null )
		url += "&phone=" + phoneSearch;
	if ( addrSearch != null )
		url += "&address=" + addrSearch;
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

function del_one(id)
{
	if ( !confirm('确定删除该条客户信息?') )
		return;
	var url = "/admin/customerOrder.php?opt=delCustomers";
	var parameter = "id="+id;
	postJson(url, parameter, function handler(result){
												if ( checkExpired(result) )
													return;
												window.location.reload();
											  });
}

function del_customers()
{
	if ( !confirm('确定删除所选客户信息?') )
		return;
	var url = "/admin/customerOrder.php?opt=delCustomers";
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

function delall_customers()
{
	if ( !confirm('确定删除所有客户信息？') )
		return;
	var url = "/admin/customerOrder.php?opt=delallCustomers";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}

function searchCustomers()
{
	
	var url = "/admin/customer_list.html?page="+currentPage;
	if ( $F("phoneSearch").value != "" )
		url += "&phoneSearch=" + encodeURIComponent($F("phoneSearch").value);
	if ( $F("addrSearch").value != "" )
		url += "&addrSearch=" + encodeURIComponent($F("addrSearch").value);
	window.location.href = url;
}



