var imagePath = "../customer/";
var shopinfo="";
var openid = "";
var lastSelectObj = null;
var contentArray=JSON.parse('{}');
var categoryArray=JSON.parse('{}');
function init()
{
	try
	{
		shopinfo = GetArgsFromHref(window.location.href, "shopinfo");
		openid = GetArgsFromHref(window.location.href, "openid");
		var code = GetArgsFromHref(window.location.href, "code");
		if ( openid == null && code != null )
			getOpenid(code);
			
		if ( shopinfo != null )
			setLocalStorage("shopinfo", shopinfo);
		if ( openid != null )
			setLocalStorage("openid", openid);
			
		setHeight();
		initEvent();
		if ( GetArgsFromHref(window.location.href, "useLocalStorage") == null )
			getDishesContent();
		else
			setDishesContent();
	}
	catch(error)
	{
		//alert(error.message);
		initAfterContent();
	}
}

function getOpenid(code)
{
	var url = "/wechat/customer.php?opt=getOpenid&code="+code;
	getJson( url, function handler(result){
								   
									openid = result["openid"];
									setLocalStorage("openid", openid);

								   } );
}

function initAfterContent()
{
	dishShowHide();
	doSelectBtn();
	countTotalPrice();
}

function setHeight()
{
	var  cHeight;
	cHeight = document.documentElement.clientHeight;
	cHeight = cHeight +"px";
	document.getElementById("directory").style.height =  cHeight;
	document.getElementById("detail_section").style.height =  cHeight;
}

function dishShowHide()
{
	try
	{
		var dishObj = _queryAll("#directory dd span");
		var idx;
		var countdish = 0;
		for ( idx=0;idx<dishObj.length;idx++ )
		{
			var categoryName = dishObj[idx].parentNode.getAttribute("contentvalue");
			var categoryId = searchItem( categoryArray, "name", categoryName );
			if ( categoryId>=0 && "selectNum" in categoryArray[categoryId] )
			{
				dishObj[idx].innerHTML = categoryArray[categoryId]["selectNum"];
				dishObj[idx].style.display='block';
			}
			
			countdish = parseInt(dishObj[idx].innerHTML);
			if ( countdish > 0 )
			{
			   dishObj[idx].style.display='inline-block';
			}
			else
			{
			   dishObj[idx].style.display='none';
			}
		}
	}
	catch(e)
	{
		//alert(e.message);
	}
}

function countDish()
{
	var countTotle = 0,countdish;
	var dishNum = _queryAll("div ul .l4 i");
	var idx;
	var obj = _queryOne("#directory dd.active span");
	
	for ( idx=0; idx<dishNum.length; idx++)
	{
		countdish = parseInt(dishNum[idx].innerHTML);
		if( countdish > 0 )
		{
			countTotle++;
		}
	}

	if(countTotle != 0)
	{
		var categoryName = obj.parentNode.getAttribute("contentvalue");
		var categoryId = searchItem( categoryArray, "name", categoryName );
		categoryArray[categoryId]["selectNum"] = countTotle;
		setLocalStorage("categoryData", JSON.stringify(categoryArray));
		
		obj.innerHTML = countTotle;
		obj.style.display='block';
	}
	else
	{
		obj.style.display='none';
	}
}

function btnShowHide(num,btns, isCountDish)
{

	if (isCountDish !== false) {
		countDish();
	}

	if (num <= 0) 
	{
		btns.children[0].style.display ="none";
		btns.children[1].style.display ="none";
	}
	else
	{
		btns.children[0].style.display ="inline-block";
		btns.children[1].style.display ="inline-block";
	};
}

function updateContentArray(nodeObj, num)
{
	try
	{
		if ( lastSelectObj == null )
		{
			lastSelectObj = _queryOne("#directoryContent .active");
		}
		var dishName = nodeObj.children[1].innerHTML;
		var categoryName = lastSelectObj.getAttribute("contentvalue");
		
		var id = searchItem( contentArray[categoryName], "name", dishName );
		var oldNum = 0;
		if( "selectNum" in contentArray[categoryName][id] )
			oldNum = parseInt(contentArray[categoryName][id]["selectNum"]);
		contentArray[categoryName][id]["selectNum"] = num;
		setLocalStorage("dishesData", JSON.stringify(contentArray));
		
		$F("totalPrice").innerHTML = parseInt($F("totalPrice").innerHTML) + (num-oldNum)*parseInt(contentArray[categoryName][id]["price"]);
	}
	catch(e)
	{	
	}
}

