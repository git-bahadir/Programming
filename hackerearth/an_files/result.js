var bestdealform = false;
var onfocusvar = 0;
var closebestdealform = false;
var scroll_status = true;
var fixIpadOffset = 0;
var smsemailsource = '';
var shwbd = 1;
var rsl_movie_cat = '';
$(document).ready(function(){
	$(window).mousedown(function(event){
		shwbd = 0;
	});
	$('.drpwn').mouseleave(function() {
		$('.drpwn').addClass('dn');
});
});

function srchOnload() {
	$('.act').removeClass('current');
	if(tabVal == '')
	{
		document.cookie = escape('tab') + "=" + escape('toprs') + ";  path=/; domain=" + cookieondomain;
		tabVal = 'toprs';
	}
	$("#"+tabVal).addClass('act');
	
	if($('#jdg').val() == 0 )
	{
		if($("#prid").val() == "" || ($("#i1") && $("#i1").attr('src').indexOf('ImageUnavailable') != -1))
		{
			getphotos($('#review_paid_id').val(),'result');
		}
	}	
	
	if($('#jdg').val() == 1 )
	{
		carousel();
		$('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
		
	}	
	if(autoValue != 'National Search') {
		if( iwhat.indexOf( 'Movie' ) !== -1) 
		{
			document.cookie = escape('moviecid') + "=" + $('#catid').val() + "; path=/; domain=" + cookieondomain;
		}
	}
	if(getCookie('prevcatid') != document.index.catid.value)
	{
		document.cookie = escape('BDprofile') + "=" + escape(0) + ";  path=/; domain=" + cookieondomain;
	}
	
	if((window.lowprice && lowprice == 1) && vlc_page != 1)
	{
		if(getCookie('prevcatid') != document.index.catid.value || getCookie('prevcatid') == '')
		{
			if($('#prid').val() == '')
				setTimeout("open_bestdeal()",7000);
		}else{
			document.cookie = escape('BDprofile') + "=" + escape(1) + ";  path=/; domain=" + cookieondomain;	
		}
		document.cookie = escape('prevcatid') + "=" + escape(document.index.catid.value) + ";  path=/; domain=" + cookieondomain;
		
	}

	if(getCookie('rtpage') != '')
	{
		document.cookie = escape('rtpage') + "=deleted; expires=" + new Date(0).toUTCString() + "; path=/; domain=" + cookieondomain;
	}
	
	$('#sbd').mousedown(function (event) {
		if(strstr($("#what").val().toLowerCase(),$('#where').val().toLowerCase()))
		{
			var remv_area = (($('#where').val().substr(0,3).toLowerCase() == "at ") ? '' : ' Near ')+$('#where').val();
		}
		$("#what").val($("#what").val().replace(remv_area,''));
		$('#where').val($('#sortbydist').val()); 
        var tcity = getCookie('scity');
		if(tcity == "" || tcity == null || tcity == undefined || tcity ==$("#city").val())
		{
			document.cookie = 'inweb_area='+$('#sortbydist').val().trim()+';expires=0;path=/;domain='+cookieondomain;
			document.cookie = 'sarea='+$('#sortbydist').val().trim()+';expires=0;path=/;domain='+cookieondomain;
		}
		if($('#locarea').val() == 1)
			setCookieTab('tab','distance',$('#catid').val());
		else
			setCookieTab('tab','location',$('#catid').val());
	});
	$('#sortbydist').click(function (event) {
		if($('#sortbydist').val().substr(0,4)=='e.g.' )
		{
			$('#sortbydist').val('');
			$('#sortbydist').removeClass('grey');
		}
	});
	
	$('#sortbydist').keyup(function(event) {
		if (handleKeys(event,"#sortbydist","#go","#sbd")==true) {
			if (event.which == 13)
			{
                            var sbdselfree = $("#sbd ul li a.act").text();
				$('#where').val($('#sortbydist').val()); 
				if($('#locarea').val() == 1)
				setCookieTab('tab','distance',$('#catid').val());
				else
					setCookieTab('tab','location',$('#catid').val());
                                
                                if(sbdselfree != "" && sbdselfree != null && sbdselfree != undefined){
                                    var tcity = getCookie('scity');
									if(tcity == "" || tcity == null || tcity == undefined || tcity ==$("#city").val())
									{
										document.cookie = 'inweb_area='+$('#sortbydist').val().trim()+';expires=0;path=/;domain='+cookieondomain;
										document.cookie = 'sarea='+$('#sortbydist').val().trim()+';expires=0;path=/;domain='+cookieondomain;
									}
                                } else{
                                    document.cookie = 'free_area='+trim($('#sortbydist').val())+';expires=' + date.toGMTString() + ';path=/;domain='+cookieondomain;
								}
			}
			return false;
		}
		var str_reg = /^[^a-zA-Z0-9]+$/.test($('#sortbydist').val().trim());
		if(str_reg == false)
		{
			JSONS("autosuggest.php",{search:  ''+$('#sortbydist').val().trim()+'' ,city:  ''+ $('#city').val()+'',cases:  'where'},'#sbd');
		}
	});

	/*if(onloadFn  != 'Result' && onloadFn != 'National Search' && org_onloadFn  != 'NSsearch')
	{
	var a = $('.jbrd').offset();	
	if(typeof a != 'undefined')
	{	
		setTimeout (function () {
			if(!$("#city").is(':focus') && !$("#what").is(':focus') && !$("#where").is(':focus'))
			{
				if($(window).scrollTop() <= a.top+15)
					scrollTo(0,a.top+15);
			}
		}, 800);
	}
	}

	if(onloadFn == 'Result' && rsl_movie_cat != '')
	{	
		MDOCIDJ = $('#review_paid_id').val();		
		var currentDate = new Date();
		currentDate = $.datepicker.formatDate('dMMyy', currentDate);	
		get_movie_time(MDOCIDJ,currentDate,$('#catid').val(),$('#city').val(),2);
	}
	*/
	
	if(onloadFn == 'Result')
	{
		if(vertical == 'shopfront')
		{
			if(getCookie('prevprid') != document.index.prid.value || getCookie('prevprid') == '')
			{
				setTimeout("open_bestprice()",7000);
			}

			document.cookie = escape('prevprid') + "=" + escape(document.index.prid.value) + ";  path=/; domain=" + cookieondomain;
			
			//shopbk();
		}
	}
	
	fProdReview($('#prid').val());
}

// Set Cookies - Sort By
function setCookieTab(c_name,c_value,catid) {
	if($('#locarea').val() == 1 && c_value == 'distance')
	{
		closeDiv('jsbd');
		if($('#sortbydist').val())
		{
			$('#distance .drpwn').removeClass('dn');
		}
	}
	else
	{
		if($('#where').val() == '')
		{
			$('#where').val($('#sortbydist').val());
			$("#arlnk").html($('#sortbydist').val());
			var tcity = getCookie('scity');
			if(tcity == "" || tcity == null || tcity == undefined || tcity ==$("#city").val())
			{
				document.cookie = 'inweb_area='+$('#sortbydist').val().trim()+';expires=0;path=/;domain='+cookieondomain;
				document.cookie = 'sarea='+$('#sortbydist').val().trim()+';expires=0;path=/;domain='+cookieondomain;
			}
		}
		
		
			$('#catid').val(catid);
		
		
	document.cookie = escape(c_name) + "=" + escape(c_value) + ";  path=/; domain=" + cookieondomain;
	document.cookie = "catid =" + escape(catid) + ";  path=/; domain=" + cookieondomain;
	document.cookie = 'alter=;  path=/; domain=' + cookieondomain;
	$("#itab").val("1");
	gofun('utab');

	}
}

// Sort By Distance
function sortBydist(catid) {
	var str	= jQuery.trim($('#sortbydist').val());
	if(str == "") {
		alert("Please Enter an Area")
		return false;
	}
	else {
		if(strstr($("#what").val().toLowerCase(),$('#where').val().toLowerCase()))
		{
			var remv_area = (($('#where').val().substr(0,3).toLowerCase() == "at ") ? '' : ' Near ')+$('#where').val();
		}
		$("#what").val($("#what").val().replace(remv_area,''));
		$('#where').val($('#sortbydist').val()); 
		if($('#locarea').val() == 1)
			setCookieTab('tab','distance',$('#catid').val());
		else
			setCookieTab('tab','location',$('#catid').val());
	}
}

// Bestdeal Popup
function open_bestdeal() 
{
	var showflg	=	true;
	var curr_company = getCookie("curr_comp");
	if($('#gtnf').is(':visible') || $('#jul').is(':visible') || $('#jfp').is(':visible') || $('#best_deal_div').is(':visible') || $('#jcuo').is(':visible') || shwbd == 0 || $('#downloadWinPopup').is(':visible'))
	{
		showflg	= false;
	}	
		
	if(showflg	== true)
	{	
		if(filterCat > 1)
			var bdlq = "low_quote_fltr";
		else
			var bdlq = "low_quote";
			
		openDiv('best_deal_div','bestdeal',bdlq);
		trackEvent('category','Autopopup','Best_Category');
	} 
	bestdealform = false;
}

// Best Price Popup
function open_bestprice() 
{
	var showflg_bpr	=	true;
	if($('#vspec').is(':visible') || $('#gtnf').is(':visible') || $('#jul').is(':visible') || $('#jfp').is(':visible') || $('#best_deal_div').is(':visible') || $('#jcuo').is(':visible') || shwbd == 0 || $('#downloadWinPopup').is(':visible'))

	{
		showflg_bpr	= false;
	}	
		
	if(showflg_bpr	== true)
	{	
		//openDiv('bstprice');
	} 
}

function redirect_mktg(baseencode_str,page,city) 
{
	window.open(WEBROOT+"redirect.php?str="+baseencode_str+'&page='+page+'&city='+city,'_blank');
}


window.onscroll = function () 
{
	if(document.getElementById('lnkipad')!=null)
	{
		fixIpadBanner();
	}
	if(scroll_status==false)
	{
		return false;
	}
	
	//if((lowprice == 1))
	//{
		//bestdealform = true;
	//}

	if (document.getElementById("best_deal_form") && bestdealform ==  true && closebestdealform == false)
	{
		if(($.browser.msie && ($.browser.version=="6.0" || $.browser.version=="7.0")) || touchy == true) {
				if(touchy == true)
				{
					if(!onfocusvar)
					{
						var botBlock = $(window).scrollTop()+$(window).height()-90;
					}
					else
					{
						var botBlock = $(window).scrollTop()+$(window).height()-485;
					}
				}
				else
				{
					var botBlock = $(window).scrollTop()+$(window).height()-$("#best_deal_form").height()-150;
				}
			}
	}
    //getBlockDivScroll();
}

function setCookiebest(CookieName,CookieValue) {
	var expDate = new Date();
	var offset = 2 / 1;
	expDate.setYear(expDate.getFullYear() + offset);
	document.cookie = escape(CookieName) + "=" + escape(CookieValue) + "; expires=" + expDate.toGMTString() + "; path=/; domain=" + cookieondomain;
}

function closePopUp(divname) 
{
	if(filterCat > 0 && divname == 'best_deal_div')
	{
		$('#category_id').val('');
	}
	
	if(divname == "best_deal_resp")
	{
		if(getCookie("bdsuccess") == 1)
		{
			document.cookie = "bdcheck = ''" + ";  path=/; domain=" + cookieondomain;
			$("#best_deal_form").hide();
		}
	}
	if(divname =="best_deal_resp_detail" || divname=="best_deal_dnd_detail")
	{
		catname_str="";
		catid_str="";
		category_name = "";
		clear_check_box();
	}
	if(document.getElementById("ibse_vcode_detail"))
	{
		$("#ibse_vcode_detail").hide();
		document.getElementById("bddnd_dtl").innerHTML = "";
	}
	if(divname == "best_deal_div")
	{
		closebestdealform = true;
		document.cookie = escape('BDprofile') + "=" + escape(1) + ";  path=/; domain=" + cookieondomain;
	}
	if(document.getElementById("ibse_vcode"))
	{
		$("#ibse_vcode").hide();
		document.getElementById("bddnd").innerHTML = "";
	}
	if(divname == "smssuccess")
	{
		document.getElementById("smssuccess").innerHTML = "";
	}
}

function fixIpadBanner()
{
	if (fixIpadOffset==0)
	{
		fixIpadOffset = $("#lnkipad").offset();
		fixIpadOffset.top = fixIpadOffset.top  - 100;
	}
    var top = $(window).scrollTop();
    /*if (touchy == false)
    {

        if (top >= 317)
            oInterval = window.setInterval(fltdiv,50);
        else
            window.clearInterval(oInterval);
    }*/
	
	if(($.browser.msie && ($.browser.version=="6.0" || $.browser.version=="99.0")) || touchy == true) 
	{
		if (top <= (fixIpadOffset.top - 2) && touchy == false)
			$('#lnkipad').animate({top:0+'px'},100);
		else if (touchy == false)
		{
			$('#lnkipad').animate({top:(top-(fixIpadOffset.top - 1))+'px'},100);
		}
		else
		{   if (touchy == true) {
				//if (top <= (fixIpadOffset.top - 2)) top = (fixIpadOffset.top - 1);
				//$('#lnkipad').animate({top:top+'px'},50);
			}
			else
				$('#lnkipad').animate({top:top+'px'},50);
		}
    }
    else
    {
        fltdivfix()
    }
}

function fltdivfix()
{
    var top = $(window).scrollTop();
	if (fixIpadOffset==0)
	{
		fixIpadOffset = $("#lnkipad").offset();
		fixIpadOffset.top = fixIpadOffset.top  - 100;
	}
	
	var winhei = $(window).height();
	var foohei = $("#footer").height();
	var lnkhei    = $("#lnkipad").height();
	var toppx = (winhei - foohei);
	
	toppx = (lnkhei+93) - toppx;
	
	var gettop = $(".jpag").offset();
	var gethei = $("#lnkipad").height();
	
	if(document.getElementById('srchpagination')!=null && gettop.top > 1120)
	{		
		if ((gettop.top - gethei) <= top-100)
		{
			$('#lnkipad').removeClass("srch_ipad");
			$('#lnkipad').addClass("srch_ipad_fixed");
			$('#lnkipad').attr("style","top:-"+toppx+"px");
		}
		else if (top >= (fixIpadOffset.top))
		{
			
			$('#lnkipad').removeClass("srch_ipad");
			$('#lnkipad').addClass("srch_ipad_fixed");
			$('#lnkipad').attr("style","top:3px");
			//$('#lnkipad').attr("style","position:fixed;top:0px;");
			if ($.browser.msie  && parseInt($.browser.version, 10) === 7) 
			{
				var divRight = $(window).width() - $('.jw').width() - (($('.jw').position().left)) + 8;			  
				$("#lnkipad").css("right", divRight);
			}

		}
		else
		{
			$('#lnkipad').removeClass("srch_ipad_fixed");
			$('#lnkipad').addClass("srch_ipad");
			$('#lnkipad').attr("style","top:3px");
			//$('#lnkipad').attr("style","position:relative;top:0px");
		}
	}
}

function sbp_url(rurl)
{
	rurl = rurl+'/photos';
	if(window.event) {
		window.event.returnValue = false;
        window.location = rurl;
        return false;
    }else {
        window.location = rurl;
    }
}

function getDate(day, rsdt)
{
	if(rsdt != '') {
		var date = new Date(rsdt);
	} else {
		var date = new Date();
	}
    date.setDate(date.getDate() + day);
    var months = new Array(12);
    months[0] = "January";
    months[1] = "February";
    months[2] = "March";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "December";
    var nexttonextday = '';
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
               'Thursday', 'Friday', 'Saturday'];
    
    var dateMsg = date.getDate()+months[date.getMonth()]+date.getFullYear();
    return dateMsg;

}
/*
function getMovieDate(day, rsdt)
{
	if(rsdt != '') {
		var date = new Date(rsdt);
	} else {
		var date = new Date();
	}
	
    date.setDate(date.getDate() + day);
    var months = new Array(12);
    months[0] = "Jan";
    months[1] = "Feb";
    months[2] = "Mar";
    months[3] = "Apr";
    months[4] = "May";
    months[5] = "Jun";
    months[6] = "Jul";
    months[7] = "Aug";
    months[8] = "Sep";
    months[9] = "Oct";
    months[10] = "Nov";
    months[11] = "Dec";
    var nexttonextday = '';
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
               'Thursday', 'Friday', 'Saturday'];
    
    if(day == 0 && rsdt == '') {
        nexttonextday = ', Today';
    } else if(day == 1 && rsdt == '') {
        nexttonextday = ', Tomorrow';
    } else if(day == 2 || rsdt != '') {
        nexttonextday = ', '+weekday[date.getDay()];
    } 
    
    var dateMsg = date.getDate()+' '+months[date.getMonth()]+nexttonextday; //date.getFullYear()
    return dateMsg;

}
*/

