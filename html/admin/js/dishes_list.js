var currentPage = null;
var typeSearch = null;
var nameSearch = null;
function init()
{
	var page = GetArgsFromHref(window.location.href, "page");
	if (  page == null )
		page = 1;
	typeSearch = GetArgsFromHref(window.location.href, "typeSearch");
	nameSearch = GetArgsFromHref(window.location.href, "nameSearch");
	page = parseInt(page);
	get_dishes_list(page);
	initOptionValue();
}

function fill_dishes_list(result)
{
	if ( checkExpired(result) )
		return;
	var data = result.data;
	if ( data != null && data != "" )
	{
		var targetObj = $F('content');
		rown = targetObj.rows.length;
		for(var i=rown-1; i>=0; i--){
			targetObj.deleteRow(i);
		}
		//html = "";
		for(var i = 0, j = data.length; i < j; i++){
			/*html += '<tr onMouseOver="this.style.background=\'#FBF5E5\'" onMouseOut="this.style.background=\'\'">' +
				  '<td><input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" ></td>' + 
				  '<td>'+data[i].name+'</td>' + 
				  '<td>'+data[i].desc+'</td>' +
				  '<td>'+data[i].price+'</td>' +
				  '<td>'+data[i].class+'</td>' +
				  '<td>'+data[i].priority+'</td>' +
				  '<td  class="centerAlign">' +
				  '<img src="images/icon_edit.gif" align="absmiddle" /> <a href="javascript:edit_dish_page('+'\''+data[i]._id.$id+'\''+');">编辑</a>&nbsp;' +
				  '<img src="images/icon_del.gif" align="absmiddle" /> <a href="javascript:del_one_dish( '+'\''+data[i]._id.$id+'\''+' );">删除</a>' +
				  '</td></tr>'*/
			var newRow = targetObj.insertRow(i);
			newRow.onmouseover = function(){this.style.background='#FBF5E5';};
			newRow.onmouseout =  function(){this.style.background='';};
			var newCell = newRow.insertCell(0);
			newCell.innerHTML = '<input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" >';
			newCell = newRow.insertCell(1);
			newCell.innerHTML = data[i].name;
			newCell = newRow.insertCell(2);
			newCell.innerHTML = data[i].desc;
			newCell = newRow.insertCell(3);
			newCell.innerHTML = data[i].price;
			newCell = newRow.insertCell(4);
			newCell.innerHTML = data[i]["class"];
			newCell = newRow.insertCell(5);
			newCell.innerHTML = data[i].priority;
			newCell = newRow.insertCell(6);
			var htmlStr = '<img src="images/icon_edit.gif" align="absmiddle" /> <a href="javascript:edit_dish_page('+'\''+data[i]._id.$id+'\''+');">编辑</a>&nbsp;' + '<img src="images/icon_del.gif" align="absmiddle" /> <a href="javascript:del_one_dish( '+'\''+data[i]._id.$id+'\''+' );">删除</a>';
			if( "status" in data[i] && data[i]["status"] != "1" )
				htmlStr += '<span style=" margin:0 5px; color:#FF0000;">↑</span><a href="javascript:setStatus( '+'\''+data[i]._id.$id+'\''+' ,1);">上架</a>';
			else
				htmlStr += '<span style=" margin:0 5px; color:#000000;">↓</span><a href="javascript:setStatus( '+'\''+data[i]._id.$id+'\''+' ,0);">下架</a>';
			newCell.innerHTML = htmlStr;
		}
		//targetObj.innerHTML = html;
	}
	initPage(result.total, currentPage);
}

function get_dishes_list(page)
{
	currentPage = page;
	var url = "/admin/dishes.php?opt=getDishesList&page="+page;
	if ( nameSearch != null )
		url += "&name=" + nameSearch;
	if ( typeSearch != null )
		url += "&type=" + typeSearch;
	getJson(url, fill_dishes_list);
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

function edit_dish_page(id)
{
	var url = "/admin/dishes_add.html?id="+id;	
	if ( currentPage != null )
		url += "&page=" + currentPage;
	window.location.href = url;
}

function add_dish_page()
{
	var url = "/admin/dishes_add.html";	
	if ( currentPage != null )
		url += "?page=" + currentPage;
	window.location.href = url;
}

function del_one_dish(id)
{
	if ( !confirm('确定删除该菜品?') )
		return;
	var url = "/admin/dishes.php?opt=delDishes";
	var parameter = "id="+id;
	postJson(url, parameter, function handler(result){
												if ( checkExpired(result) )
													return;
												window.location.reload();
											  });
}

function del_dishes()
{
	if ( !confirm('确定删除所选菜品?') )
		return;
	var url = "/admin/dishes.php?opt=delDishes";
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

function delall_dishes()
{
	if ( !confirm('确定删除所有菜品？') )
		return;
	var url = "/admin/dishes.php?opt=delallDishes";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}

function initOptionValue()
{
	var url = "/admin/dishes.php?opt=getCategoryNameList";
	getJson(url, function handler(result){
								  
								  	var length = result.length;
									var optionHtml = '<option value=""></option>';
									for ( var i=0; i<length; i++ )
									{
										optionHtml += '<option value="'+result[i].name+'">' + result[i].name + '</option>';
									}
									$F("typeSearch").innerHTML = optionHtml;
									if (  typeSearch != null )
										$F("typeSearch").value = decodeURIComponent(typeSearch);
									if (  nameSearch != null )
										$F("nameSearch").value = decodeURIComponent(nameSearch);
								  });
}

function searchDishes()
{
	
	var url = "/admin/dishes_list.html?page="+currentPage;
	if ( $F("nameSearch").value != "" )
		url += "&nameSearch=" + encodeURIComponent($F("nameSearch").value);
	if ( $F("typeSearch").value != "" )
		url += "&typeSearch=" + encodeURIComponent($F("typeSearch").value);
	window.location.href = url;
}

function setStatus(id, status)
{
	var url = "/admin/dishes.php?opt=setStatus&id=" + id + "&status=" + status;
	getJson(url, function handler(result){if ( checkExpired(result) )
										return;
									window.location.reload();});
}

function backup()
{
	window.open("/admin/dishes.php?opt=backup");	
}

function importData()
{
	window.location.href = "/admin/import.html";	
}