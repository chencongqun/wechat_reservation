var totalPages = 1;
var currentPage = 1;
function initPage(count, page) 
{
	currentPage = page;
	$F('pagebar').innerHTML = getPageCode(count, 20, page);
}

function firstPage()
{
	changePage(1);
}

function previousPage()
{
	if ( currentPage > 1 )
		changePage(currentPage-1);
}

function nextPage()
{
	if ( currentPage < totalPages )
		changePage(currentPage+1);
}

function lastPage()
{
	changePage(totalPages);
}

function changePage(page)
{
	var hasSetPage = false;
	var sHref = window.location.href;
	var args = sHref.split("?"); 
	if(args[0] == sHref)
	{ 
		sHref += "?page=" + page;
		window.location.href = sHref;
		return; 
	}
	sHref = args[0];
	var str = args[1]; 
	args = str.split("&"); 
	for(var i = 0; i < args.length; i++) 
	{
		str = args[i]; 
		var arg = str.split("="); 
		if(arg.length <= 1) 
			continue;
			
		if ( i == 0 )
			sHref += "?";
		else
			sHref += "&";
			
		if(arg[0] == "page")
		{
			sHref += "page="+page;
			hasSetPage = true;
		}
		else
			sHref += args[i];
	}
	if ( !hasSetPage )
		sHref += "&page="+page;
	window.location.href = sHref;
}
	
function getPageCode(recordCount, pageNum, pageCurrent) {
	
	var tmpSummary = '当前第' + '%curpage%/%totalpage%' + '页 共' + '%totalrecord%' + '条记录 ';
	var tmp1stPage = '<a href="javascript: firstPage();" title="' + '首页' + '">' +
					'<img src="images/pageicon_first.gif" align="absmiddle"/></a> ';
	var tmpPrevPage = '<a href="javascript: previousPage();" title="' + '前一页' + '">' + 
					'<img src="images/pageicon_prev.gif" align="absmiddle" /></a> ';
	var tmpNextPage = '<a href="javascript: nextPage();" title="' + '下一页' + '">' + 
					'<img src="images/pageicon_next.gif" align="absmiddle" /></a> ';
	var tmpLastPage = '<a href="javascript: lastPage();" title="' + '末页' + '">' + 
					'<img src="images/pageicon_last.gif" align="absmiddle" /></a> '; 



	var tmp1stPage_disabled = '<img src="images/pageicon_first_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
	var tmpPrevPage_disabled = '<img src="images/pageicon_prev_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
	var tmpNextPage_disabled = '<img src="images/pageicon_next_disabled.gif" align="absmiddle" />&nbsp;&nbsp;';
	var tmpLastPage_disabled = '<img src="images/pageicon_last_disabled.gif" align="absmiddle" />&nbsp;&nbsp;' ;


	

	var htmlOut = '';
	totalPages = Math.ceil(recordCount / pageNum) || 1;
	
	htmlOut += tmpSummary.applyTemplate({
						curpage: 		pageCurrent,
						totalpage:		totalPages,
						totalrecord:	recordCount});
	
	if (pageCurrent > 1) {
		htmlOut += tmp1stPage;
		htmlOut += tmpPrevPage;
	}else
	{
	
		htmlOut += tmp1stPage_disabled;
		htmlOut += tmpPrevPage_disabled;
	}
	
	if (pageCurrent != totalPages && totalPages != 1) {
		htmlOut += tmpNextPage;
		htmlOut += tmpLastPage;
	}else
	{
		htmlOut += tmpNextPage_disabled;
		htmlOut += tmpLastPage_disabled;
		
	}
	
	htmlOut += '跳到第' + ' <select name="selectPage" id="selectPage"> ';
	for (var i = 1; i <= totalPages; i++) {
		if (i == pageCurrent)
			htmlOut += '<option value="' + i + '" selected>' + i + '</option>';
		else
			htmlOut += '<option value="' + i + '">' + i + '</option>';
	}
	htmlOut += '</select>' + '页 ' +
				'<a href="javascript: changePage($F(\'selectPage\').value);" title="' + '跳转' + '">' + 
				'<img src="images/pageicon_go.gif" align="absmiddle" /></a>';

	return htmlOut;
}
