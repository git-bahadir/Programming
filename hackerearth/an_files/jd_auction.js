var url = location.href;
var base_path = url.substring(0, url.indexOf('/', 14));
var city_select_container = "select_container";
var city_select_div = "city_div";
var iframeflag = 0;
var catname_str = "";
var catid_str = "";
var ajaxRequest;
var searchterm = '';
var searchcity = '';
var compid = '';
var cur_pg = '';
var pg_sz = '';
var load_f = 0;

var cat_arr;
var catid_arr;
var id_len;
var name_len;
var category_name;
var category_id;
function implode (glue, pieces) {
    var i = '',
        retVal = '',        tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }    if (typeof(pieces) === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        } 
        for (i in pieces) {            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }    return pieces;
}
function select_cat(cat, type)
{			
	var cat_split = cat.split('##');
	var cat_id = cat_split[0];
	var cat_name = cat_split[1];	
	if(type.checked==true || type == 'filcat')
	{
		//validate_chkbox(cat_id);
		var chks = document.getElementsByName('cat_chkbox');
		count = 0;	
		for (var z=0;z<chks.length;z++)
		{
			if (chks[z].checked==true)
			{				
				count++;
				hasChecked = true;			
			}
		}
		if(count > 3)
		{
			alert("You Can Select Max. 3 Categories");
			type.checked = false;
			//document.getElementById(cat_id).checked = false;
			return false;
		}
		catname_str+=cat_name+"~~";
		catid_str+=cat_id+"~~";
		
		/*if(catname_str.search(cat_name+"~~")==-1)
		{
			catname_str+=cat_name+"~~";
		}
		if(catid_str.search(cat_id+"~~")==-1)
		{
			catid_str+=cat_id+"~~";
		}
		*/
		cat_arr = catname_str.split("~~");		
		catid_arr = catid_str.split("~~");				
	}
	else
	{		
		cat_arr = catname_str.split("~~");		
		catid_arr = catid_str.split("~~");				
		
		var len = cat_arr.length;		
		for(var c=0;c<len;c++)
		{
			if(cat_arr[c]==cat_name)
			{				
				cat_arr.splice(c,1);
			}
			if(catid_arr[c]==cat_id)
			{				
				catid_arr.splice(c,1);
			}
		}
	}
	catid_str = implode("~~",catid_arr);
	catname_str = implode("~~",cat_arr);	
	category_name = implode(",",cat_arr);	
	category_id = implode(",",catid_arr);
	if(category_name.substr(-1)==",")
	{
		id_len = category_id.length;
		name_len = category_name.length;
		category_name = category_name.substr(0,name_len-1);
		category_id = category_id.substr(0,id_len-1);		
	}
}

function validate_chk(id)
{
	alert("You Can Select Max. 3 Categories");
	document.getElementsById(id).checked = false;	
}
var count;
function validate_chkbox(id)
{//
	var chks = document.getElementsByName('cat_chkbox');
	var hasChecked = false;	
	count = 0;	
	for (var z=0;z<chks.length;z++)
	{
		if (chks[z].checked==true)
		{				
			count++;
			hasChecked = true;		
		}
	}
	if (hasChecked == false)
	{
		alert("Please select what you are looking for.");
		return false;		
	}
}
function doCookieCheck()
{
	var cookieCity = (rev_result == 1) ? search_city : getCookie("CITY");

	/* Set New City if user comes from Results Page especially All India Search. Variable name => rev_result */
	//cookieCity = (cookieCity == "") ? "e.g. Mumbai" : ((window.rev_result == 1) ? _b.DOM.gE('city_input').value : cookieCity);
	cookieCity = (cookieCity == "") ? "Mumbai" : cookieCity;
	setCity(cookieCity);
}
/*
function getCookie(Name)
{
	var result = "";
	var search = Name + "=";
	var cook = document.cookie;
	if (cook.length > 0)
	{
		offset = cook.indexOf(search);
		if(offset > -1)
		{
			offset += search.length;
			end = cook.indexOf(";", offset);
			if(end == -1)
				end = cook.length;
			result = unescape(cook.substring(offset, end));
		}
	}
	return result;
}
*/
function setCookie(CookieName, CookieValue)
{
	var expDate = new Date();
	var offset = 2 / 1;
	expDate.setYear(expDate.getFullYear() + offset);
	document.cookie = escape(CookieName) + "=" + escape(CookieValue) + "; expires=" + expDate.toGMTString() + "; path=/";
}
function isValid(value, type)
{
	var str = $.trim(value);
 	switch(type)
 	{
		case 'name':
		return/^[a-zA-Z]+([.]{0,1}[ ]{0,1}[a-zA-Z]+)*$/.test(str);
		case 'alpha':
   		return /^[A-Za-z]*$/.test(str);
  		case 'numeric':
   		return /^[0-9]*$/.test(str);
  		case 'email':
   		return /^(([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,7}){0,1}$/.test(str);
 	}
}