function get_movie_time_dropdown(docid, cdate, city, dd, i, rsdt)
{	
	var mcurdate = new Date();
	var rsdt_arr = rsdt.split('-');
    var date_today = mcurdate.getDay();
    var t = mcurdate.getDate();
    
    if(t.toString().length == 1) { t = '0'+ t; }
    var m = mcurdate.getMonth() + 1;
    if(m.toString().length == 1) { m = '0'+ m; }
    var today_date_ymd = mcurdate.getFullYear()+'-'+m+'-'+t;
    var mtdd = '';
    //if(mcurdate.getFullYear() < rsdt_arr[0] || date.getMonth() < rsdt_arr[1] || date.getDate() < rsdt_arr[2]) {
		
	if(strtotime(today_date_ymd) < strtotime(rsdt)) {
		var day0 = getMovieDate(0, rsdt);
		var day00 = getDate(0, rsdt);
		var day1 = getMovieDate(1, rsdt);
		var day11 = getDate(1, rsdt);
		var day2 = getMovieDate(2, rsdt);
		var day22 = getDate(2, rsdt);
	} else {
		var day0 = getMovieDate(0, '');
		var day00 = getDate(0, '');
		var day1 = getMovieDate(1, '');
		var day11 = getDate(1, '');
		var day2 = getMovieDate(2, '');
		var day22 = getDate(2, '');
	}
    
    if(getCookie('moviecid') != '') {
		var mid = getCookie('moviecid');
	} else {
		var mid = $('#catid').val();
	}
	
    var docidstr = docid.replace(/\.+/g, '_');
    if(dd == 0) {
        mtdd += '<input type="text"  id="mvDate_'+docidstr+'" value="'+day00+'" onclick="toggleDropDown(\'mvtmdd_'+docidstr+'\', \'mvDtArw\', \'ddar\', \'ddar\');" />';
        mtdd += '<span class="ddar" id="mvDtArw" onclick="toggleDropDown(\'mvtmdd_'+docidstr+'\', \'mvDtArw\', \'ddar\', \'ddar\');"></span>';
        mtdd += '<span class="show_dt dn '+i+'" id="mvtmdd_'+docidstr+'"><ul>';
            mtdd += '<li onclick="get_movie_time(\''+docid+'\',\''+day1+'\',\''+mid+'\',\''+city+'\',\'3\',\'1\', \''+i+'\', \''+rsdt+'\', event);">'+day11+'</li>';
            if(date_today != 3 && strtotime(today_date_ymd) >= strtotime(rsdt)) {
            mtdd += '<li onclick="get_movie_time(\''+docid+'\',\''+day2+'\',\''+mid+'\',\''+city+'\',\'3\',\'2\', \''+i+'\', \''+rsdt+'\', event);">'+day22+'</li>'; }
        mtdd += '</ul></span>';
    } else if(dd == 1) {
        mtdd += '<input type="text" id="mvDate_'+docidstr+'" value="'+day11+'" onclick="toggleDropDown(\'mvtmdd_'+docidstr+'\', \'mvDtArw\', \'ddar\', \'ddar\');" />';
        mtdd += '<span class="ddar" id="mvDtArw" onclick="toggleDropDown(\'mvtmdd_'+docidstr+'\', \'mvDtArw\', \'ddar\', \'ddar\');"></span>';
        mtdd += '<span class="show_dt dn '+i+'" id="mvtmdd_'+docidstr+'"><ul>';
            mtdd += '<li onclick="get_movie_time(\''+docid+'\',\''+day0+'\',\''+mid+'\',\''+city+'\',\'3\',\'0\', \''+i+'\', \''+rsdt+'\',  event);">'+day00+'</li>';
            if(date_today != 3 && strtotime(today_date_ymd) >= strtotime(rsdt)) {
            mtdd += '<li onclick="get_movie_time(\''+docid+'\',\''+day2+'\',\''+mid+'\',\''+city+'\',\'3\',\'2\', \''+i+'\',\''+rsdt+'\', event);">'+day22+'</li>'; }
        mtdd += '</ul></span>';
    } else if(dd == 2) {
        mtdd += '<input type="text" id="mvDate_'+docidstr+'" value="'+day22+'" onclick="toggleDropDown(\'mvtmdd_'+docidstr+'\', \'mvDtArw\', \'ddar\', \'ddar\');" />';
        mtdd += '<span class="ddar" id="mvDtArw" onclick="toggleDropDown(\'mvtmdd_'+docidstr+'\', \'mvDtArw\', \'ddar\', \'ddar\');"></span>';
        mtdd += '<span class="show_dt dn '+i+'" id="mvtmdd_'+docidstr+'"><ul>';
            mtdd += '<li onclick="get_movie_time(\''+docid+'\',\''+day0+'\',\''+mid+'\',\''+city+'\',\'3\',\'0\', \''+i+'\', \''+rsdt+'\', event);">'+day00+'</li>';
            if(date_today != 3 && strtotime(today_date_ymd) >= strtotime(rsdt)) {
            mtdd += '<li onclick="get_movie_time(\''+docid+'\',\''+day1+'\',\''+mid+'\',\''+city+'\',\'3\',\'1\', \''+i+'\', \''+rsdt+'\', event);">'+day11+'</li>'; }
        mtdd += '</ul></span>';
    }
    
    $('#mvtmdd_'+docidstr).hide();
    $('#mvDT_'+docidstr).html(mtdd);
}

