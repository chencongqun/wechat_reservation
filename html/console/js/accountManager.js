var currentPage = null;
var addrSearch = null;
var nameSearch = null;
var accountTypeSearch = null;
var accountTypeArray = {"0":"试用用户","1":"正式用户"};
var cityArray = {"sz":"深圳"};
var districtArray = {"ft":"福田",
							  "ns":"南山",
							  "lh":"罗湖",
							  "ba":"宝安",
							  "yt":"盐田",
							  "lh":"龙华",
							  "lg":"龙岗",
							  "dp":"大鹏",
							  "gm":"光明",
							  "ps":"坪山"};
function init()
{
	var page = GetArgsFromHref(window.location.href, "page");
	if (  page == null )
		page = 1;
	addrSearch = GetArgsFromHref(window.location.href, "addrSearch");
	nameSearch = GetArgsFromHref(window.location.href, "nameSearch");
	accountTypeSearch = GetArgsFromHref(window.location.href, "accountTypeSearch");
	page = parseInt(page);
	get_account_list(page);
}

function fill_account_list(result)
{
	if ( checkExpired(result) )
		return;
	var curTime = new Date().getTime();
	var data = result.data;
	if ( data != null && data != "" )
	{
		var targetObj = $F('content');
		rown = targetObj.rows.length;
		for(var i=rown-1; i>=0; i--){
			targetObj.deleteRow(i);
		}
		for(var i = 0, j = data.length; i < j; i++){
			var newRow = targetObj.insertRow(i);
			newRow.onmouseover = function(){this.style.background='#FBF5E5';};
			newRow.onmouseout =  function(){this.style.background='';};
			var newCell = newRow.insertCell(0);
			newCell.innerHTML = '<input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" >';
			newCell = newRow.insertCell(1);
			newCell.innerHTML = data[i].companyName;
			newCell = newRow.insertCell(2);
			newCell.innerHTML = data[i].username;
			newCell = newRow.insertCell(3);
			newCell.innerHTML = accountTypeArray[data[i].accountType];
			newCell = newRow.insertCell(4);
			newCell.innerHTML = cityArray[data[i].city] + "/" + districtArray[data[i].district];
			newCell = newRow.insertCell(5);
			newCell.innerHTML = data[i].smNum;
			if ( parseInt(data[i].smNum) < 100 )
				newCell.style.color = '#FF0000';
			newCell = newRow.insertCell(6);
			var tenancy = parseInt(data[i].registerDate) + parseInt(data[i].tenancy) * 2630000;
			tenancy = tenancy * 1000;
			newCell.innerHTML = date2str(new Date(tenancy),"yyyy-MM-dd");
			if ( tenancy - curTime < 2630000000 )
				newCell.style.color = '#FF0000';
			newCell = newRow.insertCell(7);
			newCell.innerHTML = '<img src="images/icon_edit.gif" align="absmiddle" /> <a href="javascript:editAccount('+'\''+data[i]._id.$id+'\''+');">编辑</a>&nbsp;' + '<img src="images/icon_edit.gif" align="absmiddle" /> <a href="javascript:renewal( '+'\''+data[i]._id.$id+'\''+' );">续费</a>';
		}
		//targetObj.innerHTML = html;
	}
	initPage(result.total, currentPage);
}

function get_account_list(page)
{
	currentPage = page;
	var url = "/console/account.php?opt=getAccountList&page="+page;
	if ( nameSearch != null )
	{
		url += "&companyName=" + nameSearch;
		$F("nameSearch").value = decodeURIComponent(nameSearch);
	}
	if ( addrSearch != null )
	{
		url += "&address=" + addrSearch;
		$F("addrSearch").value = decodeURIComponent(addrSearch);
	}
	if ( accountTypeSearch != null )
	{
		url += "&accountType=" + accountTypeSearch;
		$F("accountTypeSearch").value = decodeURIComponent(accountTypeSearch);
	}
	getJson(url, fill_account_list);
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

function editAccount(id)
{
	var url = "/console/addAccount.html?id="+id;	
	if ( currentPage != null )
		url += "&page=" + currentPage;
	window.location.href = url;
}

function renewal(id)
{
	var url = "/console/renewal.html?id="+id;	
	if ( currentPage != null )
		url += "&page=" + currentPage;
	window.location.href = url;
}

function add_page()
{
	var url = "/console/addAccount.html";	
	if ( currentPage != null )
		url += "?page=" + currentPage;
	window.location.href = url;
}

function searchFunc()
{
	var url = "/console/accountManager.html?page="+currentPage;
	if ( $F("nameSearch").value != "" )
		url += "&nameSearch=" + encodeURIComponent($F("nameSearch").value);
	if ( $F("addrSearch").value != "" )
		url += "&addrSearch=" + encodeURIComponent($F("addrSearch").value);
	if ( $F("accountTypeSearch").value != "" )
		url += "&accountTypeSearch=" + encodeURIComponent($F("accountTypeSearch").value);
	window.location.href = url;
}