function doSelectBtn()
{
        var btnObj = _queryAll("div ul .l4");
        var btnIndex = 0;
		var btnLength = btnObj.length;
        for(btnIndex;btnIndex<btnLength;btnIndex++)
		{
            var countNumText=parseInt(btnObj[btnIndex].children[1].innerHTML);
            var btnAdd=btnObj[btnIndex].children[2];
            var btnMin=btnObj[btnIndex].children[0];
            btnShowHide(countNumText,btnObj[btnIndex], false);
			var originalNum;
            _addEventListener(btnAdd, _moveendEvt,function(){
                
				var _self = getEventTarget();
                originalNum = parseInt(_self.parentNode.children[1].innerHTML, 10);
                countNumText =  originalNum +1;
                _self.parentNode.children[1].innerHTML = countNumText;
                btnShowHide(countNumText,_self.parentNode);
				updateContentArray(_self.parentNode.parentNode, countNumText);
            });

            _addEventListener(btnMin, _moveendEvt,function(){
                var _self = getEventTarget();
                originalNum = parseInt(_self.parentNode.children[1].innerHTML, 10);
                countNumText =  originalNum - 1;
                _self.parentNode.children[1].innerHTML = countNumText;
                btnShowHide(countNumText,_self.parentNode);
				updateContentArray(_self.parentNode.parentNode, countNumText);
            });
        } // for
		countDish();
		
		var categoryObj = _queryAll("#directoryContent dd");
		var categoryLength = categoryObj.length;
		var index = 0;
		for ( index; index<categoryLength; index++ )
		{
			_addEventListener(categoryObj[index], _moveendEvt, switchItem);
		}
}

function compareFunction(data1, data2)
{
	var p1 = parseInt(data1["priority"]);
	var p2 = parseInt(data2["priority"]);
	if ( isNaN(p1) && !isNaN(p2) )
		return true;
	if ( !isNaN(p1) && isNaN(p2) )
		return false;	
	if ( p1 > p2 )
		return true;
	else
		return false;
}

function searchItem(srcArray, keyName, value)
{
	if ( srcArray == null )
		return -1;
	var length = srcArray.length;
	if ( length == 0 )
		return -1;
	for ( var i=0;i<length;i++ )
	{
		if ( keyName in srcArray[i] && value == srcArray[i][keyName] )
		{
				return i;
		}
	}
}

function switchItem()
{
	var obj = getEventTarget();
	if ( lastSelectObj == null )
	{
		lastSelectObj = _queryOne("#directoryContent .active");
	}
	lastSelectObj.className = "";
	obj.className = "active";
	lastSelectObj = obj;
	
	var categoryName = obj.getAttribute("contentvalue");
	if ( categoryName in contentArray )
	{
		fill_dishes_list(contentArray[categoryName]);
	}
	else
	{
		var url = "/wechat/customer.php?opt=getDishes&shopinfo=" + shopinfo + "&type=" + encodeURIComponent(categoryName)+"&time="+new Date().getTime();
		getJson( url, fill_dishes_list_ex );
	}
}

function fill_dishes_list(data)
{
	var length = data.length;
	var div = $F("subject_info");
	var html = "";
	for ( var i=0; i<length; i++ )
	{
		var selectNum = 0;
		if ( "selectNum" in data[i] )
			selectNum = data[i]["selectNum"];
		var payCount = 0;
		var noPicture = "images/nopicture.jpg";
		if ( "count" in data[i] )
			payCount = parseInt(data[i]["count"]);
		var picturePath = noPicture;
		if ( "pictureName" in data[i] && data[i]["pictureName"] != "" && data[i]["pictureName"]!="undefined")
			picturePath = imagePath+shopinfo+'/images/'+data[i]["pictureName"];
		var imgUrl = '<img class="dishImg" src="'+ picturePath +'" onClick="javascript:openDetail('+i+')"/>';
		if ( "hot" in data[i] || ("hotsale" in data[i] && data[i]["hotsale"] == "1"))
			imgUrl += '<img class="logoImg" src="../public/images/hot.png"/>';
		html += '<ul><li>'+imgUrl+'</li>' + 
			'<li class="l1">'+data[i]["name"]+'</li>'+
			'<li class="l2">已售'+payCount+'份</li>'+
			'<li class="l3"><i>'+data[i]["price"] + '元</i>/' + data[i]["unit"]+'</li>'+
			'<li class="l4"><button class="minus"></button><i>'+selectNum+'</i><button class="add"></button>'+
			'</li></ul>';
	}
	div.innerHTML = html;
	initAfterContent();
}

