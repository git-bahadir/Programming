var slat = '';
var slon = '';
$(document).ready(function (){
	//showMyLocation();
	if(navigator.userAgent.toLowerCase().indexOf("bot") == -1 && onloadFn == 'jdmap')
	{
		if(WEBROOT)
		{
			html = '<section class="mapo">';		
				html +=	'<section id="map" class ="map"></section>';
				html +=	'<div class="Location">';
					html +=	'<div class="correctL jgre dn"><a href="javascript:void(0);" onclick="openmap(\'enlarge_map_div\',\'drgmp\');">Edit Location</a><span class="ctl"></span></div>';
				html += '</div>';
			html += '</section>';
			$(".maprght").html(html);
			
			$(".mapo").css('height',($(window).height()-34));
			$(".maplft").css('height',($(window).height()-33));
			$(".getdrcrsl").css('height',($(window).height()-300));
			if(slat != '' && slon != '') {
				jdmapsload(slat, slon, 1);
			} else {
				jdmapsload('21.190639500000', '78.828112500000', 0);
			}
			$('.leaflet-left').css('left', '350px');
		}
	}
});

function showMyLocation()
{
	var my_area = $.trim(getCookie('sarea'));
	if(my_area != '') {
		var my_lat = parseFloat($.trim(getCookie('slat')));
		var my_lng = parseFloat($.trim(getCookie('slon')));	
		$('#where_a').val(my_area);
		$('#lat_a').val(my_lat);
		$('#lng_a').val(my_lng);
		currentLocation(my_lat, my_lng);
	} else {
		getLocation();
	}		
}

function currentLocation(my_lat, my_lng)
{
	setTimeout("showDirPanel()",50);	
}

function hideDirPanel()
{
	$('#getdrctns').addClass('dn');
}

function showDirPanel()
{
	$('#getdrctns').removeClass('dn');
	var where_a_val = $('#where_a').val();
	var where_b_val = $('#where_b').val();
	if(($('#where_a').val() != '' && $('#where_a').val() != 'e.g. Malad East') && ($('#where_b').val() != '' && $('#where_b').val() != 'e.g. Malad West'))
	{
		getUserDirection('userDirections', 1);
	}
}

var map = '';
function jdmapsload(lat, lng, mrkrflg, star, page, comp, addr)
{
	map = Jdmap.init('map',[lat,lng],11);
	var contentString = '';
	
	if(page == 1){
		var stars = document.getElementById('star').value.split(',');
		var starstr = '<div class="Star0" style="padding:4px 0 0 0;float:left; width:95px">';
		for (var i=0;i<stars.length ;i++ )
		{
			starstr += '<span class="s'+stars[i]+'"></span>';
		}
		starstr += '</div>';

		if($.trim(getCookie('slat')) != '' && $.trim(getCookie('slon')) != '') {
			var getLocationLink = '<p style="color:black;float:left; margin:0; padding:0 0 10px 0;"><a href="javascript:void(0);" onclick="getUserDirection(\'userDirections\');">Get Direction</a></p>';
		} else {
			var getLocationLink = '';
		}

		var contentString = '<div id="content">'+
		'<div style="float:left; width:100%"><h1 style="color:black;float:left;padding:0 5px 0 0;font-size:18px;margin:0;"><b>'+document.getElementById('cn').value+'</b></h1>'+starstr+
		'</div><div id="bodyContent">'+
		'<p style="color:black;float:left; margin:0; padding:10px 0;">'+document.getElementById('add').value+'</p>'+getLocationLink+'</div>'+
		'</div>';
	}
	else if(page == 2){
		var stars = star.split(',');
		var starstr = '<div class="Star0" style="padding:4px 0 0 0;float:left; width:95px">';
		for (var i=0;i<stars.length ;i++ )
		{
			starstr += '<span class="s'+stars[i]+'"></span>';
		}
		starstr += '</div>';
		
		if($.trim(getCookie('slat')) != '' && $.trim(getCookie('slon')) != '') {
			var getLocationLink = '<p style="color:black;float:left; margin:0; padding:0 0 10px 0;"><a href="javascript:void(0);" onclick="getUserDirection(\'userDirections\');">Get Direction</a></p>';
		} else {
			var getLocationLink = '';
		}

		var contentString = '<div id="content">'+
		'<div style="float:left; width:100%"><h1 style="color:black;float:left;padding:0 5px 0 0;font-size:18px;margin:0;"><b>'+comp+'</b></h1>'+starstr+
		'</div><div id="bodyContent">'+
		'<p style="color:black;float:left; margin:0; padding:10px 0;">'+addr+'</p>'+getLocationLink+'</div>'+
		'</div>';
	
	}
	if(mrkrflg == 1) {
		Jdmap.addMarker(map,[lat,lng],null,contentString);
		Jdmap.setZoom(map, 11);
		showMyLocation();
		$('#getDir').removeClass('dn');
		$('#compAdd').html($('#where_a').val());
	} else {
		Jdmap.setZoom(map, 4);
	}
}