function get_movie_time(docid, cdate, mid, city, result_type, dd, i, rsdt, e)
{
	
	if (typeof($('#releaseDateId').val()) =='undefined' || $('#releaseDateId').val()=='') {
	mid =  0;	
	}
	$.ajax({url:WEBROOT+"functions/ajxMovieInfo.php?mid="+mid+"&result_type="+result_type+"&date="+cdate+"&docid="+docid+"&city="+city ,async:false, success:function(result){
            get_time_html(result, cdate,mid,city);
            if(result_type == 3 && typeof(rsdt) != 'undefined') {				
                var docArr = docid.split(',');
			
			$(docArr).each(function(index,docid){			
				get_movie_time_dropdown(docid, cdate, city,dd, i, rsdt);	
			});
            }

            /*if(e != undefined && e != '' && e != null)
				e.preventDefault();*/
    }});
}

function get_time_html(result, cdate,mid,city)
{	
	var mhtml = '';
	var d = eval('(' + result + ')');
	
 if (d && d.length>0){	
	var mid_arr = d[0];
	mid_arr = mid_arr.replace(/\'+/g, '');
	var m = mid_arr.split(",");
	
	if (d[1]['srcdata'] == 'JD'){
		var srcdata = d[1]['srcdata'];
	}
	else {
		var srcdata = 'book';
	}
	
	if(typeof(d[1]) != 'undefined')
	{
	for(var i = 0; i < m.length; i++)
		{
			if (srcdata=='book'){
				timeObj = d[1]['time_info'];
				moviebookingSrc =  d[1]['moviebookingSrc'];
				timest = 0;
				timecnt =  timeObj.length;
			}
			else {
				timeObj = d[1][m[i]];	
				timest = 1;
				timecnt = parseInt(d[1][m[i]]['cnt'])+1;
			}
			if(typeof(timeObj) != 'undefined')
			{
				var stHTML = '';
				var landingURL = '';
				var tmpDoc = m[i].replace(/\.+/g, '_');
				
				if (mid !='0') { // movie page
				var isMovieBookAvailable = false;
				var currentTime = new Date();
				var chkMovieTime = currentTime.getTime() + (45 * 60 * 1000);				 
				var nTime = new Date(chkMovieTime);				 
				 if (currentTime.getDate() != nTime.getDate()){
					var current_time = '23:59';
				 }
				 else {
					var current_time = nTime.getHours()+':'+nTime.getMinutes();
				 }		
					
					var current_date = getMovieDate(0, '');  
					var tmpTodayDate = current_date.replace(/\s+/g,'').split(',');
					var tmpDate = cdate.replace(/\s+/g,'').split(',');
				
				for(var j = timest; j < timecnt; j++)
				{					
					timeinfoObj = timeObj[j];					
					msTimeURL = timeinfoObj['msTimeURL'];
					msTime = timeinfoObj['msTime'];
					msTime12 = timeinfoObj['msTime12'];
					
					movieScheduleid = timeinfoObj['movieScheduleid']; 
					landingurl = timeinfoObj['landing_url'];
					tid = timeinfoObj['tid'];
					tmid =  timeinfoObj['mid'];
					
                    var cinemaname = $('#cinemaDtl_' + tmpDoc.replace(/\./g, '_')).val().replace('#',',');
                        var docname = $('#cinemaDtl_' + tmpDoc.replace(/\./g, '_')).val();
						var docnameArr = docname.split('#');
                    if (srcdata=='book'){
						isMovieBookAvailable = true;
						
						if (tmpTodayDate[0] == tmpDate[0] && (parseFloat(msTime.replace(':','.')) < parseFloat(current_time.replace(':','.')))) {
							stHTML += '<span class="mvtm">'+msTime12+'</span>';
						}
						else {
							moviebookingSrc = moviebookingSrc.toUpperCase();
							if (moviebookingSrc == 'PVR' || moviebookingSrc == 'CINEMAX') {
								stHTML += '<span class="mvtm"><a rel="nofollow"  href="javascript:void(0);" onclick="bookSSO(\'' + movieScheduleid + '\',\'' + tid + '\',\'' + tmid + '\',\'' + moviebookingSrc + '\');"><span>'+msTime12+'</span></a></span>';
							}
							else if (moviebookingSrc == 'FC') {
								stHTML += '<span class="mvtm"><a rel="nofollow" href="'+landingurl+'" onclick="bookMovieSite(\'' + landingurl + '\',\''+city+'\',\''+mid+'\',\''+$('.mvname').html()+'\',\''+m[i]+'\',\''+docnameArr[0]+'\',\''+msTime12+'\',\''+tmid+'\',\''+tid+'\',\''+movieScheduleid+'\',\'FC\');" target="_blank" ><span>'+msTime12+'</span></a></span>';
							}
							else {
								stHTML += '<span class="mvtm"><a rel="nofollow" href="javascript:void(0);" onclick="_ct(\'BCBT\',\'lspg\');bookMovieTicket(\'movie\',\''+tmpDoc+'\',\''+movieScheduleid+'\');"><span>'+msTime12+'</span></a></span>';
							}
						}
					}
                    else if(cdate != current_date && tmpTodayDate[0] != tmpDate[0] && msTimeURL != '')
					{
						//isMovieBookAvailable = true;
						stHTML += '<span class="mvtm"><a target="_blank" rel="nofollow" href="'+msTimeURL+'" onclick="_ct(\'BCBT\',\'lspg\');"><span>'+msTime12+'</span></a></span>';
					}
					else if(msTime >= current_time && msTimeURL != '')
					{
						//isMovieBookAvailable = true;
						stHTML += '<span class="mvtm"><a target="_blank" rel="nofollow" href="'+msTimeURL+'" onclick="_ct(\'BCBT\',\'lspg\');"><span>'+msTime12+'</span></a></span>';
					}
					else
					{
						stHTML += '<span class="mvtm">'+msTime12+'</span>';
					}
					
				}
			}
			else {
				stHTML = 'Cinema';
			}
				if(stHTML != "")
				{
					
					if (typeof($('#btnBTkt_'+tmpDoc)) != 'undefined'){					
					if (srcdata=='book') {						 
						 if (mid =='0') { // not movie page
							 landingURL = 'javascript:bookMovieList(\''+m[i]+'\',\'0\');_ct(\'bookmovie\',\'dtpg\',\'16777216\');';
						var bkTkHtml = '<a class="grnbtn" href="'+landingURL+'">Book Tickets</a>';
						$('#btnBTkt_'+tmpDoc).html(bkTkHtml);
						$('#btnBTkt_'+tmpDoc).parents('.jfbt').show();
						$('#btnBTkt_'+tmpDoc).show();
						}
						else {							
							//movie landing page
						landingURL = 'javascript:bookMovieList(\''+m[i]+'\',\''+$('#catid').val()+'\');_ct(\'bookmovie\',\'dtpg\',\'16777216\');';
						$('#btnBTkt_'+tmpDoc).attr('href',landingURL);
						$('#btnBTkt_'+tmpDoc).html('<b>Book Tickets</b>');
						$('#btnBTkt_'+tmpDoc).attr('class','bktcksgrn');
						}
					}
					else {						
						$('#btnBTkt_'+tmpDoc).attr('href','javascript:void(0);');

						if (isMovieBookAvailable){
							$('#btnBTkt_'+tmpDoc).html('<b>Book Tickets</b>');	
						}
						else{
							$('#btnBTkt_'+tmpDoc).html('<b>Show Timings</b>');	
						}
						
						$('#btnBTkt_'+tmpDoc).attr('class','bktcksgry');
						
					}
					}
					$('#bcst_'+tmpDoc).html(stHTML);
				}
			}
		}
	}
 }
}

function strtotime (text, now) {
    // Convert string representation of date and time to a timestamp
    //
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/strtotime
    // +   original by: Caio Ariede (http://caioariede.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: David
    // +   improved by: Caio Ariede (http://caioariede.com)
    // +   bugfixed by: Wagner B. Soares
    // +   bugfixed by: Artur Tchernychev
    // +   improved by: A. Matías Quezada (http://amatiasq.com)
    // +   improved by: preuter
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    // *     example 1: strtotime('+1 day', 1129633200);
    // *     returns 1: 1129719600
    // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    // *     returns 2: 1130425202
    // *     example 3: strtotime('last month', 1129633200);
    // *     returns 3: 1127041200
    // *     example 4: strtotime('2009-05-04 08:30:00');
    // *     returns 4: 1241418600
    var parsed, match, year, date, days, ranges, len, times, regex, i;

    if (!text) {
        return null;
    }

    // Unecessary spaces
    text = text.trim()
        .replace(/\s{2,}/g, ' ')
        .replace(/[\t\r\n]/g, '')
        .toLowerCase();

    if (text === 'now') {
        return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000 | 0;
    }
    if (text === 'now') {
        return new Date().getTime() / 1000; // Return seconds, not milli-seconds
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000;
    }

    match = text.match(/^(\d{2,4})-(\d{2})-(\d{2})(?:\s(\d{1,2}):(\d{2})(?::\d{2})?)?(?:\.(\d+)?)?$/);
    if (match) {
        year = match[1] >= 0 && match[1] <= 69 ? +match[1] + 2000 : match[1];
        return new Date(year, parseInt(match[2], 10) - 1, match[3],
            match[4] || 0, match[5] || 0, match[6] || 0, match[7] || 0) / 1000;
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    ranges = {
        'yea': 'FullYear',
        'mon': 'Month',
        'day': 'Date',
        'hou': 'Hours',
        'min': 'Minutes',
        'sec': 'Seconds'
    };

    function lastNext(type, range, modifier) {
        var diff, day = days[range];

        if (typeof day !== 'undefined') {
            diff = day - date.getDay();

            if (diff === 0) {
                diff = 7 * modifier;
            }
            else if (diff > 0 && type === 'last') {
                diff -= 7;
            }
            else if (diff < 0 && type === 'next') {
                diff += 7;
            }

            date.setDate(date.getDate() + diff);
        }
    }
    function process(val) {
        var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
            type = splt[0],
            range = splt[1].substring(0, 3),
            typeIsNumber = /\d+/.test(type),
            ago = splt[2] === 'ago',
            num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
            num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
            return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
        }
        if (range === 'wee') {
            return date.setDate(date.getDate() + (num * 7));
        }

        if (type === 'next' || type === 'last') {
            lastNext(type, range, num);
        }
        else if (!typeIsNumber) {
            return false;
        }
        return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
        return false;
    }

    for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
            return false;
        }
    }

    return (date.getTime() / 1000);
}