function setHotFlag(data)
{
	var length = data.length;
	for(var j=0; j<3; j++)
	{
		var maxid = -1;
		var maxvalue = 0;
		for ( var i=0; i<length; i++ )
		{
			if ( "hot" in data[i] )
				continue;
			var curValue = 0;
			if ( "count" in data[i] )
				curValue = parseInt(data[i]["count"]);
			if ( curValue > maxvalue )
			{
				maxid = i;
				maxvalue = curValue;
			}
		}
		if ( maxid != -1 )
			data[maxid]["hot"] = true;
	}
}

function fill_dishes_list_ex(data)
{
	try
	{
		if ( data == null )
		{
			initAfterContent();	
			return;
		}
		quick_sort(data, compareFunction);
		setHotFlag(data);
		var curCategory = _queryOne("#directoryContent .active").getAttribute("contentvalue");
		contentArray[curCategory] = data;
		setLocalStorage("dishesData", JSON.stringify(contentArray));
		fill_dishes_list(data);
	}
	catch(e)
	{
	}
}

function fill_category_list(data)
{
	var length = data.length;
	var dl = $F("directoryContent");
	var html = "";
	for ( var i=0; i<length; i++ )
	{
		if ( i == 0 )
			html +=  '<dd class="active" contentValue="'+data[i]["name"]+'">'+data[i]["name"]+'<span></span></dd>';
		else
			html +=  '<dd contentValue="'+data[i]["name"]+'">'+data[i]["name"]+'<span></span></dd>';
	}
	dl.innerHTML = html;
}

function fill_category_list_ex(data)
{
	try
	{
		if ( data == null || data.length==0)
		{
			initAfterContent();	
			return;
		}
		quick_sort(data, compareFunction);
		categoryArray = data;
		setLocalStorage("categoryData", JSON.stringify(data));
		fill_category_list(data);
		var url = "/wechat/customer.php?opt=getDishes&shopinfo=" + shopinfo + "&type=" + encodeURIComponent(data[0]["name"])+"&time="+new Date().getTime();
		getJson( url, fill_dishes_list_ex );
	}
	catch(e)
	{
	}
}

function getDishesContent()
{
	var url = "/wechat/customer.php?opt=getCategory&shopinfo="+encodeURIComponent(shopinfo)+"&time="+new Date().getTime();
	getJson( url, fill_category_list_ex );
}

function initEvent()
{
	_addEventListener(window, 'orientationchange', setHeight);
}

function setDishesContent()
{
	var categoryData = getLocalStorage("categoryData");
	var contentData = getLocalStorage("dishesData");
	if ( categoryData==null || contentData==null )
	{
		getDishesContent();
		return;
	}
	categoryArray = JSON.parse(categoryData);
	contentArray = JSON.parse(contentData);
	fill_category_list(categoryArray);
	fill_dishes_list(contentArray[categoryArray[0]["name"]]);
}

function openOrderPage()
{
	
	window.location.href='/wechat/myorder.html?time='+new Date().getTime();
}

function countTotalPrice()
{
	if ( contentArray == null )
		return;
	var totalprice = 0;
	for ( var key in contentArray )
	{
		var data = contentArray[key];
		var length = data.length;
		for ( var i=0; i<length; i++ )
		{
			if ( !("selectNum" in data[i]) )
				continue;
			if ( parseInt(data[i]["selectNum"]) <=0 )
				continue;
			totalprice += parseInt(data[i]["selectNum"]) * parseInt(data[i]["price"]);
		}
	}
	$F("totalPrice").innerHTML = totalprice;
}

