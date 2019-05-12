var shopinfo="";
var openid = "";
var contentArray=JSON.parse('{}');
var categoryArray=JSON.parse('{}');
function init()
{
	shopinfo = getLocalStorage("shopinfo");
	openid = getLocalStorage("openid");
	
	var contentData = getLocalStorage("dishesData");
	if ( contentData!=null && contentData != "")
	{
		contentArray = JSON.parse(contentData);
	}
	var categoryData = getLocalStorage("categoryData");
	if ( categoryData!=null && categoryData != "")
	{
		categoryArray = JSON.parse(categoryData);
	}
	getUserMessage();
	fillOrderList();
	setInputWeight();
	doSelectBtn();
	countTotalPrice();
	initDeliveryTime();
}

function initDeliveryTime()
{
	var curTime = new Date();
	var beginHour = curTime.getHours();
	var beginMinute = "00";
	var curMinutes = curTime.getMinutes();
	if ( curMinutes < 30 )
		beginMinute = "30";
	else
		beginHour += 1;
	var deliveryTimeObj = $F("deliveryTimeS");
	for ( var i = 1; i<5; i++ )
	{
		var value = "";
		if ( beginHour < 10 )
			value += "0" + beginHour;
		else if ( beginHour < 24 )
			value += beginHour;
		else
		{
			beginHour -= 24;
			value += "0" + beginHour;
		}
		value += ":" + beginMinute + "~";
		if ( beginMinute == "30" )
		{
			beginHour += 1;
			beginMinute = "00";
		}
		else
			beginMinute = "30";
			
		if ( beginHour < 10 )
			value += "0" + beginHour;
		else if ( beginHour < 24 )
			value += beginHour;
		else
		{
			beginHour -= 24;
			value += "0" + beginHour;
		}
		value += ":" + beginMinute;
		
		deliveryTimeObj.options[deliveryTimeObj.length] = new Option(value, value);
	}
	deliveryTimeObj.options[0].selected = true;
}

function setInputWeight()
{
	cWidth = document.documentElement.clientWidth - 150;
	if( cWidth < 250 )
	{
		var inputObj = _queryAll(".list_content .l5 input");
		var idx;
		for ( idx=0;idx<inputObj.length;idx++ )
			inputObj[idx].style.width =  cWidth+"px";
	}
}

function fillOrderList()
{
	if ( contentArray == null )
		return;
	var index=0;
	var orderObj = $F("order_list");
	var orderListLength = orderObj.childNodes.length;
	for ( index=0; index<orderListLength; index++ )
	{
		if ( orderObj.childNodes[index].className != "list_header" )
		{
			orderObj.removeChild(orderObj.childNodes[index]);
			index--;orderListLength--;
		}
	}
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
			var newNode = document.createElement("ul");
			newNode.setAttribute("categoryName", key);
			newNode.className = "list_content";
			var l1 = document.createElement("li");
			l1.className = "l1";
			l1.innerHTML = data[i]["name"];
			newNode.appendChild(l1);
			
			var l2 = document.createElement("li");
			l2.className = "l2";
			l2.innerHTML = data[i]["price"] + '元/' + data[i]["unit"];
			newNode.appendChild(l2);
			
			var l3 = document.createElement("li");
			l3.className = "l3";
			l3.innerHTML = '<button class="minus"></button><i>'+data[i]["selectNum"]+'</i><button class="add"></button>';
			newNode.appendChild(l3);
			
			orderObj.appendChild(newNode);
		}
	}
}

function fillUserMessage(data)
{
	if ( data == "" || data == null )
		return;
	if ( "name" in data )
		$F("name").value = data["name"];
	if ( "phone" in data )
		$F("phone").value = data["phone"];
	if ( "address" in data )
		$F("address").value = data["address"];
	if ( "remark" in data )
		$F("remark").value = data["remark"];
}

function getUserMessage()
{
	var url = "/wechat/customer.php?opt=getCustomerInfo&shopinfo=" + shopinfo + "&openid=" + openid +"&time="+new Date().getTime();
	getJson( url, fillUserMessage );
}