function printSelection(node) 
{
	_ct("map-print","dtpg");
	Jdmap.setZoom(map, 11);
	var content = document.getElementById(node).innerHTML;
	var pwin=window.open('','print_content');
	pwin.document.open();
	pwin.document.write('<html><head><link rel="stylesheet" href="'+WEBROOT+'tools/css/common.css" /></head><link rel="stylesheet" href="'+WEBROOT+'tools/css/webjdmap.css" /><link rel="stylesheet" href="'+WEBROOT+'tools/css/printmap.css" /><link rel="stylesheet" href="http://maps.justdis.com/css/jdapi.min.css" /><script type="text/javascript" src="http://maps.justdis.com/js/jdapi.min.js"></script><body onload="window.print()"><div class="dtlmap">'+content+'</div></body></html>');
	pwin.document.close();
	setTimeout(function(){pwin.close();},1000);
}



//function showLeftPanel(){$(".left-pnl").animate({left:"0px"})

function showHideMap(maplft)
{
	
	if(maplft == 'hide') {
		$('.maplft').animate({left:"-350px"});
		$('.leaflet-left').css('left', '25px');
		$('.lfticnshwi').hide();
	} else if(maplft == 'show') {
		$('.maplft').animate({left:"0px"});
		$('.leaflet-left').css('left', '350px');
		$('.lfticnshwi').show();
	}
}

function showWhrB()
{
	$('#getDir').addClass('dn');
	$('#gtdrct').removeClass('dn');
}

function jdmapmarker(lat,lng, z) {
	var contentString = '';
	Jdmap.addMarker(map,[lat,lng],null,contentString);
	if(z == 1) {
		Jdmap.setZoom(map, 4);	
	} else {
		Jdmap.setZoom(map, 6);	
	}
}

function getUserDirection(divID, flag)
{
	$('#'+divID).removeClass('dn');	
	$('#printMapBtn').removeClass('btn-disabled');	
	$('#printMapBtn').attr('onClick', "printSelection('dtlMapInfo');return false;");	
	if(flag == 1) { 
		if($('#where_a').val() == '') {
			alert('Please select your location');
			$('#where_a').focus();
			return false;
		} else if($('#where_a').val() == 'e.g. Malad East') {
			alert('Please select your location');
			$('#where_a').focus();
			return false;
		} else if($('#where_b').val() == '') {
			alert('Please select your location');
			$('#where_b').focus();
			return false;
		} else if($('#where_b').val() == 'e.g. Malad West') {
			alert('Please select your location');
			$('#where_b').focus();
			return false;
		}
		if(parseFloat($('#lat_a').val()).toFixed(5) == parseFloat($('#lat_b').val()).toFixed(5) && parseFloat($('#lng_a').val()).toFixed(5) == parseFloat($('#lng_b').val()).toFixed(5)) {
			alert('No route possible.');
			return false;
		}
		var to_lat = parseFloat($('#lat_a').val());
		var to_lng = parseFloat($('#lng_a').val());
		var from_lat = parseFloat($('#lat_b').val());
		var from_lng = parseFloat($('#lng_b').val());
	} else {
		var to_lat = parseFloat(document.getElementById('lt').value);
		var to_lng = parseFloat(document.getElementById('ln').value);
		var from_lat = parseFloat($.trim(getCookie('slat')));
		var from_lng = parseFloat($.trim(getCookie('slon')));
	}
	Jdmap.setZoom(map, 10);	
	Jdmap.getDirection(to_lat,to_lng,from_lat,from_lng,map,divID);	
	if(touchy != true)
	{
		setTimeout("setSlider($('#userDirections'));",500);
	}
}

