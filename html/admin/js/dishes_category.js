var currentPage = null;


function fill_category_list(result)
{
	if ( checkExpired(result) )
		return;
	var data = result.data;
	if ( data!=null && data!="" )
	{
		var targetObj = $F('category_content');
		//html = "";
		for(var i = 0, j = data.length; i < j; i++){
			/*html += '<tr onMouseOver="this.style.background=\'#FBF5E5\'" onMouseOut="this.style.background=\'\'">' +
				  '<td><input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" ></td>' + 
				  '<td>'+data[i].name+'</td>' + 
				  '<td>'+data[i].desc+'</td>' +
				  '<td>'+data[i].priority+'</td>' +
				  '<td>10</td>' +
				  '<td  class="centerAlign">' +
				  
				  '</td></tr>'*/
			var newRow = targetObj.insertRow(i);
			newRow.onmouseover = function(){this.style.background='#FBF5E5';};
			newRow.onmouseout =  function(){this.style.background='';};
			var newCell = newRow.insertCell(0);
			newCell.innerHTML = '<input type="checkbox" id="select' + i + '" value="' + data[i]._id.$id + '" >';
			newCell = newRow.insertCell(1);
			newCell.innerHTML =  data[i].name;
			newCell = newRow.insertCell(2);
			newCell.innerHTML = data[i].desc;
			newCell = newRow.insertCell(3);
			newCell.innerHTML = data[i].priority;
			newCell = newRow.insertCell(4);
			if ( "dishesNum" in data[i] )
				newCell.innerHTML = data[i].dishesNum;
			else
				newCell.innerHTML = 0;
			newCell = newRow.insertCell(5);
			newCell.className = "centerAlign";
			newCell.innerHTML = '<img src="images/icon_edit.gif" align="absmiddle" /> <a href="javascript:edit_category('+'\''+data[i]._id.$id+'\''+');">编辑</a>&nbsp;' +
				  '<img src="images/icon_del.gif" align="absmiddle" /> <a href="javascript:del_one_category( '+'\''+data[i]._id.$id+'\''+' );">删除</a>';
		}
		//targetObj.outerHTML = html;
	}
	
	initPage(result.total, currentPage);
}

function get_category_list(page)
{
	currentPage = page;
	var url = "/admin/dishes.php?opt=getCategoryList&page="+page	
	getJson(url, fill_category_list);
}

function add_category()
{
	var url = "/admin/dishes_category_add.html?page="+page;
	window.location.href = url;
}
function del_one_category(id)
{
	if ( !confirm('删除菜品分类之后，属于该分类的菜品将不会在公众号菜单列表上显示') )
		return;
	var url = "/admin/dishes.php?opt=delCategory";
	var parameter = "id="+id;
	postJson(url, parameter, function handler(result){
												if ( checkExpired(result) )
													return;
												window.location.reload();
											  });
}
function del_category()
{
	if ( !confirm('删除菜品分类之后，属于该分类的菜品将不会在公众号菜单列表上显示') )
		return;
	var url = "/admin/dishes.php?opt=delCategory";
	var parameter = "id=";
	var checkCount = 0;
	var length = $F("category_content").children.length;
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
	console.log(parameter);
	postJson(url, parameter, function handler(result){
												if ( checkExpired(result) )
													return;
												window.location.reload();
											  });
	
}

function delall_category()
{
	if ( !confirm('确定删除所有菜品分类？') )
		return;
	var url = "/admin/dishes.php?opt=delallCategory";
	getJson(url, function handler(result){
								  	if ( checkExpired(result) )
										return;
									window.location.reload();
								  });
}

function edit_category(id)
{
	var url = "/admin/dishes_category_add.html?id="+id;	
	if ( currentPage != null )
		url += "&page=" + currentPage;
	window.location.href = url;
}

function add_category_page()
{
	var url = "/admin/dishes_category_add.html";	
	if ( currentPage != null )
		url += "?page=" + currentPage;
	window.location.href = url;
}

function selectAll(element)
{
	var checked = element.checked;
	var length = $F("category_content").children.length;
	for (var i=0; i<length; i++)
	{
		$F("select"+i).checked = checked;
	}
}