function confirmSubmit()
{
	if ( $F("name").value == "" )
	{
		sAlert("请输入姓名");
		return;
	}
	if ( $F("phone").value == "" )
	{
		sAlert("请输入联系电话");
		return;
	}
	if ( $F("address").value == "" )
	{
		sAlert("请输入配送地址");
		return;
	}
	if ( parseInt($F("totalPrice").innerHTML) == 0 )
	{
		sAlert("菜单为空，无法提交");
		return;	
	}
	sConfirm("确定提交订单？", submitData);	
}

function submitData()
{
	var url = "/wechat/orders.php?opt=addOrder&shopinfo=" + shopinfo + "&openid=" + openid +"&time="+new Date().getTime();
	var parameter = "";
	parameter += "phone=" + $F("phone").value;
	parameter += "&address=" + $F("address").value;
	parameter += "&remark=" + $F("remark").value;
	parameter += "&name=" + $F("name").value;
	parameter += "&totalPrice=" + parseInt($F("totalPrice").innerHTML);
	parameter += "&deliveryTime=" + $F("deliveryTime").value;
	
	var jsonObj = JSON.parse('[]');
	var id = 0;
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
			jsonObj[id] = JSON.parse('{}');
			jsonObj[id]["name"] = data[i]["name"];
			jsonObj[id]["price"] = data[i]["price"];
			jsonObj[id]["selectNum"] = data[i]["selectNum"];
			id++;
		}
	}
	
	parameter += "&orderData=" + JSON.stringify(jsonObj);
	
	postJson(url, parameter, function handler(result){
									if ( result.code == 0 )
										window.location.href = "/wechat/main.html?shopinfo="+shopinfo+"&openid="+openid+"&time="+new Date().getTime();
									else
										sAlertBig("您有一个订单还未处理，暂时不能提交新订单");
								   
								   });
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

function updateContentArray(nodeObj, num)
{
	try
	{
		var dishName = nodeObj.children[0].innerHTML;
		var categoryName = nodeObj.getAttribute("categoryName");
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
        var btnObj = _queryAll("div .list_content .l3");
        var btnIndex = 0;
		var btnLength = btnObj.length;
        for(btnIndex;btnIndex<btnLength;btnIndex++)
		{
            var countNumText=parseInt(btnObj[btnIndex].children[1].innerHTML);
            var btnAdd=btnObj[btnIndex].children[2];
            var btnMin=btnObj[btnIndex].children[0];

			var originalNum;
            _addEventListener(btnAdd, _moveendEvt,function(){
                
				var _self = getEventTarget();
                originalNum = parseInt(_self.parentNode.children[1].innerHTML, 10);
                countNumText =  originalNum +1;
                _self.parentNode.children[1].innerHTML = countNumText;
				updateContentArray(_self.parentNode.parentNode, countNumText);
            });

            _addEventListener(btnMin, _moveendEvt,function(){
                var _self = getEventTarget();
				var parentNode = _self.parentNode.parentNode;
                originalNum = parseInt(_self.parentNode.children[1].innerHTML, 10);
                countNumText =  originalNum - 1;
                _self.parentNode.children[1].innerHTML = countNumText;
				updateContentArray(parentNode, countNumText);
				if ( countNumText <= 0 )
				{
					var categoryName = parentNode.getAttribute("categoryName");
					var categoryId = searchItem( categoryArray, "name", categoryName );
					var categoryNum = parseInt(categoryArray[categoryId]["selectNum"]);
					categoryArray[categoryId]["selectNum"] = categoryNum - 1;
					setLocalStorage("categoryData", JSON.stringify(categoryArray));
					
					parentNode.parentNode.removeChild(parentNode);
				}
            });
        }
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

function backToMain()
{
	var url = "/wechat/main.html?shopinfo="+shopinfo+"&openid="+openid+"&useLocalStorage=true"+"&time="+new Date().getTime();
	window.location.href = url;	
}

function clearOrderConfirm()
{
	sConfirm("确定清除所选菜品？", clearOrders);
}

function clearOrders()
{
	if ( contentArray == null )
		return;
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
			contentArray[key][i]["selectNum"] = 0;
		}
	}
	setLocalStorage("dishesData", JSON.stringify(contentArray));
	
	backToMain();
}

function deliveryTimeChange()
{
	$F("deliveryTime").value =  $F("deliveryTimeS").value;	
}