function swtichtabval()
{
	if($('#where_a').val() != '' && $('#where_b').val() != '') {	
		var a_whr = $('#where_a').val();
		var a_lat = $('#lat_a').val();
		var a_lng = $('#lng_a').val();
	
		var b_whr = $('#where_b').val();
		var b_lat = $('#lat_b').val();
		var b_lng = $('#lng_b').val();
		
		$('#where_a').val(b_whr);
		$('#where_b').val(a_whr);
		
		$('#lat_a').val(b_lat);
		$('#lat_b').val(a_lat);
		
		$('#lng_a').val(b_lng);
		$('#lng_b').val(a_lng);
		
		getUserDirection('userDirections', 1);
	}
}

function view_map_result(docid,casepv,datacity,lat,long,idflag,area,star,reloadFlag)
{
	var resultpage = 2;
	var comp = $('#'+idflag+' .jcn>a').text();
	var addr = $('#'+idflag+' .jaddt>a>.mrehover').text();
	
	$('#comp_name').html(comp+', ');
	$('#comp_add').html(addr);
	$('#lat_b').val(lat);
	$('#lng_b').val(long);
	$('#where_b').val(comp+'-'+area);
	
	if (window.history && window.history.pushState) {
		window.history.pushState('forward', null, location.href);
		$(window).on('popstate', function() {
			if($('#mapPopup').length && document.getElementById('mapPopup').style.display == "block")
			{
				closeDiv('mapPopup');
			}})
	;}
	if(reloadFlag != 1){
		openDiv('mapPopup');
    }
	document.getElementById("refresh-map").setAttribute("onclick","view_map_result('"+docid+"','"+casepv+"','"+datacity+"','"+lat+"','"+long+"','"+idflag+"','"+area+"','"+star+"','1');_ct('map-ref','dtpg');");
	
	$('#getdrctns').removeClass('dn');
	if($('.mapo'))
	{
		$('#printMapBtn').addClass('btn-disabled');	
		$('#printMapBtn').attr('onClick', "return false;");	
		$('.dtlmap').removeClass("dn")
		if($('.mapo') && $('.mapo').hasClass("dn"))
		{
			$('.mapo').removeClass("dn")
		}
		else
		{
			if(navigator.userAgent.toLowerCase().indexOf("bot") == -1)
			{
				if(WEBROOT)
				{
					html = '<section class="mapo">';		
					html +=		'<section id="map" class ="map"></section>';
					html +=			'<div class="Location">';
					html +=				'<div class="correctL jgre dn"><a href="javascript:void(0);" onclick="openmap(\'enlarge_map_div\',\'drgmp\');">Edit Location</a><span class="ctl"></span></div>';
					if(1)
					{
						html +=				'<div class="noBorder" style="display:none;"><input class="ltxt" type="text" id="get_my_directions" value="Get Directions From?" onblur="getvalueBack(\'blur\');" onfocus="getvalueBack(\'focus\');" onkeypress="routeKeyPress(event);" /><input class="button" type="button" id="routebuttn" onclick="javascript:getdirections(\'directions_div\');" value="Route" /></div>';
					}
					html += '</div>';
					html += '<a class="jcl" href="javascript:;" onclick="mapclass();" >X</a>';
					html += '</section>';
					//html += '<section class="fcont" id="userDirections"></section>';
					$(".maprght").html(html);					
					$(".maplft").css('height',($(window).height()-45));
					$(".mapo").css('height',($(window).height()-45));
					jdmapsload(lat, long, 1, star, resultpage, comp, addr);
					$('.leaflet-left').css('left', '350px');
				}
			}
		}
	}
	
}

