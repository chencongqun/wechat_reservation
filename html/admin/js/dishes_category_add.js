var type = "addCategory";
var currentId = null;
var currentPage = null;
function init()
{
	currentId = GetArgsFromHref(window.location.href, "id");
	if (  currentId != null )
	{
		type = "editCategory";
		getCategoryInfo(currentId);
	}
	currentPage = GetArgsFromHref(window.location.href, "page");
}

function getCategoryInfo(id)
{
	var url = "/admin/dishes.php?opt=getCategoryInfo&id="+id;
	getJson(url, function handler(result){
								  	
									$F("name").value = result.name;
									$F("desc").value = result.desc
								  	$F("priority").value = result.priority;
									
								  });
}

function submit_data()
{
	if ( $F("name").value == "" )
	{
		$F("spanNameMsg").className = "warning";
		$F("spanNameMsg").innerHTML = "请输入名称";
		return;
	}
	var url = "/admin/dishes.php?opt="+type;
	var parameter = "";
	parameter += "name=" + $F("name").value;
	parameter += "&desc=" + $F("desc").value;
	parameter += "&priority=" + $F("priority").value;
	if ( type == "editCategory" )
		parameter += "&id=" + currentId;
	
	postJson(url, parameter, function handler(result){
								   
								   	if ( result.code == 0 )
									{
										if ( currentPage != null )
											window.location.href = "/admin/dishes_category.html?page=" + currentPage;
										else
											window.location.href = "/admin/dishes_category.html";
									}
									else if ( result.code = -102 )
									{
											$F("spanErrorMsg").className = "warning";
											$F("spanErrorMsg").innerHTML = "名称已存在";
									}
								   
								   });
}

function reset_data()
{
	$F("name").value = "";
	$F("desc").value = "";
	$F("priority").value = "";
}