function openAllOrderPage()
{
	window.location.href='/wechat/allorders.html?time='+new Date().getTime();
}

function openDetail(index)
{
	//try
	{
		if ( lastSelectObj == null )
		{
			lastSelectObj = _queryOne("#directoryContent .active");
		}
		var categoryName = lastSelectObj.getAttribute("contentvalue");
		var data = contentArray[categoryName][index];
		if ( data == null )
			return;
		detail_page(data);
	}
	//catch(e){}
}

function detail_page(data)
{  
    var sWidth,sHeight,msgw,msgh;
	sWidth = document.documentElement.clientWidth;
	sHeight = document.documentElement.clientHeight;
	msgw = sWidth * 0.8;
	msgh = sHeight * 0.8;
	
    var bgObj=document.createElement("div"); 
    bgObj.setAttribute('id','bgDiv'); 
    bgObj.style.position="absolute"; 
    bgObj.style.top="0"; 
    bgObj.style.background="#777"; 
    bgObj.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75)"; 
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
    msgObj.style.border="1px solid #336699"; 
    msgObj.style.position = "fixed"; 
    msgObj.style.left = "10%"; 
    msgObj.style.top = "10%"; 
    msgObj.style.font="12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    msgObj.style.width = msgw + "px"; 
    msgObj.style.height =msgh + "px"; 
    msgObj.style.textAlign = "center"; 
    msgObj.style.lineHeight ="25px"; 
    msgObj.style.zIndex = "10001"; 
	msgObj.style.borderRadius = "10px";
    document.body.appendChild(msgObj); 
	
	var title=document.createElement("div");
	title.setAttribute("align","center"); 
	title.style.margin="0"; 
    title.style.padding="3px";
    title.style.height="40px";
	title.style.fontSize = "15px";
	title.style.fontWeight = "bold";
	title.style.background=" #f8f8f8"; 
	title.style.borderRadius = "10px";
	
	var titleName = document.createElement("div");
	titleName.style.lineHeight = "40px";
    titleName.innerHTML = data["name"];
	title.appendChild(titleName);
	
	var closeButton = document.createElement("div");
	closeButton.style.position = "absolute";
	closeButton.style.right = "0px";
	closeButton.style.top = "0px";
	closeButton.style.cursor="pointer";
	closeButton.style.width="50px";
	closeButton.style.padding = "5px";
	closeButton.style.margin = "5px"; 
	closeButton.style.borderRadius = "10px";
	closeButton.style.background="#99CCFF"; 
	closeButton.innerHTML = "X";
	closeButton.onclick=function(){ 
		document.body.removeChild(bgObj); 
		document.getElementById("msgDiv").removeChild(title); 
		document.body.removeChild(msgObj);
	};
	title.appendChild(closeButton);
    document.getElementById("msgDiv").appendChild(title);
	
	var imgDiv = document.createElement("div");
	var picturePath = "images/nopicture.jpg";
	if ( "pictureName" in data && data["pictureName"] != "" && data["pictureName"]!="undefined")
		picturePath = imagePath+shopinfo+'/images/'+data["pictureName"];
	var img = document.createElement("img");
	imgDiv.style.margin = "0px";
	imgDiv.style.padding = "0px";
	img.style.margin = "0px";
	img.style.padding = "0px";
	img.style.maxWidth = msgw + "px";
	img.style.maxHeight = "300px";
	img.src = picturePath;
	imgDiv.appendChild(img);
	document.getElementById("msgDiv").appendChild(imgDiv);
	
	var textDiv = document.createElement("div");
	textDiv.style.margin = "0px";
	textDiv.style.padding = "0px";
	textDiv.style.textAlign = "left"; 
	var priceDiv = document.createElement("div");
	priceDiv.style.margin = "0px 10px";
	priceDiv.innerHTML = "价格： " + data["price"] + "元/" + data["unit"];
	
	var decDiv = document.createElement("div");
	decDiv.style.margin = "0px 10px";
	decDiv.innerHTML = "描述： " + data["desc"];
	
	textDiv.appendChild(priceDiv);
	textDiv.appendChild(decDiv);
	document.getElementById("msgDiv").appendChild(textDiv);
	
	
}