function view_map(docid,casepv,datacity, reloadFlag)
{
	if (window.history && window.history.pushState) {
		window.history.pushState('forward', null, location.href);
		$(window).on('popstate', function() {
			if($('#mapPopup').length && document.getElementById('mapPopup').style.display == "block")
			{
				closeDiv('mapPopup');
			}})
	;}
	openDiv('mapPopup');
	$('#getdrctns').removeClass('dn');
	
	var lat = document.getElementById('lt').value;
	var lng = document.getElementById('ln').value;
	var mpfl = document.getElementById('mpfl').value;
	
	if($('.mapo'))
	{
		$('#printMapBtn').addClass('btn-disabled');	
		$('#printMapBtn').attr('onClick', "return false;");	
		$('.dtlmap').removeClass("dn")
		if($('.mapo') && $('.mapo').hasClass("dn"))
		{
			$('.mapo').removeClass("dn")
		}
		else
		{
			if(navigator.userAgent.toLowerCase().indexOf("bot") == -1)
			{
				if(WEBROOT)
				{
					html = '<section class="mapo">';		
					html +=		'<section id="map" class ="map"></section>';
					html +=			'<div class="Location">';
					html +=				'<div class="correctL jgre dn"><a href="javascript:void(0);" onclick="openmap(\'enlarge_map_div\',\'drgmp\');">Edit Location</a><span class="ctl"></span></div>';
					if(ed('mpfl').value)
					{
						html +=				'<div class="noBorder" style="display:none;"><input class="ltxt" type="text" id="get_my_directions" value="Get Directions From?" onblur="getvalueBack(\'blur\');" onfocus="getvalueBack(\'focus\');" onkeypress="routeKeyPress(event);" /><input class="button" type="button" id="routebuttn" onclick="javascript:getdirections(\'directions_div\');" value="Route" /></div>';
					}
					html += '</div>';
					html += '<a class="jcl" href="javascript:;" onclick="mapclass();" >X</a>';
					html += '</section>';
					//html += '<section class="fcont" id="userDirections"></section>';
					$(".maprght").html(html);
					$(".maplft").css('height',($(window).height()-45));
					$(".mapo").css('height',($(window).height()-45));					
					jdmapsload(lat, lng, mpfl, '', 1);
					$('.leaflet-left').css('left', '350px');
				}
			}
		}
	}
	if(ratethisvar != 1)
	{
		setTimeout("goToByScrolldetail(\'mrtab\');",500);
	}
}



function clear_text_box_val(eg_type,id,event) 
{
	if(event=="onfocus") {
		if(document.getElementById(id).value=="e.g Ravi Verma" || document.getElementById(id).value=="" || document.getElementById(id).value=="e.g 9867045061" || document.getElementById(id).value=="e.g. abc@xyz.com" || document.getElementById(id).value=="e.g. Malad East" || document.getElementById(id).value=="e.g. Malad West") {
			document.getElementById(id).value = "";
			document.getElementById(id).style.color = "#000000";
		}
	}
	if(event == "onblur") {
		if(document.getElementById(id).value=="") {
			if(id == "wrname" || id == "sname" || id == "sname1" || id == "sname2" || id == "shrenm1" || id == "shrenm2" || id == "shrenm3" || id == "shrenm4" || id == "shrenm5" || id == "shrmnm1" || id == "shrmnm2" || id == "shrmnm3" || id == "shrmnm4" || id == "shrmnm5")	{
				document.getElementById(id).value = "e.g Ravi Verma";
			}
			if(id == "wremail" || id == "smail" || id == "shrem1" || id == "shrem2" || id == "shrem3" || id == "shrem4" || id == "shrem5" || id == "shrem") {
					document.getElementById(id).value = "e.g. abc@xyz.com";
			}
			if(id == "wrmob" || id == 'shrmn' || id == "shrmn1" || id == "shrmn2" || id == "shrmn3" || id == "shrmn4" || id == "shrmn5") {
				document.getElementById(id).value = "e.g 9867045061";
			}
			if(id == "where_a") {
				document.getElementById(id).value = "e.g. Malad East";
			}
			if(id == "where_b") {
				document.getElementById(id).value = "e.g. Malad West";
			}
			document.getElementById(id).style.color = "#BDBDBD";
		}
		else
		{
			document.getElementById(id).style.color = "#000000";
		}
	}
}

function mapclass()
{
	$('.dtlmap').addClass('dn');
	$('.mapo').addClass('dn');
	$('#userDirections').addClass('dn');
}