function stab_popup(tabsel)
{
	if(($('#where').val().substr(0,4)=='e.g.' || $('#where').val() == '') && tabsel == 'distance')
	{
		$('#locarea').val('1');
		openDiv('jsbd','');
	}
	else
	{
		if($('#'+tabsel+' .drpwn').hasClass('dn') ==true)
		{
			$('#'+tabsel+' .drpwn').removeClass('dn');
		}
		else
		{
			$('#'+tabsel+' .drpwn').addClass('dn');
		}
	}	
}

function rev_redirect_detail(t)
{
	var cflag = 0;
	var url = location.href;
	
	url += (t != '') ? '/'+t : '';
	if(window.event) {//IE 6
		window.event.returnValue = false;
        window.location = url;
				
        return false;
    }else {//firefox
        window.location = url;
		
    }	
}

function showhidemoreadd(i, url, action, tipty) {
	if(!touchy && (action == 'over' || action == 'out'))
	{
		if(tipty && tipty == 'rphvre')
		{
			if($('#rphvdisp'+i).hasClass('dn') == true) {
				$('#rphvdisp'+i).removeClass('dn');
			} else {
				$('#rphvdisp'+i).addClass('dn');
			}
		}
		else
		{
			if($('#morehvr_add_cont'+i).hasClass('dn') == true) {
				$('#morehvr_add_cont'+i).removeClass('dn');
			} else {
				$('#morehvr_add_cont'+i).addClass('dn');
			}
		}
	}
	
	if(touchy && action == '') {
		if(tipty && tipty == 'rphvre')
		{
			if($('#rphvdisp'+i).hasClass('dn') == true) {
				$('#rphvdisp').addClass('dn');
				$('.rphvr').css('color', '#1274c0');
				$('#rphvdisp'+i).removeClass('dn');
				$('#rphvr'+i).css('color', '#ff6c00');
				$('#rphvdisp'+i).css('color', '#ffffff');
			} else {
				$('#rphvdisp'+i).addClass('dn');
				$('#rphvr'+i).css('color', '#1274c0');
			}
		}
		else
		{
			if($('#morehvr_add_cont'+i).hasClass('dn') == true) {
				$('.mrehover').addClass('dn');
				$('.morehvr').css('color', '#1274c0');
				$('#morehvr_add_cont'+i).removeClass('dn');
				$('#morehvr_add'+i).css('color', '#ff6c00');
				$('#morehvr_add_cont'+i).css('color', '#ffffff');
			} else {
				$('#morehvr_add_cont'+i).addClass('dn');
				$('#morehvr_add'+i).css('color', '#1274c0');
			}
		}
	} else if(action == '') {
		if(window.event) {//IE 6
			window.event.returnValue = false;
			if(!tipty)
				window.location = url;
				
			return false;
		}else if(!tipty) {//firefox
			window.location = url;
		}
	}
}

$(document).live("touchstart", function(e) {
	var target = $(e.target);
	var linkid = /^morehvr_add_cont[0-9]{1,2}$/;
	var linkid2 = /^rphvdisp[0-9]{1,2}$/;
	if(target.context.id == '') {
		if(!linkid.test(target.context.firstElementChild.id)) {
			$('.mrehover').addClass('dn');
			$('.rphvr').css('color', '#1274c0');
		}
		if(!linkid2.test(target.context.firstElementChild.id)) {
			$('.rshover').addClass('dn');
			$('.morehvr').css('color', '#1274c0');
		}
	}
});

function setCookiePrice(url,catid)
{ 
	document.cookie = "tab=price;  path=/; domain=" + cookieondomain;
	document.cookie = "catid =" + escape(catid) + ";  path=/; domain=" + cookieondomain;
	document.cookie = 'alter=;  path=/; domain=' + cookieondomain;
	window.location=url;
}



