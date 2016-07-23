var touchy=(navigator.userAgent).indexOf("CPU OS 5_0")==-1 && ('ontouchstart' in document.documentElement)?true:false;
var tab;
var topreviews;
var lgn;
var filterCat;
var alat;
var alon;
var changeArea=false;
var starttime = new Date().getTime();
var org_onloadFn = onloadFn;
var closedDate = '';
var loginred = 0;
var nextDateFlag = 0;
var galvideohtml = '';
var favstr = '';
var favajax = false;
var favpajax = false;
var filajax = false;
var filpajax = false;
var nextpfav = 0;
var nextptl = 0;
var relphotos = new Array();
var avoidneararea = 0;
var PinCode = 0;
var intervalID ='';
var orderIntervalID ='';
var timerFlag = false;
var IEbwsr = ($.browser.msie || (navigator.userAgent).indexOf("rv:11.0")!=-1) ? 1 : 0;
var firstrelphotos = new Array();
var total;
var pgNo=1;
var lazyloadng=1;
$(window).scroll(function(event) {
			total=Math.ceil($('#total').val()/9);
				if(getScrollTop() + $(window).height() >= $(document).height() - 500) { 

						if(pgNo < total && lazyloadng)
						{
							$(".load_more").html("<img src='http://images.jdmagicbox.com/icontent/sfloader.gif' /> Loading more details");
							pgNo++;
							$('#docloader').show();
							lazyloadng=0;
							showMoreDocAppointments();
						}
			   }
		});

function showMoreDocAppointments(){

		var sort = $('#sortby').val();
		$.ajax({url:WEBROOT+"doctHistory.php?sortaction="+sort+"&page="+pgNo,dataType:"json", success:function(result){
			var html='';

			if(result != ''){
				$(".load_more").html("<img src='http://images.jdmagicbox.com/icontent/sfloader.gif' /> Loading more details");
				lazyloadng=1;
				$.each(result.results, function(i,obj) 
				{
					var book_status = result.results[i].rsvndetails.booking_status;
					var str = result.results[i].compdetails.docid;
					var dcd = str.replace(".", "-");

					var str2 = result.results[i].rsvndetails.entry_date;
					var edate = str2.split(" ");
					var d = new Date(edate[0]);
					var entry_date = d.getDate() + '/' + ((d.getMonth())+1) + '/' + d.getFullYear();

					var reqbk = result.results[i].compdetails.popular_flag ? result.results[i].compdetails.popular_flag : '';
					if(reqbk == 1) {
						var IdText = 'Request '; var CnclButTxt = 'Request '; var AppbookingTxt = 'Request for Appointment';
					}else {
						var IdText  = 'Booking '; var CnclButTxt = 'Appointment '; var AppbookingTxt = 'Book New Appointment';
					}

					var curtime = Date.parse(new Date());
					
					var btime = result.results[i].rsvndetails.booking_datetime;
					var btime = btime.replace(" ", "T");
					var bktime = Date.parse(btime);

					var bdatetime = result.results[i].rsvndetails.booking_datetime;
					var bdatetime = new Date(bdatetime.replace(" ", "T"));
					var hours = bdatetime.getHours() > 12 ? bdatetime.getHours() - 12 : bdatetime.getHours();
					var am_pm = bdatetime.getHours() >= 12 ? "PM" : "AM";
					hours = hours < 10 ? "0" + hours : hours;
					var minutes = bdatetime.getMinutes() < 10 ? "0" + bdatetime.getMinutes() : bdatetime.getMinutes();
					//var seconds = bdatetime.getSeconds() < 10 ? "0" + bdatetime.getSeconds() : bdatetime.getSeconds();
					var booking_datetime = bdatetime.getDate() + '/' + ((bdatetime.getMonth())+1) + '/' + bdatetime.getFullYear() + " | "+ hours + ":" + minutes +" " + am_pm;

					
					//var book_new_url = WEBROOT+'dctcity+''/'+cnm+'-<near>-'+dcarea+'/'+dcd+'_BZDET';
					var book_new_url = result.results[i].urlpart;
					var book_new_url = WEBROOT+book_new_url.replace("~", "-<near>-");
					if(result.results[i].compdetails.totloc > 1 || result.results[i].compdetails.tothosp > 0) {
						if(book_status == 2) {
								book_new_url += '/?tab=book-appointment?stb=2&reqbk='+reqbk;
						} else {
								book_new_url += '/?tab=book-appointment&reqbk='+reqbk;
							}
					} else {
							book_new_url += '/?tab=book-appointment&reqbk='+reqbk;
					}

					if(result.results[i].compdetails.external_api == 1) {
							var cnclcls = 'disb';
							var onclick = '';
					} else {
							var cnclcls = '';
							var onclick = 'cancelHistoryAppt(\'popup\', \''+result.results[i].rsvndetails.ref_number+'\')';
					}
						

					html+='<section class="fdr_box">';
						html+='<span class="fhd"><b>'+result.results[i].compdetails.compname;
						if(result.results[i].compdetails.area)
							html+=','+result.results[i].compdetails.area+'</b></span>';
						else
							html+='</b></span>';
						
						html+='<div class="fdt">';
							html+='<span><b>Booking Date:</b> '+entry_date+'</span> | <span><b>Date &amp; Time of Appointment :</b> '+booking_datetime+'</span> | <span><b>'+IdText+'ID: </b>'+result.results[i].rsvndetails.ref_number+'</span>';
							html+='<input type="hidden" id="type_flag" name="type_flag" value="2"/>';
						html+='</div>';

							html+='<table class="odrdt" border="0" cellspacing="0" cellpadding="0"><tr><td width="15%">Name Of Doctor:</td><td width="45%">'+result.results[i].compdetails.entity_name+'</td><td rowspan="2" class="drapmnt">';

							if (book_status == -1)
							{
								html+='<a class="green" id="booknew" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \'\', \''+result.results[i].compdetails.docid+'\');">'+AppbookingTxt+'</a><a class="gray disb" id="cancelled">Cancelled</a>';
							} else if(book_status == 3)
							{
									var str6 = result.results[i].rsvndetails.booking_source;
									var n = str6.indexOf("vendor"); 
										if(n>=0) {
											if(bktime <= curtime) {
												html+= '<a class="green" id="booknew" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \'\', \''+result.results[i].compdetails.docid+'\');">'+AppbookingTxt+'<!--Book New Appointment --></a>';
											} else {
												html+= '<a class="green" id="reschedule" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \''+result.results[i].compdetails.ref_number+'\', \''+result.results[i].compdetails.docid+'\');">Reschedule </a><a class="gray '+cnclcls+'" href="javascript:;" id="cancelappt" onclick="'+onclick+'">Cancel Appointment</a>';
											}
										} else {
											html+= '<a class="green" id="booknew" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \'\', \''+result.results[i].compdetails.docid+'\');">'+AppbookingTxt+'<!--Book New Appointment --></a><a class="gray disb" id="completed">Completed</a>';
										}
							} else if(book_status == 2) {
										if(bktime <= curtime)
										{
											html+= '<a class="green" id="booknew" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \'\', \''+result.results[i].compdetails.docid+'\');">'+AppbookingTxt+'<!--Book New Appointment --></a>';
										}
										else
										{
											html+= '<a class="green" id="reschedule" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \''+result.results[i].compdetails.ref_number+'\', \''+result.results[i].compdetails.docid+'\');">Reschedule </a><a class="gray '+cnclcls+'" href="javascript:;" id="cancelappt" onclick="'+onclick+'">Cancel '+CnclButTxt+'<!--Appointment--></a>';
										}
							} else {
										html+='<a class="green" id="booknew" href="javascript:;" onclick="gotoBookNew(\''+book_new_url+'\', \'\', \''+result.results[i].compdetails.docid+'\');">'+AppbookingTxt+'<!--Book New Appointment --></a>';
									}
							html+='</td></tr>';

							
							if(result.results[i].compdetails.department)
								html+='<tr><td width="15%">Department:</td><td width="45%">'+result.results[i].compdetails.department+'</td></tr></table>';
							else html+='</table>';
					html+='</section>';
				});
				$('#apptResults').append(html);
			}
			if(pgNo >= total){
						 $(".load_more").html("No more details to load.");
					}
			
		}});
}
$(window).bind("load", function() {
    if(tab == 'bookatable' || $("#bktblflg").val() == 1){
		var docId = $("#docid").val();
		checkBookTableOwner(docId);
     }
     if((tab == 'menu order' || (tab == 'tblchkout' && dept == 2) || (typeof tabpage !=  'undefined' && tabpage == 'mnutab')) && typeof menuCat !=  'undefined'){
         
        var menuCatLen = menuCat.length;
        for(i=0; i < menuCatLen; i++)
           {

                  var cnt = 0;
                   $("#"+menuCat[i]+" li").each( function(j,val)
                   {

                       if($(this).hasClass('qtsl')){

                           $("#"+menuCat[i]).addClass('ckswt');
                           $("#"+menuCat[i]+' .qntyttl').show();
                           return false;
                       }

                   })


           }
         
     }
     if(tab == 'photos' || tab == 'photogallery' || tab == 'video'){
			  var docId = $("#docid").val();
              openGall('phouter',docId,'chg_dtl_logo'); 
     }
     if(relphotos.length > 0 || firstrelphotos.length > 0){
		//setTimeout(function(){ loadrelphotos(); },500);
		loadfirstrelphotos();
	 }
});
$(document).ready(function() {
   
    if($('#phouter').length)
	{
		$(document).keyup(function(e){
			if(e.keyCode == 27 && document.getElementById('phouter').style.display == "block" && window.history && window.history.pushState)
			{
				document.getElementById('phouter').style.display = "none";
				history.go(-1);	
			}
		});
	}
	if($('#mapPopup').length)
	{	
		$(document).keyup(function(e){
			if(e.keyCode == 27 && document.getElementById('mapPopup').style.display == "block" && window.history && window.history.pushState)
			{
				document.getElementById('mapPopup').style.display = "none";
				history.go(-1);	
			}
		});
	}
	$('#mapPopup .phcls').click(function(){
		if(window.history && window.history.pushState) {
			history.go(-1);
		}
	});
    if(onloadFn=='Index' && getCookie('scity')=='' && !WEBROOT.match(/jsdl\.in/g))
	{
		getLocation();
	}

	//window.onscroll = ipad_fscroll;
	if(onloadFn=='Index' || onloadFn == "National Search")
	{
		$(window).on('orientationchange', ipad_fscroll);
		$(window).on('scroll', ipad_fscroll);
	}
	
	if(onloadFn=='fav')
	{
		window.onscroll = favscroll;
		$("#favlst").scroll(function(){
			
			if(touchy && nextpfav > 0 && !favpajax && document.getElementById("favlst").scrollTop > 500)
			{
				removefav(nextpfav);
			}
		});
	}
	if(onloadFn=='filter')
	{
		window.onscroll = filtercroll;
	}
    //alert("avial height==>"+screen.availHeight+"<==window height==>" +$(window).height()+"<==document  height==>"+$(document).height() );
    $(".jbi").corner("5px");
	$(".gblock").corner("5px");
    $(".jsbl a").corner("top 5px");
    $(".jtse").corner("10px");
    $(".jcrv aside a").corner("top 5px");
    $(".jpt a").corner("top 5px");
    /*$(".jch").corner("5px");*/
    $(".jtgf").corner("5px");    
	$('.prd').corner("5px");
	$('.tag').corner("5px");
	$('.smr').corner("5px");
	$('.box').corner("5px");
	$(".wli").corner("10px");
	$('.swf').corner("5px");

	//alert($.browser.msie+"\n"+$.browser.version.substr(0, 1))	
	if(onloadFn == "tagfriend" || onloadFn == 'my_account')
	{
       new tagurfriend();
       new tugready();
    }
	if(onloadFn == "product_dt")
	{
		if($('#shprlt').length  > 0)
		{
			goToByScrolldetail('shprlt');
			if($('#updtdCty').is(":visible"))
			{	$('#updtdCty').fadeIn('slow').delay(4000).fadeOut('slow'); 
			}
		}		
		
		loadreviewsdata_product($("#prid").val(),'productReview');
		carousel();
	}
	if(onloadFn == "shopFilter")
	{
		_ct('pfpg','pfpg','32');
	}
	
	if(onloadFn == "product_dtv")
	{
		goToByScrolldetail('shpttl');
	}
    if(onloadFn == "howitworks" || onloadFn == "jd_food_order_city")/* code added for jdfos */
	{
		
		getData();
		areaCookie();
		
	}
    if(onloadFn == "Newcms")/* code added for newcms */
	{
		getData();
		areaCookie();
		detailReady();
	}
	else if(onloadFn == "read_mreview") 
	{
		loadScriptmovie();
		detailReady();
	}
	else if(onloadFn == "rate_prod") 
	{
		detailReady();
	}
	else if((onloadFn == "detailsPage" || onloadFn == "my_account") && tabVal == '6')
	{
		vendorReady();
	}
	/*else if((onloadFn == "detailsPage") && (tab == 'grocery' || tab == 'grocerycheckout'))
	{
		groceryReady();
	}*/
	else if(onloadFn == "detailsPage")
	{
		loadScript();
		detailReady();
		//BrowserDetection();
	}
	else if(onloadFn == "menuPage")
	{
		detailReady();
		
	}
	
	else if(onloadFn == "filter")
	{
		/*var a = $('.jbrd').offset();
	
		if(typeof a !=  'undefined')
		{
			window.scrollTo(0,a.top+15);
		}*/
		onloadFn = "filter";
	}
	else if(onloadFn == "Result")
	{	
		srchOnload();
		//BrowserDetection();
	}
	else if (onloadFn == "NSsearch")
	{	
		onloadFn = "National Search";
		srchOnload();
	}
	else if (onloadFn == "advertise" || onloadFn == "free_listing")
	{
        /*var a = $('.jbrd').offset();
	
		if(typeof a !=  'undefined')
		{
			window.scrollTo(0,a.top+15);
		}*/
		onloadFn = "Result";
		getData();
	}
	else if (onloadFn == "contest")
	{
		bindratingstar();
		bindlicat();
		objectbind();
		$('#scrollbar1').tinyscrollbar();
    }
	else if (onloadFn == "advance_search") {
        onloadFn = "Search";getData();
	} 
    else if (onloadFn == "contestregister")
	{
		bindratingstar();
		bindlicat();
        objectbind();
		//$('#scrollbar1').tinyscrollbar();
	}
    else if(onloadFn == "Index" || onloadFn == "National Search" || onloadFn == "fbIndex")
	{
		getData();
		setTimeout("blockhomepage()",30000);
		if(typeof contestid != 'undefined')
		{
			if(contestid  != "")
			{
				contestpopup();
			}
		}
	}
	else if(onloadFn == "latest_Reviews_Ratings")
	{
		getData();
	}
	else if(onloadFn == "prodcheckout")
	{
		shopbk();
	}		
	if(!($.browser.msie && $.browser.version.substr(0, 1) < 9))
	{
		$('.dswf').corner("5px");
		$("#jmen").corner("5px");
		$(".jad a").corner("top 5px");
		$(".jcdt aside a").corner("top 5px");
		$(".jcrc a").corner("5px");
		$(".jct").corner("5px");
		$(".jgpy").corner("right");
		//$('.jpop').corner("15px");
		//$('.jpbg').corner("15px").parent().css('padding', '2px');
		//$('.jcl').corner("5px");
		$(".jbc").corner("right 5px");
		$(".etl").corner("br 4px");
		$(".jblu").corner("left 5px");
		$(".jgre").corner("left 5px");
		$('.jsr .jblu').corner("1px");
		$('.jsr .jgre').corner("1px");
		$('.box').corner("5px");
		$('.osrch').corner("5px");
		$('.wulf').corner("5px");
		$('.chksbmt').corner("5px");
		$('.cfrmord').corner("bottom 10px");
		$('.cnfod').corner("15px");
		$('.futrst').corner("10px");
		$('.snfnd .advc').corner("10px");
		$('.snfnd .JNLeft').corner("10px");
		$('.preordtbl').corner("bottom 10px");
		$('.value-title').corner("5px");
		$('.mainCity').corner("10px");
		$('.whtpgs').corner("10px");
		$('.fltc_outer ul').corner("15px");
		$('.dnbktctg a').corner("5px");
		$('.gcy .fltc_outer ul').corner("15px");
		$('.thywrp .idtls').corner("bottom 10px");				
		$('.srynorsl').corner("5px");
		$('.mritmlnk a').corner("5px");
		//$('.bktblouter').corner("10px");
		$('.preopdiv').corner("10px");
		$('.preopdiv .jpbg').corner("10px");
			

		/*Result page updated*/
		$('.rtbx').corner("3px");
		/*Common header for all verticals*/
		$('.gradhd').corner("5px");

		
                
                var version = $.browser.version || "0";
                var splitVersion = version.split('.');
                
                if(typeof $.browser.opera == 'undefined' || ($.browser.opera == true && splitVersion[0] > 9))
                {
                    $('.rsaditm').corner("5px");
                    $('.quntyord').corner("5px");
                    $('.chktextar').corner("5px");
                    $('.tpitm').corner("bottom 15px");
                    $('.tpul').corner("bottom 15px");

                }
		
                //$('.ptop').corner("top 15px");
                $('.fmr').corner("bottom 15px");
	}
	//alert(onloadFn)
	$('.jmi').corner("5px");
	$('.rbu').corner("5px");
	$('.jmt').corner("5px");
	$('.mvti h3,.mvhd').corner("5px");

	if($('#scp').length)
	{
		setSlider($('#scp'));
	}
	if($('#offersPane').length)
	{
		setSlider($('#offersPane'));
	}
	
	if($("#scrollarea").length)
	{
			if(touchy)
			{
				touchScrollShp('scrollarea');
				setSlider($("#scrollarea"));	
			}
			else
			{
				setSlider($("#scrollarea"));
			}
	}	
	
	if($('.frndlist').length)
	{
		setSlider($('.frndlist'));
	}
			
	/*if($('.active').length)
	{
		$('.active').find('.sfltr').each(function(){
				setSlider($(this));
		});
	}	
	*/
	if($('#area_Suggest_popup').length)
	{
		setSlider($('#area_Suggest_popup'));
	}
	if($('#chkoutAuto').length)
	{
		setSlider($('#chkoutAuto'));
	}
	if($('#pchkoutAuto').length)
	{
		setSlider($('#pchkoutAuto'));
	}
	if($('#area_Grocery_Suggest_popup').length)
	{
		setSlider($('#area_Grocery_Suggest_popup'));
	}
	if($('#chkoutGroceryAuto').length)
	{
		setSlider($('#chkoutGroceryAuto'));
	}
	if($('#advf').length)
	{
		setSlider($('#advf'));
	}
	
	if($('#scpt').length)
	{
		setSlider($('#scpt'));
	}
	
	if($('#scpf').length)
	{
		setSlider($('#scpf'));
	}
	if($('#jfs').length)
	{
		setSlider($('#jfs'));
	}
	if($('#arlistt').length)
	{
		setSlider($('#arlistt'));
	}
        
	if($('#tcareAuto').length)
	{
            setSlider($('#tcareAuto'));
	}
        
	if($('#mpolisAuto').length)
	{
            setSlider($('#mpolisAuto'));
	}
        
	
	$('.jdph').click(function() {
		ten8();
	});

	if($('#jmen').length)
	{	
		$('#jmen').adGallery();
	}

	if(getcity == '8888888888')
	{
		ten8();
	}

	if($("#breadCrumb").length)
	{
		jQuery("#breadCrumb").jBreadCrumb({
			previewWidth : 35,
			endElementsToLeaveOpen: 2
		});
	}

	if(onloadFn == 'prodcheckout')
	{
		resetAddressHeight();
	}	
	
	/*if(onloadFn == 'Index')
	{	
		loadticker(intcnt);
	}*/
	if(onloadFn == 'Index')
	{
            
        /*Handling done when modified city from url start*/ 
		if(getcity != '' && getcity.toLowerCase()!=getCookie('inweb_city').toLowerCase() && getCookie('sarea') != '')
		{                 
            if($('section.pi_outer').is(':visible'))
			{    
				synccity();
				$('#city').val(getcity);
			}
			else 
			{
				setTimeout(synccity,50);
			}
			
		}
		else if(getcity != '' && getcity.toLowerCase() == getCookie('usrcity').toLowerCase() && getCookie('inweb_area') == '' && getCookie('sarea') == '')
		{
          getLocation();
		}
        else if((getcity.toLowerCase()==getCookie('inweb_city').toLowerCase()) && (getCookie('sarea')==''))
        {
          getLocation();
        }
		/* End */   
                
		var detarea = (getCookie('sarea')) ? getCookie('sarea') : '';
		if(detarea != '')
		{
			$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+detarea+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
			//$('.detarea').removeClass('dn');
			$('.detarea').removeClass('dn');
		}
		else
		{
			$('.detarea').html(disparea());
		}
	}

	if (onloadFn == "Index" || onloadFn == "National Search" || onloadFn == "advertise" || onloadFn == "free_listing")
	{
		$(window).bind("scroll",function() {
            if($('.blockMsg').hasClass('blockMsg')) {
                getBlockDivScroll();
            } else {
                if(touchy == true && $('.feedbckbtn').hasClass('feedbckbtn')) {
                    $('.feedbckbtn').animate({top:($(window).scrollTop()+$(window).height()-100)+'px'},'fast');
                }
            }
        });
	}
	rankingsPush();
	var hpcook	= getCookie_homepage('jdhomepage');
	if(hpcook == 1)
	{
		$(".homepage").hide();
		$(".callus").addClass("call_us");
		$(".call_us").removeClass("callus");
		$(".android_img").addClass("androidimg");
		$(".android_img").removeClass("android_img");
	}
	
	new Autosuggest();
	
	$('#btlogin').click(function() {	
		fn_loginStart();
	});
	
	$(document).mousedown(function(event) {
		hideDiv('city_Suggest_Main');
		});
	$(document).live('click touchstart',function(event) {
		var divEl = $('.menu_outer');
		if(divEl.is(":visible") && !$(".menu_outer").hasClass('dn') && !$(event.target).hasClass('navicn') && !$(event.target).hasClass('navicnic')){
			if(!divEl.is(event.target) && divEl.has(event.target).length === 0 ) {
				$('.menu_outer').addClass('dn');
			}
			if($("#navicn").hasClass('act'))
			{
				$("#navicn").removeClass('act');
			}
		}
		var divacc = $('#acc_opt');
		if(divacc.is(":visible") && !$(event.target).hasClass('myacnt') && !$(event.target).hasClass('ac_count')){
			if(!divacc.is(event.target) && divacc.has(event.target).length === 0 && !$('#acc_opt').hasClass('dn')) {
				$('#acc_opt').addClass('dn');
				if(getCookie('frnototal') && getCookie('frnototal') > 0)
					$('.ac_count').removeClass('dn');
			}
		}
	});
	
	$('#city').keydown(function(event) {
		if (event.which == 13) {
			setTimeout("$('#city').blur()",200);
		} else if (event.which == 9 && event.shiftKey == false) {
			setData("#"+this.id,autoValue);
			divHide('','');
		}
	});
	
	$('#where').change(function(event) {
		if(document.getElementById('arBox'))
		{
			if($("#where").val() == '')
			{
				$("#arlnk").html('Area');
				$("#arlnk").addClass("grey");
			}
			else
			{
				$("#arlnk").html($("#where").val());
				$("#arlnk").removeClass("grey");
			}
		}
	});
	
	$("#what").click(function(){
		if(touchy == true && navigator.userAgent.indexOf("GT-P") == -1) {
			$('html, body').animate({
				scrollTop: (onloadFn == "Index") ? $('.jsb').offset().top : $('#what').offset().top
			});
		}
		replace_whatout();
	});
	$("#what").focusout(function(){
		replace_whatin();
	});
	
	$('#city,#what,#where,#cityDiv,#flcity,#wcity,#txtDstnPincode').focusout(function(event) {
		
		$("#" + this.id).val($("#" + this.id).val().trim());
		if ($("#" + this.id).val() == "") {
			if(this.id != "where" )$("#" + this.id).val($("#" + this.id).attr("alt"));
			if(this.id != "city" && this.id != "flcity" && this.id != "wcity" ) $("#" + this.id).addClass("grey");
		}
		if (this.id =="where" && document.getElementById('arBox'))
		{
			$('#arlnk').show();
			if($("#" + this.id).val() != "")
			{
				$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+$("#" + this.id).val()+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
			}
			$('.detarea').removeClass('dn');
			$('#arBox').addClass('dn');
		}
		if (this.id =="city") {
			if ($("#city").val() != $("#city").attr("alt"))	{

			$.ajax({url:WEBROOT+"ajxmain.php?city="+$("#city").val()+"&cases=citycheck",async:false, success:function(result){
			if(result!="City Failed")
			{
				valcheck = 0;
				if(onloadFn != "National Search")
				{
					getData();
				}				 
			}
			else
			{
				if($("#what").hasClass("grey"))
					valcheck = 1;
				else
					valcheck = 2;
			}}});
			}
		}
		divHide('','');
		if (this.id =="city")
		{
			$('#ctlnk').show();
			$('#ctyBox').hide();
			
			var cityArr = new Array('Ahmedabad','Bangalore','Chandigarh','Chennai','Coimbatore','Delhi-NCR','Ernakulam','Goa','Hyderabad','Indore','Jaipur','Kolkata','Mumbai','Mysore','Nagpur','Nashik','Pune','Surat','Vadodara','Vizag');
										
			if($("#city").val() == 'Delhi / NCR')
				var ct = 'Delhi-NCR';
			else
				var ct = $("#city").val();
				
			var a = $.inArray(ct,cityArr); 
						
			if(onloadFn == 'latest_Reviews_Ratings')
			{	
				if(a != -1)
				{
					$(location).attr('href',WEBROOT+ct+'/Latest-Reviews-Ratings');					
				}
			}
			if(a != -1)
			{
				$('#lrr').html('|<a href="'+WEBROOT+ct+'/Latest-Reviews-Ratings">Latest Reviews</a>');
				$('#lrr').css('display','inline');
			}
			else
			{
				$('#lrr').html();
				$('#lrr').css('display','none');
			}
		}
		if (this.id =="flcity" && $('#type_flag') && $('#type_flag').val()=='8192')
		{			
			$("#fauto").hide();
		}
		if (this.id =="txtDstnPincode"){
			$("#pincodeAuto").hide();
		}
	});
	
	$('#chkrembercity').change(function(event) {
		areaCookie();
	});

	if(document.getElementById('adif'))
	{	
		if(org_onloadFn == 'Index' || org_onloadFn == 'National Search')
		{
			random_ad_film(0);
		}
		else
		{
			var pre_ad_cookie = getCookie('ad_auto');		
			(pre_ad_cookie == '') ? bigb_cookie() : '';
			var autoplay = 0;
			var ad_cookie = getCookie('ad_auto');
			if(ad_cookie > 1 || pre_ad_cookie)
			{
				autoplay = 0;
			}
			random_ad_film(autoplay);
		}
	}
	
	// Error Span default property
	//$('.orng').attr('style','display:none');	
	$('.jerr').hide();
	
	if(topreviews == 1)
	{
		//setTimeout("ratingFeed()",5000);
		//latestreviewimg();
	}
	
	// Friends Rating on Search Result AND Profile page - Logged in User
	showSearchCardFriendsRatings();
	
	// To Display Mouseover Bubble Info
	bubble();
/*
	if($.browser.version!="6.0" && $.browser.version!="7.0" && !touchy)
	{
		$('#jfdb').bPopupleft();
	}
	else if($.browser.version!="6.0")
	{
		$('#jfdb').bPopupleft({
            positionStyle: 'absolute' //'fixed' or 'absolute'
        });
	}
	*/
	if (touchy == true && top >= 265) {
			if (top <= topHeight) top = topHeight+1;
	}
	if(onloadFn == 'filter' || onloadFn == 'Result' && (document.getElementById('disp_jpg') || document.getElementById('disp_flash')))
	{
		if (typeof swfobject != "undefined")
		{
			var playerVersion = swfobject.getFlashPlayerVersion();
			if(playerVersion.release == 0 || playerVersion.release == '')
			{
				document.getElementById('disp_jpg').style.display = "block";
			}
			else if(document.getElementById('disp_flash'))
			{
				document.getElementById('disp_flash').style.display = "block";
			}
		}
		else if(document.getElementById('disp_flash'))
		{
			document.getElementById('disp_flash').style.display = "block";
		}
	}
	/*Book A Table */
        
	if((onloadFn == 'Result' || onloadFn == "detailsPage" || onloadFn == 'National Search') && onloadFn != 'filter' && tabVal != '6' && $('#type_flag').val() != '64'&& $('#type_flag').val() != '512' /*&& tabVal != ''*/) 
	{
		    jQuery(function() {
			$("#btdate").datepicker({
				dateFormat: 'dd-mm-yy', 
				showOn: "button",
				buttonImage: WEBROOT+"tools/img/calendar_icon.gif",
				buttonImageOnly: true,
				showButtonPanel: true,
				showOn: "both",
				beforeShowDay: nonWorkingDates,
				inline:true,
				minDate: 0,
				maxDate: "+6d",
				autoSize: true,
				onSelect: function( selectedDate ) {
					$('#avlblt1').html('');
					$('#avlblt2').html('');
					$('#btdate').val(selectedDate);
					var btdateval = selectedDate; 
					var btcidval = $('#btdocid').val();
					$.getJSON(WEBROOT+"functions/ajxbooktable.php", {btdocid:btcidval,btdateval:btdateval}, function(data) { 
						var timeslotoption = '';
						var bttimevalarr = data.resultsdata[0].bttimeval;
						if(bttimevalarr != '') {
							var timeArr = bttimevalarr.split('$##$');
							var bttimevalarr1 = bttimevalarr.split('#$@$#');
							var timeArr = bttimevalarr1[0].split('$##$');
							var timeArrValue = bttimevalarr1[1].split('$##$');
							timeslotoption += "<label for='' class='jlbl_s'>Time<span class='ment'>*</span>";
							timeslotoption += "</label>";
							timeslotoption += "<select class='jslct hdn' id='bttime'>";
							timeslotoption += "<option value='Select' selected='selected'>Select</option>";
							for(var j = 0; j < timeArr.length; j++)
							{
								if(timeArr[j] != '' && timeArr[j] != 'undefined')
								{
									var tmArr = timeArr[j].split('(');
									var timeAvl = timeArrValue[j].split(' ');
									/*var ctime = timeArrValue[j].split(':');
									var currentTime = new Date();
									var current_time = currentTime.getHours();
									if(ctime[0] == current_time) {
										var select_time = 'selected="selected"';
									} else {
										var select_time = 	'';
									}*/
									var select_time = 	'';
									timeslotoption += "<option value='"+timeAvl[0]+"' "+select_time+">"+tmArr[0]+"</option>";
								}
							}
							timeslotoption += "</select>";
							timeslotoption += "<span class=\"err dn\" id='battime'>Error Message</span>";
							$('#bdtimedd').html(timeslotoption);
							var btcnt = $("#bttime option").length;
							if(btcnt <= 1)
							{
								$('#btbcdate_cnan').html("<span>"+data.resultsdata[0].cname+"</span> ("+data.resultsdata[0].area+")");
								$('#bcdate').html(data.resultsdata[0].selectedDate.replace(/\-/g,"/"));
								$('#bcdateno').html(data.resultsdata[0].company_number);
								//closeDiv('bat');
								openDiv('batbcdate');
							}
						}
					});
				}
			});
		}); 
		jQuery(function() {
			$('#btdate').datepicker('setDate', 'today');	
		});
                
	}	
	
	if(onloadFn == 'searchnotfound')
	{
		if($('#where').val().substr(0,4) != 'e.g.')
		{
			$('#snfarea').val($('#where').val());
		}
		
		
		$('#snfarea').keyup(function(event) {
		
			if($('#flcity').val() != '')
			{
				if (handleKeys(event,"#snfarea","#snfname","#snfaauto")==true) {
					return false;
				}
				
				var snfct = $('#flcity').val().trim();
				
				var snfwhr = $('#snfarea').val().trim();
			//	snfwhr = snfwhr.replace(/[^A-Za-z0-9\s\.,\/\(\)]+/g,'');
				
				snfwhr = snfwhr.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
				snfwhr = snfwhr.replace(/\-/g,' ');
				snfwhr = snfwhr.replace(/\'/g,'');
				snfwhr = snfwhr.replace(/[\s+]+/g,' ');
			
				var snfwhr1 = snfwhr.substr(0,2);
				
				if(snfwhr1.match(/^[A-Za-z0-9]+$/))
				{
					JSONS("autosuggest.php",{search:  ''+snfwhr+'' ,city:  ''+ snfct +'',cases:  'where'},'#snfaauto');
				}
			}
		});
		
	}
	
	if((onloadFn == 'Index' || onloadFn == 'National Search') && document.referrer == '')
	{
		homepageview();
	}
	
	if(onloadFn == "register" && $('#verificationCode1'))
	{
		$('#verificationCode1').focus();
	}
        
        if(tab == 'bookatable'){
                var docId = $("#docid").val();

                checkBookTableOwner(docId);
               
     }
     //alert(tab);
     /*if(tab == 'photos'){
		 //alert(tab);
              openGall('phouter',docId,'chg_dtl_logo');  
     }*/
	 
	if(getCookie('vendor'))
	{
		notify_profile_switch();
	}
	if(getCookie('ln') && getCookie('attn_user') != 'logout')
	{
		friends_notify();
		getcartcount();
	}

	if(onloadFn == 'my_account') {
		if(docthstry != undefined && parseInt(docthstry) == 1) {
			checkKeyEvents();
		}
	}
});

function round_popup()
{
	if(!($.browser.msie && $.browser.version.substr(0, 1) < 9))
	{
		/*$('.jpop').corner("15px");
		$('.jpbg').corner("15px").parent().css('padding', '2px');
		$('.jcl').corner("5px");*/
		$('.ptop').corner("top 15px");
		$('.ptoprund').corner("15px");
		$('.mvhd').corner("5px");
	}
}

//new captcha function.
function submitForgotPassword(){

	$('#fpcE').html('');
	var x = $('#flid').val();
	if(x == null || x == "")
    {
		$('#fpcE').show();
		$('#fpcE').html('Email / mobile.must be filled out');
        $('#flid').focus();
        return false;
    }
	else
    {
		$('#fpcE').html('');
		$.post(WEBROOT+"functions/ajaxCaptchaValidate.php",
		{
			captcha_code:$("#captcha_code").val()
		},
		function(data) {
			if (data == "true") {
				$('.jerr').hide();
				$("#fpcE").html("");
				postForgotPassword();
				return true;
			}
			else
			{
				$('.jerr').show();
				$("#fpcE").html("The verification code was not entered correctly!");
				$('#captcha_code').val('');
				var path =WEBROOT+"securimage/securimage_show.php?" + Math.random();
				document.getElementById("divCaptchCode").innerHTML="<img id='captcha' width='100' height='25' alt='CAPTCHA Image' src='"+path+"'/>";
				return false;
			}
		});
	}
}

// Justdial Forgot Password newcaptcha function
function postForgotPassword()
{
    var html_text = ''; 
    var flid = $('#flid').val();
    var ajx_fURL = WEBROOT+"functions/forgotpasword_log.php";

	$.getJSON(ajx_fURL, {fgmob:flid, chkdnd:1}, function(result) {
		var data = result.results[0].msg;
		var redirect_to_register = '';
		if(data == "MAX_LIMIT")
		{
			html_text = 'You have reached your maximum limit of attempts for the day.Please try again later.';
		}
		else if(data == "WRONG_LOGIN")
		{
			html_text = 'No such account is registered with JustDial. Would you like to SignUp now?';
			redirect_to_register = '1';
		}
		else if(data == "SERVER_ERROR")
		{
			html_text = 'Our servers have encountered an unexpected error, please try again after sometime!!';
		}
		else if(data == "SUCCESS_MAIL")
		{
			html_text = 'We have sent the password to you on your email '+flid+'.';
		}
		else if(data == "SUCCESS_SMS")
		{
			html_text = 'We have sent the password to you on your mobile number '+flid+'.';
		}
		else if(data == "DAILY_LIMIT")
		{
			html_text = 'Forgot password daily limit reached.';
		}
		closeDiv('jfp');
		$("#smsg").html(html_text);
		$("#redirectToRegister").val(redirect_to_register);
		$('#password_reset').bPopup();					
	});
	return false;
}

function loadImg(c,u)
{
	$(c).css('background-image', 'url("'+u+'")');
}

function loadJS(src)
{
	if(!$("script[src='" + src + "']").length)
	{
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src; 
		document.getElementsByTagName("body").item(0).appendChild(script);
		return true;
	}
    return false;
}

// Popup Div
function openDiv(divname, area, source, wht, piadstatus) 
{
	if(divname.indexOf('favrmv') != -1)
	{
		var favtotal =  divname.replace('favrmv','');
		divname = 'favrmv';
		if(favtotal > 0)
		{
			removefav(1);
		}
	}
	
	
	$(".jpop").each(function(){
		if($('#' + $(this).attr('id')).is(':visible'))
		{
			if($(this).attr('id').indexOf('best_deal') != -1)
				closeDiv($(this).attr('id'));

		}
		
		
		
	});
		
	

	$('#source').val(source);
	
	if(typeof(autoValue) != 'undefined')
	{
		if(autoValue == 'National Search')
		{
			$('#nst').val(wht);
		}
	}
	
	if(divname == 'jfp')
	{
		$('#flid').val($('#em').val());		
		$('#captcha_code').val('');
		var path =WEBROOT+"securimage/securimage_show.php?" + Math.random();
		document.getElementById("divCaptchCode").innerHTML="<img id='captcha' width='100' height='25' alt='CAPTCHA Image' src='"+path+"'/>";

                if(touchy) {
                    $('#'+divname).bPopup({
                        amsl: 100,
                        follow: [false, false]
                    });
                } else {
                    $('#'+divname).bPopup();
                }
	}
	
	
	if(divname == 'batte')
	{
		$("select.hdn").css("visibility","hidden");
	}

	if(divname == 'vspec')
	{
		if(touchy)
		{
			$('#'+divname).bPopup({
				amsl: 20
			});
		}
		else
			$('#'+divname).bPopup();
	}
	

   if (divname == 'movieTrailerPop'){
	$('#'+divname).bPopup({
		escClose: true,                                          
		modalClose : true,						
		follow:[false,false],
		onClose: function() { $('#movieTrailerId').attr('src',''); }
		});	
		
		return true;
	}
	else if (divname == 'mvareaPop'){
	$('#'+divname).bPopup({
		escClose: true,                                          
		modalClose : true,						
		follow:[false,false],
		onClose: function() { 
			openDiv('movieloader');			
			var movieId = $('#aMovieId').val();
			var movieName = $('#aMovieName').val();
			var movieDate = $('#aMovieDate').val();
			getMovieURL(movieId,movieName,movieDate);
		}
		});	
		
		return true;
	}
	else if (divname == 'bookTicketSeatPop'){
	$('#'+divname).bPopup({
		escClose: true,                                          
		modalClose : true,						
		follow:[false,false],
		onClose: function() {
			if ($('#btMovieStage').val() !='summary'){
				var transReqId =$('#btMovieTransReqId').val();
				var transRefId =$('#btMovieTransRefId').val();
				var reason = 'User Cancellation';
				var stage = 'layout';
				requestcancel(transRefId,transReqId,reason,stage);
			}			
		}
		});	
		
		return true;
	}
	else if (divname == 'movieSummary'){
	$('#'+divname).bPopup({
		escClose: true,                                          
		modalClose : true,						
		follow:[false,false],
		onClose: function() {
			var transReqId =$('#btMovieTransReqId').val();
			var transRefId =$('#btMovieTransRefId').val();
			var reason = 'User Cancellation';
			var stage = 'summary';
			requestcancel(transRefId,transReqId,reason,stage);			
		}
		});	
		
		return true;
	}
	else if (divname == 'edsb'){
	$('#'+divname).bPopup({
		escClose: true,                                          
		modalClose : true,						
		onClose: function() { 	
			var rurl = window.location.href;
			if(rurl.indexOf('edtbiz') != -1)
			{
				window.location.href = baseurl;
			}
		}
		
		});	
		
		return true;
	}
	
	if(divname == 'batbcdate' || divname == 'batmlr' || divname == 'baterr' || divname == 'batapierr' || divname == 'batcfm' || divname == 'bats') 
	{
		$('.bModal').css('opacity','0.1');
	}
	
	if(source == 't' || source == 'r' || source == 'd')
	{
		smsemailsource = source;
	}
		
	if(divname == "jsbd") {
		if(area != "" && ((typeof(onloadFn) =='undefined') || onloadFn != "filter")) {
			setCookieTab('tab','location',$('#catid').val());
		}
		else
		{
			if(touchy)
			{
				$('#'+divname).bPopup({
					amsl: 150//,
					//follow: [false, false]
				});
			}
			else
				$('#'+divname).bPopup();
			
			if($('#sortbydist').val().substr(0,4)!='e.g.' )
				$('#sortbydist').focus();
				
			if((typeof($('#mvarea').val()) != 'undefined') && $('#mvarea').val().substr(0,4)!='e.g.' )
				$('#mvarea').focus();
		}		
	}
	else 
	{
                
		if(filterCat > 0 && divname == 'best_deal_div')
		{
			if($('#fil_cat_id').is(':checked'))
			{
				select_cat($('#fil_cat_id').val(),'filcat');
			}
		}
		
		if(area	 ==	"bestdeal" || divname == "best_deal_resp" || divname ==	"best_deal_dnd" || divname == "best_deal_detail_div") 
		{
			$("#bdchk").html("");
			$("#bdchkdnd").html("");			
		}
		
		if(touchy)
		{
                var tmpArr = divname.split("_");
		if(divname == 'picksubar') {
				 $('#'+divname).bPopup({
                                       onClose: function() { fillDlAr(); }
                                   }, 
                                    function() {
                                        callbk();
                                    });
				 }                     

                        if(divname == 'addon_popup' || divname == 'jcp'  || divname == 'changeaddpopup'){
                                    
					$('#'+divname).bPopup({
					follow: [false, false]
				});
                                 
                               
			}
			else if(divname == 'termsuse')
			{
				var xpos = ($(window).width()/2)-440;
				$('#termsuse').bPopup({
				position: [xpos, 20], 
				follow: [false, false]
				});
				
			}
			else if(divname == 'favrmv')
			{
				var xpos = ($(window).width()/2)-440;
				$('#favrmv').bPopup({
				positionStyle: "fixed", 
				follow: [false, false]
				});
				
			}
			
                         else if(divname == 'mrOrder')
                        {
                                var xpos = ($(window).width()/2)-200;
                                $('#'+divname).bPopup({
                                    position: [xpos, 20], 
                                    follow: [false, false]
                            });
                                $('html,body').animate({
                                scrollTop: $("#breadCrumb").offset().top-400
                            },'slow'); 
                            //alert($(window).width());

                        }
                         else if($.trim(tmpArr[0]) == "allcmntbx")
                        {
                              /*  var xpos = ($(window).width()/2)-200;
                                $('#'+divname).bPopup({
                                    position: [xpos, 20], 
                                    follow: [false, false]
                            });*/
                            $('#'+divname).bPopup({
                                  
                            });


                        }
                        else if(divname == 'fda' || divname == 'gda')
                        {
                           $('#'+divname).bPopup({
								amsl: 200,
								follow: [false, false]
						   });
                        }
                        else if(divname == 'subar')
                        {
                           $('#'+divname).bPopup({
                               onClose: function() { fillDlAr(); }
							}, 
                            function() {
                                callbk();
                            });
                        }
                        else if(divname == 'batte')
                        {
                           $('#'+divname).bPopup({
                               onClose: function() { batte(); }
                           });
                        }
                        else if(divname == 'gcysubar')
                        {
                           $('#'+divname).bPopup({
                               onClose: function() { gcyFillDlAr(); }
							}, 
                            function() {
                                gcycallbk();
                            });
                        }
                        else if(divname == 'rlogin' || divname=='verpopup')
                        {
                            $('#'+divname).bPopup({
							amsl: 200
							});
                        }
                        else if( divname == 'vercode')
                        {
                            $('#'+divname).bPopup({
							amsl: 200,
							follow: [false, false]
							});
                        }
                        else if(divname == 'dom_ivr'){
							$('#'+divname).bPopup({
							  escClose: false,
							  closeClass : 'tst',
							  modalClose : false
							});
						}
						else if(divname == 'offline_popup')
						{
							$('#'+divname).bPopup({
								opacity : 0.3
							});
						}
                        // else if(divname == 'verage')
                        // {
                            // //var xpos = ($(window).width()/2)-200; position: [xpos, 700],
                            // if($("#isreg").val() == 5 && onloadFn == "detailsPage" && tab != "menu order" ){
                                     // var xpos = ($(window).width()/2)-200; 
                                    // $('#'+divname).bPopup({
                                          // position: [xpos, 555],
                                          // escClose: false,
                                          // closeClass : 'tst',
                                          // modalClose : false,
                                          // modal : false,
                                          // follow:[false,false]
                                    // });
                               // }
                               // else
                               // {
									
										// $('#'+divname).bPopup({
									  // escClose: false,
									  // closeClass : 'tst',
									  // modalClose : false
									// });
								//}
                           

                        // }
                        else if(divname == 'mstAll')
                        {
                            
                            $('#'+divname).bPopup({
                                  amsl: -30
                                  
                            });

                        }
                        else if(divname == 'fdatcare' || divname == 'remTstPop' || divname == 'remTstEdit' || divname == 'tstnfPop' || divname == 'delTstPopup' || divname == 'lnkCnclTst' || divname == 'tstPop'){
                            $('#'+divname).bPopup();
                        }
                        else if(divname == 'ltcnPop')
                        {
                           $('#'+divname).bPopup({
							   amsl: 100,
							   follow: [false, false],
                               onClose: function() {
								  
								    targetId = ''; 
								    window.scrollTo(0,0);}
							}, 
                            function() {
                                //callbk();
                            });
                        }
                        else{
							
			    $('#'+divname).bPopup({
					amsl: 100,
					follow: [false, false]
			    });
                            /*$('#'+divname).bPopup({
                                    amsl: 150,
                                    modalClose: false,
                                    modalColor: 'none'//,
                                    //follow: [false, false]
                            });
                            $('.bModal').css('z-index','-1');*/
                        }
		}
		else 
		{
			if(divname == 'best_deal_div' || divname == 'best_deal_detail_div' || divname == 'best_deal_dnd' || divname == 'best_deal_resp_maxlimit' || divname == 'best_deal_resp' || divname == 'best_deal_resp_detail')
			{
				if(divname == 'best_deal_detail_div') {
					$('#selDocDt').val('');
					$('#selDocFlagDt').val('0');
					if(piadstatus > 0 && piadstatus != 'undefined') {
						$('#selDocDt').val(wht);
						$('#selDocFlagDt').val('1');
					}
				} else if(divname == 'best_deal_div') {
					$('#selDoc').val('');
					$('#selDocFlag').val('0');
					if(piadstatus > 0 && piadstatus != 'undefined') {
						$('#selDoc').val(wht);
						$('#selDocFlag').val('1');
					}
				}
				if($.browser.msie && $.browser.version.substr(0, 1) == 6)
				{
					$('#'+divname).bPopup({
					/*modalClose: false,
					modalColor: 'none'*/
					});
				}
				else
				{
					$('#'+divname).bPopup({
						/*modalClose: false,
						modalColor: 'none',
						positionStyle: 'fixed'*/
					});
				}
				
				if(onloadFn == "detailsPage")
				{
					$('.bModal').css('top','-85px');
				}
				//$('.bModal').css('z-index','-1');
			}
			else
			{
                                 var tmpArr = divname.split("_");
                            
				if(divname == 'addon_popup' || divname == 'jcp'){
                                    
					$('#'+divname).bPopup({
                                        follow: [false, false]
				});
                               
				}
				else if(divname == 'termsuse')
				{
					var xpos = ($(window).width()/2)-440;
					$('#termsuse').bPopup({
					position: [xpos, 20], 
					follow: [false, false]
					});
					
				}
				else if(divname == 'rsvncan')
				{
					var xpos = ($(window).width()/2)-200;
					$('#rsvncan').bPopup({
					position: [xpos, 20] 
					
					});
					
				}
				
                                else if(divname == 'mrOrder')
                                {
                                        var xpos = ($(window).width()/2)-200;
                                        $('#'+divname).bPopup({
                                            position: [xpos, 20], 
                                            follow: [false, false]
                                    });
                                        $('html,body').animate({
                                        scrollTop: $("#breadCrumb").offset().top-400
                                    },'slow'); 
                                    //alert($(window).width());
                                    
                                }
                                else if($.trim(tmpArr[0]) == "allcmntbx")
                                {
                                       /* var xpos = ($(window).width()/2)-200;
                                        $('#'+divname).bPopup({
                                            position: [xpos, 20], 
                                            follow: [false, false]
                                    });*/
                                    $('#'+divname).bPopup({
                                           
                                    });
                                       
                                    
                                }
                                else if(divname == 'subar')
                                {
                                   $('#'+divname).bPopup({
                                       onClose: function() { fillDlAr(); }
                                   }, 
                                    function() {
                                        callbk();
                                    });
                                }
                                else if(divname == 'batte')
                                {
                                   $('#'+divname).bPopup({
                                       onClose: function() { batte(); }
                                   });
                                }
                                else if(divname == 'gcysubar')
								{
								   $('#'+divname).bPopup({
									   onClose: function() { gcyFillDlAr(); }
									}, 
									function() {
										gcycallbk();
									});
								}
								else if(divname == 'dom_ivr'){
									$('#'+divname).bPopup({
									  escClose: false,
									  closeClass : 'tst',
									  modalClose : false
									});
								}
								else if(divname == 'offline_popup')
								{
									$('#'+divname).bPopup({
									opacity : 0.3
									});
								}
                                //else if(divname == 'verage')
                                // {
                                    // //var xpos = ($(window).width()/2)-200;
                                    
                                    //if($("#isreg").val() == 5 && onloadFn == "detailsPage" && tab != "menu order" ){
                                     // var xpos = ($(window).width()/2)-200; 
                                    // $('#'+divname).bPopup({
                                          // position: [xpos, 555],
                                          // escClose: false,
                                          // closeClass : 'tst',
                                          // modalClose : false,
                                          // modal : false,
                                          // follow:[false,false]
                                    // });
                                // }                                
                                // else
                                // {
									// $('#'+divname).bPopup({
                                          // escClose: false,
                                          // closeClass : 'tst',
                                          // modalClose : false
                                    // });
								// }
                                    
                                    
                                   
                                //}
                                else if(divname == 'mstAll')
                                {

                                        $('#'+divname).bPopup({
                                                  amsl: -30

                                        });

                                }
                                else if(divname == 'changeaddpopup')
                                {
                                   $('#'+divname).bPopup({
                                           escClose: false,
                                           onClose: function() {
                                           //$("#txtArea").val('');
                                           $('#txtArea').next().hide();
                                           $('#areaAuto').hide();
                                           if ($("#picksubar").is(':visible')){
                                                  closeDiv('picksubar');
                                                }
                                           }
                                        });
                                }
                                else if(divname == 'docloading') {
                                    $('#'+divname).bPopup({
                                        escClose: false,
                                        modalClose:false
                                    });
                                }
                                else if(divname == 'verCodePop') {
                                    $('#'+divname).bPopup({
                                        escClose: false,
                                        modalClose: false
                                    });
                                }
                                else if(divname == 'dealmenu')
								{
									var xpos = ($(window).width()/2) - 400;
                                        $('#'+divname).bPopup({
                                            position: [xpos, 200], 
                                            follow: [false, false]
                                    });
									
								}
								else if(divname == 'ltcnPop')
								{
								   $('#'+divname).bPopup({
									   amsl: 100,
									   follow: [false, false],
									   onClose: function() { 
										  
										  
										   targetId = '';
										   window.scrollTo(0,0); }
									}, 
									function() {
										//callbk();
									});
								}
				else{ 
					$('#'+divname).bPopup(); 
				}
			}
		}
	}

	if($('#ibse_name'))	
		$("input[id='ibse_name']:visible:first").focus();
	if($('#bd_name'))	
		$("input[id='bd_name']:visible:first").focus();
	if($('#bd_name_detail'))
		$("input[id='bd_name_detail']:visible:first").focus();		
	if($('#em'))	
		$("input[id='em']:visible:first").focus();
	if($('#flid'))	
		$("input[id='flid']:visible:first").focus();
	if($('#repoincorrcomm'))
		$('#repoincorrcomm').focus();
	if($('#iup'))
		$('#iup').hide();
	if($('#fpcE'))
		$('#fpcE').hide();
	
	if(divname=='best_deal_div')
	{
		$("#best_deal_form").hide();
	}
	if($('#bd_mobile').val() == "e.g 9867045061")
	{
		$('#bd_mobile').css('color','#BDBDBD');		
	}
	
	if(divname == 'jsms')
	{
		if($("#mn").val() == "") {
			$("#mn").val('');
		}
		$("#eierr").html('');
	}
	if(divname == 'swf')
	{
		if(!getCookie('inLogName'))
		{
		  $("#sname").val('e.g Ravi Verma');
		  $('#sname').css('color','#BDBDBD');	
		}
		if(!getCookie('inLogEmail'))
		{
			$("#smail").val('e.g. abc@xyz.com');
			$('#smail').css('color','#BDBDBD');
		}
		$("#femail").val('');
		$("#message").val('');
		$('#nerr').html('');
		$('#fmerr').html('');
		$('#smerr').html(' ');
		
	}      
	if((divname == 'rtpp' || divname == 'smssuccess' || divname == 'rtvc' || divname == 'ownrfvc' || divname == 'verpopup' || divname == 'vercode' || divname == 'labVercode' || divname == 'mob_verify' || divname == 'batvc' || divname == 'verCodePop' || divname == 'jvc' || divname == 'dcvfy' || divname == 'vercode' || divname == 'vergcycode' || divname == 'pvercode' || divname == 'slnk' || divname == 'dwlpvc' || divname == 'smssuccess1' || divname == 'best_deal_dnd' || divname == 'smsvcpart1' || divname == 'verifyMobile') && $('#'+divname+'.inptlft_s'))
	{
		setTimeout("$('#"+divname+"').find('.inptlft_s').focus();",500);
	}
        
	
	if(divname == 'favrmv')
	{
		if($('#favlst').length)
		{
			
		  if(touchy)
		  {
			$('#favlst').css({'overflow-y':'auto'})
		  }
		  else
		  {
			setSlider($('#favlst'));
		  }
		}
	}

	if(divname == 'shrEmail') {
		closeDiv('swf');
		$('#shrfemcnt').val('1');
		$('.err').html('');
	}
	if(divname == 'shrSms') {
		closeDiv('swf');
		$('#shrfsmscnt').val('1');
		$('.err').html('');
	}
        
	return false;	
}

function closeDiv(divid)
{
	if(divid == 'phouter' && $('#phouter').length && document.getElementById('phouter').style.display == "none")
	{
		return false;
	}
	if(divid == 'batte')
	{
		$("select.hdn").css("visibility","visible");
	}
	var id = '#'+divid;
	if($('#resend_msg_bat'))
	{
		$('#resend_msg_bat').html('');
	}
	$(id).bPopup().close();
	
	if(divid == 'bat')
	{
		closedDate = '';
		$('#bt_cnanval').html('');
		$('#btdocid').val('');
		$('#btdate').val('');
		$('#bttime').val('');
		$('#btmin_time_rsvn').val('');
		$('#btnoprsn').html('');
		$('#bdtimedd').html('');
		$('#avlblt1').html('');
		$('#avlblt2').html('');
	}
	if(divid == 'bats' || divid == 'batcfm')
	{
		$('#batvc').bPopup().close();
		$('#bat').bPopup().close();
		window.location.reload(true);
	}
	if(divid == 'batbcdate' || divid == 'batmlr' || divid == 'baterr' || divid == 'batapierr' || divid == 'batcfm') 
	{
		$('.bModal').css('background-color','');
	}
	if(divid == 'newuserpass')
	{
		window.location.reload(true);
	}
	if($(id).is(':visible'))
	{
		$(id).hide();
	}
	if(divid=='password_reset')
	{
		if( 1 == document.getElementById('redirectToRegister').value )
		{
			window.location.href = WEBROOT+'Register';
		}
	}
}

function ten8()
{
	loadImg('.jcuo,.jabph,.jlo,.tic', 'http://images.jdmagicbox.com/icontent/08888888888_Sprite2.jpg');
	$('#jcuo').bPopup();
}
// Jquery Mouseover Bubble Info
function bubble()
{
  $('.jbub').each(function () {
    // options
    var distance = 10;
    var time = 0;
    var hideDelay = 0;

    var hideDelayTimer = null;

    // tracker
    var beingShown = false;
    var shown = false;
    
    var trigger = $('.trigger', this);
    var popup = $('.popup', this).css('opacity', 0);

    // set the mouseover and mouseout on both element
    $([trigger.get(0), popup.get(0)]).mouseover(function () {
      // stops the hide event if we move from the trigger to the popup element
      if (hideDelayTimer) clearTimeout(hideDelayTimer);

      // don't trigger the animation again if we're being shown, or already visible
      if (beingShown || shown) {
        return;
      } else {
        beingShown = true;

        // reset position of popup box
        popup.css({
          top: 40,
          left: -75,
          display: 'block' // brings the popup back in to view
        })

        // (we're using chaining on the popup) now animate it's opacity and position
        .animate({
          top: '-=' + distance + 'px',
          opacity: 1
        }, time, 'swing', function() {
          // once the animation is complete, set the tracker variables
          beingShown = false;
          shown = true;
        });
      }
    }).mouseout(function () {
      // reset the timer if we get fired again - avoids double animations
      if (hideDelayTimer) clearTimeout(hideDelayTimer);
      
      // store the timer so that it can be cleared in the mouseover if required
      hideDelayTimer = setTimeout(function () {
        hideDelayTimer = null;
        popup.animate({
          top: '-=' + distance + 'px',
          opacity: 0
        }, time, 'swing', function () {
          // once the animate is complete, set the tracker variables
          shown = false;
          // hide the popup entirely after the effect (opacity alone doesn't do the job)
          popup.css('display', 'none');
        });
      }, hideDelay);
    });
  });
  $('.loadbubble').attr('style','display:block');
}

//Friends Rating on Search Result AND Profile page - Logged in User
function review_rating_lp(data)
{ 
	var d = eval('(' + data + ')');
	if(d.length > 0)
	{
		for(i=0;i<d.length;i++)
		{
			if($('#frnd_rate_this'+(paginationItemStartIndex+i)) && $('#frnd_rate_this'+(paginationItemStartIndex+i)).length > 0 || onloadFn == 'detailsPage' || $('#frnd_rate_thisProd').length > 0 || tab=='rating_srch')
			{
				var frhtml = '';
				
				if(d[i]['review'].length > 0 || d[i]['myratings'])
				{
					frhtml += '<span class="yrevnm">';
					if(d[i]['myratings'])
					{
						frhtml += '<span class="yrevlnk" onclick="setCookiebest(\'showpage\',\'mratings\');">';
						frhtml += '<span class="yfst">You</span>';
						frhtml += '<span class="yfstr">';
							frhtml += "<span class='ms"+d[i]['myratings']['star'][0]+"'></span>";
							frhtml += "<span class='ms"+d[i]['myratings']['star'][1]+"'></span>";
							frhtml += "<span class='ms"+d[i]['myratings']['star'][2]+"'></span>";
							frhtml += "<span class='ms"+d[i]['myratings']['star'][3]+"'></span>";
							frhtml += "<span class='ms"+d[i]['myratings']['star'][4]+"'></span>";
						frhtml += "</span>";
						frhtml += '</span>';
						
						$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr("onclick","setCookiebest(\'showpage\',\'mratings\');");
						if(onloadFn == 'detailsPage')
						{
							$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr("onclick","disprevs(\'toprvw\',\'toprevc\');goToByScrolldetail(\'tglsct\');");
						}
					}
					if(typeof(d[i]['review'][0]) != 'undefined' && d[i]['review'] != null)
					{
						frhtml += (d[i]['myratings']) ? ((d[i]['review'].length > 1) ? '<span class="coma">,</span> ' : '<span class="coma">&</span>') : ((d[i]['total'] > 2) ? '<span class="yft">Your friends</span>' : '<span class="yft">Your friend</span>');
						frhtml += '<span class="yrevlnk" onclick="setCookiebest(\'showpage\',\'fratings\');">';
						var dispfr = (d[i]['total'] > 2) ? 2 : d[i]['total'];
						for(j=0;j<dispfr;j++)
						{
							if(j == dispfr - 1 && dispfr > 1 && (d[i]['total']-dispfr) < 1)
							{
								frhtml += ' <span class="coma">& </span>';
							}
							else if(j == dispfr - 1 && dispfr > 1)
							{
								frhtml += ' <span class="coma">,</span> ';
							}
							frhtml += '<span class="yfnm">'+((d[i]['review'][j]['reviewer_name'].length > 9) ? d[i]['review'][j]['reviewer_name'].substr(0,6)+'...' : d[i]['review'][j]['reviewer_name'])+'</span>';

							frhtml += '<span class="yfstr">';
								frhtml += "<span class='ms"+d[i]['review'][j]['star'][0]+"'></span>";
								frhtml += "<span class='ms"+d[i]['review'][j]['star'][1]+"'></span>";
								frhtml += "<span class='ms"+d[i]['review'][j]['star'][2]+"'></span>";
								frhtml += "<span class='ms"+d[i]['review'][j]['star'][3]+"'></span>";
								frhtml += "<span class='ms"+d[i]['review'][j]['star'][4]+"'></span>";
							frhtml += "</span>";
						}
						frhtml += (d[i]['review'].length > 1 && (d[i]['total']-dispfr) > 0) ? '<span class="yamr">and <span class="yfcnt">'+(d[i]['total']-dispfr)+' more'+(((d[i]['total']-dispfr) > 1) ? ' friends ' : ' friend ')+'</span></span>' : '';
						frhtml += 'rated this';
					}
					frhtml += (d[i]['myratings'] && d[i]['review'].length == 0) ? '&nbsp;rated this' : '';
					frhtml += '</span>';
					$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr("onclick","setCookiebest(\'showpage\',\'fratings\');");
					if(onloadFn == 'detailsPage')
					{
						$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr("onclick","disprevs(\'toprvw\',\'toprevc\');goToByScrolldetail(\'tglsct\');");
					}
					frhtml += '</span>';
				}
				else if(tab=='rating_srch')
				{
					frhtml += '<span class="yrevnm">';
					frhtml += '<span class="yft">Your friend</span> <span  class="yrevlnk" onclick="setCookiebest(\'showpage\',\'fratings\');">';
					frhtml += '<span class="yfnm">Sonia</span> rated';
					frhtml += '<span class="yfstr"><span class="ms10"></span><span class="ms10"></span><span class="ms10"></span><span class="ms10"></span><span class="ms0"></span></span>';
					frhtml += '<span class="yamr">and <span class="yfcnt">3 more...</span></span>';
					frhtml += '</span>';
					frhtml += '</span>';
				}
				else
				{
					frhtml += '<span class="yrevnm">';
					if ($('#closedown_flag'+(paginationItemStartIndex+i)).length && $('#closedown_flag'+(paginationItemStartIndex+i)).val()>0 )
					{
						$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr('');
						frhtml += '<span class="yfst">None of your <b> Friends </b> Rated This.</span>';
					}
					else
					{
						if(onloadFn == 'detailsPage')
						{
							$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr('onclick','').unbind('click');
							$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr("onclick","_ct('ratethis','dtpg');");
							$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr('href',baseurl+'/writereview');
						}
						else if(document.getElementById('frnd_rate_this'+(paginationItemStartIndex+i)) && document.getElementById('frnd_rate_this'+(paginationItemStartIndex+i)).href.indexOf('#rvw') != -1)
						{
							$('#frnd_rate_this'+(paginationItemStartIndex+i)).attr('href',document.getElementById('frnd_rate_this'+(paginationItemStartIndex+i)).href.replace('#rvw','/writereview'));
						}
						frhtml += '<span class="bfst"></span><span class="yfst">Be first among your friends to <span class="rt">rate this</span></span>';
					}
					frhtml += '</span>';
				}
				if(frhtml != '')
				{
					$('#revnm'+(paginationItemStartIndex+i)).html(frhtml);
					if($('#frnd_rate_thisProd').html() != 'undefined' && $('#frnd_rate_this'+(paginationItemStartIndex+i)).length > 0)
						$('#frnd_rate_this'+(paginationItemStartIndex+i)).css('display','block');
				}
			}
		}
	}
}


function fProdReview(prid)
{
	if(getCookie('ln') != '' && prid != '')
	{
		$.get(WEBROOT+"/functions/product_reviews_initial.php",{prid : prid ,case1 : 'fReview' ,city : $('#city').val()}, function(data) {
			//review_rating_lp(data);
		});
	}	
}

// Get Cookie Value
function getCookie(c_name) { 
	if (document.cookie.length > 0) {
	var c_start=document.cookie.indexOf(c_name + "=");
		if(c_start!=-1) {
			c_start = c_start + c_name.length+1;
			var c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			var cvalue = myunescape(document.cookie.substring(c_start,c_end));			
			return unescape(cvalue);
		}
	}
	return "";
}
function myunescape (str)
{
	str = "" + str;
	while (true)
	{
		var i = str . indexOf ('+');
		if (i < 0)
			break;
		str = str . substring (0, i) + '%20' +
			str . substring (i + 1, str . length);
	}
	return unescape (str);
}

// Justdial Login
function jd_Login(event) {
	if (event != '13' && event.which != 13) 
		return false;
	
	var log_Email	=	$('#em').val();
	var log_Pass	=	$('#pass').val();	
	var ajx_lURL 	=	WEBROOT+'functions/login_log.php';
	
	if(log_Email == '') {
		$('#iup').show();
		return false;
	}
	
	$.getJSON(ajx_lURL, {login:log_Email,password:log_Pass}, function(data) {
		var frm = $('#form').val();
		if(data.results[0].status != 'LOGINFAILED') 
        {
            /*var lgusrnme	=	getCookie('inLogName'); 
			var lgusrmob	=	getCookie('inLogMobile');
			var lgusreml	=	getCookie('inLogEmail'); 
			var lgcl_popup	=	getCookie('caller_popup'); 
			var ajx_cURL	=	WEBROOT+'functions/get_caller_info.php';
						
			if(lgusrnme != "" && lgcl_popup == 1 && (lgusrmob != "" || lgusreml != ""))
			{		
				$.getJSON(ajx_cURL, {cmobile:lgusrmob,cemail:lgusreml}, function(result) {
					var caller_cnt = result.results[0].cnt;
					var caller_id = result.results[0].url_id;
					var login_html_cls = '';


					var login_html = '';
					
					if(caller_id != "" && caller_cnt < 15)
					{							
						login_html_cls += '<span class="jcl" style="border-radius: 5px 5px 5px 5px;" onclick="_ct(\'callercntlogincls\',\'callercntlogin\');open_caller_popup_ln(\''+frm+'\');">X</span>';	
						$('#julcls').html(login_html_cls);
						
						login_html += '<h3 align="center">You can win an <span class="orng">iPad2</span> now!</h3>';						
						login_html += '<button class="jbtn click" type="button" onclick="_ct(\'callercntloginclk\',\'callercntlogin\');open_caller_popup_ln(\''+frm+'\',\''+caller_id+'\',\''+lgusrmob+'\',\''+lgusrnme+'\',\''+lgusreml+'\');">CLICK HERE</button>';
						$('#julct').html(login_html);						
						
						$(document).keyup(function(e) {
							if (e.keyCode == 27) { open_caller_popup_ln(); }   // esc key event
						});
					}
					else
					{
						open_caller_popup_ln();
					}
					document.cookie = 'caller_popup=0;'+date+';path=/;domain='+cookieondomain;	
				});
			}*/
			if(data.results[0].isLoginDoc == 1)
			{
				if(loginred)
				{
					open_caller_popup_ln();
				}
				else
				{
					var now = new Date();
					var time = now.getTime();
					time += 3600 * 1000;
					now.setTime(time);
					currentPageUrl = document.location.toString();
					document.cookie = 
							'bkurl=' + escape($.trim(currentPageUrl)) + 
							'; expires=' + now.toGMTString() + 
							'; path=/' +
							'; domain='+cookieondomain;
					document.cookie="pwd_popup=open;path=/;domain=" + cookieondomain;  //check
					window.location.href = WEBROOT+'doctors-vendor/Todays-Appointment';
				}
			}
			else
			{
				
				open_caller_popup_ln(log_Email,log_Pass);
			}
        } 
        else
        {
		    //$('.jerr').show();
		    $('#iup').show();
		}
	});
}



function jd_RLogin(event) {
	if (event != '13' && event.which != 13) 
		return false;
	
	var log_Email	=	$('#reml').val();
	var log_Pass	=	$('#rpass').val();	
	var ajx_lURL 	=	WEBROOT+'functions/login_log.php';
	
	if(log_Email == '') {
		$('.jerr').show();
		return false;
	}
	
	$.getJSON(ajx_lURL, {login:log_Email,password:log_Pass}, function(data) {
		var frm = $('#form1').val();
		if(data.results[0].status != 'LOGINFAILED') 
        {
            var lgusrnme	=	getCookie('inLogName'); 
			var lgusrmob	=	getCookie('inLogMobile');
			var lgusreml	=	getCookie('inLogEmail'); 
			var lgcl_popup	=	getCookie('caller_popup'); 

			var nxlnk = data.results[0].docNxtLnk;
			var bkdid = data.results[0].bkDocId;

			if((getCookie('nxtlnk') == '' || getCookie('nxtlnk') == null || getCookie('nxtlnk') == undefined) && (nxlnk != '' && nxlnk != null && nxlnk != undefined && nxlnk != 'null'))
				setPatientCookie('nxtlnk', nxlnk);

			if((getCookie('doctid') == '' || getCookie('doctid') == null || getCookie('doctid') == undefined) && (bkdid != '' && bkdid != null && bkdid != undefined && bkdid != 'null'))
				setPatientCookie('doctid', bkdid);

			var ajx_cURL	=	WEBROOT+'functions/get_caller_info.php';
						
			if(lgusrnme != "" && (lgusrmob != "" || lgusreml != ""))
			{		
				$.getJSON(ajx_cURL, {cmobile:lgusrmob,cemail:lgusreml}, function(result) {
					var caller_cnt = result.results[0].cnt;
					var caller_id = result.results[0].url_id;
					var login_html_cls = '';
					var login_html = '';
					
					if(caller_id != "" && caller_cnt < 15)
					{
						$.ajax({
							url:WEBROOT+"functions/ajxblacklisted.php",
							dataType:"json", 
							type: "post",
							data :{
								mob:$.trim(lgusrmob)
							}, 
							success:function(result){
								if(result == "true")
								{
									if($('#blacklist').length)
										openDiv('blacklist');
									else
										window.location.reload(true);
								}
								else
								{
									if((onloadFn == "detailsPage" || onloadFn == "menuPage") && tabVal == '1')
									{
										window.location.href = baseurl+'/checkoutorder?t=2';
									}
									else if(onloadFn == "detailsPage" && tab == 'grocerycheckout' && (tabGroceryVal == '2' || tabGroceryVal == '1'))
									{
										window.location.href = baseurl+'/grocerycheckout?dept=1&city='+GCYCITY;
									}
									else if(onloadFn == "detailsPage" && tab == 'pharmacycheckout' && (tabGroceryVal == '2' || tabGroceryVal == '1'))
									{
										window.location.href = baseurl+'/pharmacycheckout?dept=2&city='+GCYCITY;
									}
									else if(onloadFn == "detailsPage" && tab == 'liquorcheckout' && (tabGroceryVal == '2' || tabGroceryVal == '1'))
									{
										window.location.href = baseurl+'/liquorcheckout?dept=2&city='+GCYCITY;
									}
									else
									{
										 window.location.reload(true);
									}
								}
							}
						});
					                   
						//window.location.href = baseurl+'/checkoutorder?t=2';
					}
					
					document.cookie = 'caller_popup=0;'+date+';path=/;domain='+cookieondomain;	
				});
			} 			
        }
        else
        {
		    $('.jerr').show();
		}
	});
}
function jd_RLoginPg(event) {	
	if (event != '13' && event.which != 13) 
		return false;
	
	var log_Email	=	$('#reml2').val();
	var log_Pass	=	$('#rpass2').val();	
	
	
	var ajx_lURL 	=	WEBROOT+'functions/login_log.php';
	
	if(log_Email == '') {
		$('.addjerr').show();
		return false;
	}
	
	$.getJSON(ajx_lURL, {login:log_Email,password:log_Pass}, function(data) {
		var frm = $('#form2').val();
		if(data.results[0].status != 'LOGINFAILED') 
        {
            var lgusrnme	=	getCookie('inLogName'); 
			var lgusrmob	=	getCookie('inLogMobile');
			var lgusreml	=	getCookie('inLogEmail'); 
			var lgcl_popup	=	getCookie('caller_popup'); 
			var ajx_cURL	=	WEBROOT+'functions/get_caller_info.php';
						
			if(lgusrnme != "" && (lgusrmob != "" || lgusreml != ""))
			{		
				$.getJSON(ajx_cURL, {cmobile:lgusrmob,cemail:lgusreml}, function(result) {
					var caller_cnt = result.results[0].cnt;
					var caller_id = result.results[0].url_id;
					var login_html_cls = '';
					var login_html = '';
					
					if(caller_id != "" && caller_cnt < 15)
					{	
						$.ajax({
							url:WEBROOT+"functions/ajxblacklisted.php",
							dataType:"json", 
							type: "post",
							data :{
								mob:$.trim(lgusrmob)
							}, 
							success:function(result){
								if(result == "true")
								{
									openDiv('blacklist');
								}
								else if (onloadFn && onloadFn == "movie"){									
									window.location.reload(true);
								}
								else if(vertical == 'shopfront')
								{
									window.location.href = baseurl;
								}
								else if(onloadFn == "detailsPage" && tab == 'grocerycheckout' && tabGroceryVal != '')
								{
									window.location.href = baseurl+'/grocerycheckout?dept=1&city='+GCYCITY;
								}
								else if(onloadFn == "detailsPage" && tab == 'pharmacycheckout' && tabGroceryVal != '')
								{
									window.location.href = baseurl+'/pharmacycheckout?dept=2&city='+GCYCITY;
								}
								else if(onloadFn == "detailsPage" && tab == 'liquorcheckout' && tabGroceryVal != '')
								{
									window.location.href = baseurl+'/liquorcheckout?dept=2&city='+GCYCITY;
								}
								else if(tabVal == 'tcareaddress')
								{
									window.location.href = baseurl+'/tcareaddress';
								}
								else if(tabVal == 'booklab address'){
									window.location.href = baseurl+'/booklab-address';
								}
								else if($('#typeflag').val()=='536870912' && $('#gettype').val()=='banq_login')
								{ 
									$('#frmBanquetLoginpop').submit();
								}
								else
								{
									window.location.href = baseurl+'/checkoutorder?t=2';
								}
							}
						});	
					}
					
					document.cookie = 'caller_popup=0;'+date+';path=/;domain='+cookieondomain;	
				});
			} 			
        } 
        else
        {
		    $('.addjerr').show();
		}
	});
}

function setRedirect(sh)
{
	loginred = sh;
}

// Redirect Justdial Logged in Users
function open_caller_popup_ln(frm,callerid,lgusrmobnum,lgusrname,lgusremail)
{	
	/*var curl = '';
	if(callerid != '' && callerid != null && callerid != "undefined")
	{
		if(lgusrmobnum != "")
			curl = WEBROOT+'cr-'+callerid;
		else
			curl = 'http://contest.justdial.com/contest/register.php?cases=next&ConName='+lgusrname+'&ConEmail='+lgusremail;
		
		window.open(curl,'_blank');
	}*/
	
    if((frm=="7718826920" || frm=="9892486991") && callerid =="justdial")
    {
		
		date = new Date();
		date.setYear(date.getFullYear() + 1);
      document.cookie = 'vendor=1;'+date+';path=/;domain='+cookieondomain;	
     // alert(frm);
        $(location).attr('href',WEBROOT+"Account/");
    }
    
	
	if(onloadFn == "Index" || onloadFn == "National Search" || onloadFn == "register") 
	{
		
		$(location).attr('href',WEBROOT+"Account");
	}
	else if (onloadFn == "tgregister")
	{
		
		$(location).attr('href',window.location.href);
	}   
	else if($('#typeflag').val()=='536870912' && $('#gettype').val()=='banq_login')
	{ 
		
		$('#frmBanquetLoginpop').submit();
	}
	else 
	{
		
		location.reload(true);
	}	
}

function valid_forgotpass(vertical,order_id)
{
	$.post(WEBROOT+"functions/ajaxvalidate.php",
	{
	   recaptcha_challenge_field:$("#recaptcha_challenge_field").val(),
	   recaptcha_response_field:$("#recaptcha_response_field").val()
	},
	function(data) {
		if (data == "true") {
			
			if(vertical=='shopfront')
			{
				confirmCod(order_id);
			}
			else
			{
				$('.jerr').hide();
				$("#fpcE").html("");
				postForgotPassword(13);
				return true;
			}	
		}
		else
		{
			$('.jerr').show();
			$("#fpcE").html("The verification code was not entered correctly!");
			Recaptcha.reload();
			return false;
		}
	});
}

function DNDcheck(id,emid)
{
	var mn =$("#"+id).val();

	var em = '';
	if(typeof emid != 'undefined')
	{
		em = $("#"+emid).val();
	}
	
	if(mn.search('e.g') == 0)
		mn = '';
	if(em.search('e.g.') == 0)
		em = '';
		
	var mcase ="";
	if($('#jcuo').is(':visible') == true )
	{
		mcase = 'TEN8';
		if(mn == '')
		{
			
			$("#eierr").show();
			$("#mn").focus();
			return false;
		}
	}
	else if($('#anphone').is(':visible') == true )
	{
		mcase = 'JDANDROID';
	}

	if(!validateMobile(mn))
	{
		$("#eierr").html('Please Enter Valid Mobile number');
		$("#eierr").show();
		$("#mn").focus();
		return false;
	}
	
	$.post(WEBROOT+"functions/checkDND.php", {mobile:mn,mcase:mcase,email:em}, function(data) {
		if(data == 1)
		{
			openDiv('jvc');
		}
		else if(data == 11)
		{
			var mstr = 'SMS has been successfully sent to Mobile No.';
			var estr = 'Email has been successfully sent.';
			var mestr = 'SMS / Email has been successfully sent.'
			
			if(mn == '')
				$("#smstext").html(estr);
			else if(em == '')
				$("#smstext").html(mstr);
			else 
				$("#smstext").html(mestr);
				
			$("#jvfmob").html(mn);
			openDiv('jvf');		  
			setTimeout("location.reload(true);",2000);  				
		}
		else if(data == 2)
		{
			alert("Couldnt send verification code.Please try after some time.");
		}
		else if(data == 3)
		{
			alert("maximum limit exceeded");
		}
		else if(data == 10)
		{
			alert('maximum limit reached for the day');
		}
		
		
	});

}

function sendSMS()
{
	var mcase = '';
	
	var vcodelft = $("#vcodelft1").val();
	var vcodert = $("#vcodert1").val();
	var code = vcodelft +'-'+ vcodert;
	
	if($('#jcuo').is(':visible') == true )
	{
		mcase = 'TEN8';
		var mn =$("#mn").val();
		var em = '';
	}
	else if($('#anphone').is(':visible') == true )
	{
		mcase = 'JDANDROID';
		var mn = $("#anphone").val();
		var em = $("#anmail").val();
	}
	
	if(mn.search('e.g') == 0)
		mn = '';
	if(em.search('e.g.') == 0)
		em = '';
	
	$.post(WEBROOT+"functions/checkDND.php", {mobile:mn,vcode:code,mcase:mcase,email:em}, function(data) {
		if(data == 1)
		{
			var mstr = 'SMS has been successfully sent to Mobile No.';
			var estr = 'Email has been successfully sent.';
			var mestr = 'SMS / Email has been successfully sent.'
			
			if(mn == '')
				$("#smstext").html(estr);
			else if(em == '')
				$("#smstext").html(mstr);
			else 
				$("#smstext").html(mestr);
			
			$("#jvfmob").html(mn);
			openDiv('jvf');
			setTimeout("location.reload(true);",2000);  		
		}
		else if(data == 2)
		{
			alert("verification code not matched");
			$('#vcodelft1').val('');
			$('#vcodert1').val('');
			$('#vcodelft1').focus();
		}					
	});
}    

function fn_loginStart(logname) {	
	openDiv('jul');
	$('#form').val(logname);
	$("#em").focus();
}
function submitAdvancedSearch(evt){
    if (evt)
    {
        if(evt.which != 13) return false;
    }
	
	if(validateForm("advphone","")==false && validateForm("advpers","")==false && validateForm("advcomp","")==false) {
		alert("Please enter company name or person's name or phone number for search");
		return false;
	}
	
	if($("#advcomp").val() != "") {
		var advcomplength = $("#advcomp").val().length;
		if(advcomplength <= 1)
		{
			$("#advcompErr").show();
            $("#advcompErr").html('Invalid Company Name');
            $("#advcomp").focus();
            return false;
		}
		else
		{
			$("#advcompErr").hide();
			$("#advpersErr").hide();
			$("#advphoneErr").hide();
			$("#frmadvsrch").submit();
			return true;
		}
   }
   
   if($("#advpers").val() != "") {
        $("#advcompErr").addClass("dn");$("#advphoneErr").addClass("dn");

		var advperslength = $("#advpers").val().length;
		if(advperslength <= 1)
		{
			$("#advpersErr").show();
            $("#advpersErr").html('Invalid Person Name');
            $("#advpers").focus();
            return false;
		}
        
        if(isValid($("#advpers").val(),"name"))
        {
            $("#advcompErr").hide();
			$("#advpersErr").hide();
			$("#advphoneErr").hide();
            $("#frmadvsrch").submit();
            return true;
        }
        else
        {
            $("#advpersErr").show();
            $("#advpersErr").html('Invalid Person Name');
            $("#advpers").focus();
            return false;
        }
   }

   if($("#advphone").val() != "") {
        $("#advcompErr").innerHTML = ""; $("#advpersErr").innerHTML = "";
        
        var advphonelength = $("#advphone").val().length;
        if(advphonelength <= 1)
		{
			$("#advphoneErr").show();
            $("#advphoneErr").html('Invalid Phone Number');
            $("#advphone").focus();
            return false;
		}
        
        if(isValid($("#advphone").val(),"numeric"))
        {
            $("#advcompErr").hide();
			$("#advpersErr").hide();
			$("#advphoneErr").hide();
            $("#frmadvsrch").submit();
            return true;
        }
        else
        {
			$("#advphoneErr").show();
            $("#advphoneErr").html('Invalid Phone Number');
            $("#advphone").focus();
            return false;
        }
   }
	   
   return false;
}
function validateForm(id,msg)
{
	var x=trim($('#'+id).val());
    if (x==null || x=="")
    {
          $("#"+id+"Err").html(msg);
          $("#"+id+"Err").show();
          
		  if(id == 'fpnewpw')
			$("#"+id).val('');
		  
		  $("#"+id).focus();
          return false;
    }
    $("#"+id+"Err").html('');
    return true;
}

function validateName(id,msg)
{
    var x=ed(id).value;
	if(!isNaN(x))
    {
         ed(id+"Err").innerHTML = msg;
         $("#"+id+"Err").show();
         ed(id).focus();
         return false;
    }	
	if(!isValid(x, 'name'))
	{
		ed(id+"Err").innerHTML = msg;
		$("#"+id+"Err").show();
		ed(id).focus();
		return false; 
	}
	$("#"+id+"Err").hide();
    ed(id+"Err").innerHTML = "";
    return true;
}

function isValid(value, type)
{
 	var str = $.trim(value);
 	switch(type) 
 	{
		case 'name':
		return/^[a-zA-Z]+([.]{0,1}[']{0,1}[ ]{0,1}[a-zA-Z]+)*$/.test(str);
		case 'alpha':
   		return /^[A-Za-z]*$/.test(str);
  		case 'numeric':
   		return /^[0-9]*$/.test(str);
  		case 'email':
   		return /^(([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,7}){0,1}$/.test(str);
 	}
}
function feedbackRes() 
{
	var alphaExp = /^[A-Za-z\s]+$/;
	var fbnamid 	= $("#fbnamid").val();
	var fbmobileid 	= $("#fbmobile").val();
	var email_id = $('#fbemail').val();
	//var emailExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{0,4}$/;
	var emailExp = /^(([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,7}){0,1}$/;
	var mobExp = /^[7,8,9]{1}[0-9]{9}$/;
	var fbcomment = $("#fbcomment").val();
	var fbcity = 'Mumbai';

	if($("#ctlnk").is(':visible'))
	{
		fbcity = $("#ctlnk").html();
	}
	else
	{
		fbcity = getCookie('inweb_city');
	}

	if(fbnamid == "") {
		$("#err_fbnamid").html("Name is compulsary");
		$("#err_fbnamid").css('color','#FF0000');
		$("#fbnamid").focus();
		$("#fbnamid").val("");
		$("#err_fbnamid").show();
		return false;
	}
	if(!isNaN(fbnamid)) {
        $("#err_fbnamid").html("Please enter a valid name");
		$("#err_fbnamid").css('color','#FF0000');
		$("#fbnamid").focus();
		$("#fbnamid").val("");
		$('#err_fbnamid').show();
		return false; 
    }
	if(!fbnamid.match(alphaExp)) {
		$("#err_fbnamid").html("Please enter a valid name");
		$("#err_fbnamid").css('color','#FF0000');
		$("#fbnamid").focus();
		$("#fbnamid").val("");
		$('#err_fbnamid').show();
		return false;
	}
	if(fbnamid != "") {
		$("#err_fbnamid").html("");
		$('#err_fbnamid').hide();
	}
       /* if(fbmobileid==""){
          $("#err_fbmobile").html("Mobile number is compulsary");
		$("#err_fbmobile").css('color','#FF0000');
		$("#err_fbmobile").focus();
		$("#err_fbmobile").val("");
		$('#err_fbmobile').show();
		return false;
            
        }*/
        if((fbmobileid != '' && fbmobileid.match(mobExp) == null) || fbmobileid==9867045061) {
		$("#err_fbmobile").html("Please enter a valid mobile");
		$("#err_fbmobile").css('color','#FF0000');
		$("#fbmobile").focus();
		$("#fbmobile").val("");
		$('#err_fbmobile').show();
		return false;
	}
	else {
		$("#err_fbmobile").html("");		
		$("#err_fbmobile").hide();		
	}
//	if(email_id == "") {
//		$("#err_fbemail").html("Email id is compulsary");
//		$("#err_fbemail").css('color','#FF0000');
//		$("#fbemail").focus();
//		$("#fbemail").val("");
//		$('#err_fbemail').show();
//		return false;
//	}
    if(!emailExp.test(email_id) && email_id!="") {
        $("#err_fbemail").html("Please enter a valid email id.");
		$("#err_fbemail").css('color','#FF0000');
		$("#fbemail").focus();
		$("#fbemail").val("");
		$('#err_fbemail').show();
		return false;
    }
	if(email_id != "") {
		$("#err_fbemail").html("");
		$('#err_fbemail').hide();
	}		
	if(fbcomment == "") {
		$("#err_fbcomment").html("Comment is compulsary");
		$("#err_fbcomment").css('color','#FF0000');
		$("#fbcomment").focus();
		$("#fbcomment").val("");
		$('#err_fbcomment').show();
		return false;
	}
	else {
		$("#err_fbcomment").html("");
		$("#err_fbcomment").hide();
	}
  	$("#fdbkthank").hide();
	$("#fdbkform").show();
	$.get(WEBROOT+"functions/ajxfeedback.php", {"name":$("#fbnamid").val(),"emailid":$("#fbemail").val(),"likesite":$("#fbradionew:checked").val(),"comments":$("#fbcomment").val(),"mobile":$("#fbmobile").val(),"city":fbcity}, function(data) {          
		  var lgnme = getCookie_homepage('inLogName');
		  var lgmob = getCookie_homepage('inLogMobile');
		  var lgeml = getCookie_homepage('inLogEmail');
		  (lgnme != "") ? $("#fbnamid").val(lgnme)  : $("#fbnamid").val("");
		  (lgeml != "") ? $("#fbemail").val(lgeml)	: $("#fbemail").val("");
		  (lgmob != "") ? $("#fbmobile").val(lgmob) : $("#fbmobile").val("");
		  $("#fbcomment").val("");
		  $("#fdbkform").hide();
		  $("#fdbkthank").show();
		  openDiv('mies1');
		  setTimeout("feedbackclose()",3000);
	});
}

function feedbackclose() {
    if($("#fdbkthank").is(":visible")==true) {
        closeDiv('mies1');
        setTimeout('feedbackreset()',1000);
    }
}
function feedbackreset() {
	if (onloadFn == "Index")
		_ct("lnkfeedback","hmpg");
	else if (onloadFn == "Search")
		_ct("lnkfeedback","lspg");
	else if (onloadFn == "detailsPage")
		_ct("lnkfeedback","dtpg");
	else
		_ct("lnkfeedback","other");
	
    $("#fdbkthank").hide();
    $("#fdbkform").show();
}

function cleardiv(div_id) {
	$("#err_"+div_id).html("");
}

function review_rating_page(city_name)
{
	var myVar = new Array("0","0","0","1","0","0","0","1","0","0","0","1","0","0","0","1","0","0","0","1");
	
	var cityArr = new Array("Ahmedabad","Bangalore","Chennai","Hyderabad","Delhi / Ncr","Kolkata","Mumbai","Pune","Thane","Navi Mumbai","Ghaziabad","Noida","Gurgaon","Faridabad","Secunderabad","Bengaluru","Madras","Calcutta","Agra","Alappuzha","Allahabad","Amritsar","Bhavnagar","Bhopal","Bhubaneshwar","Chandigarh","Coimbatore","Cuttack","Dharwad","Ernakulam","Goa","Hubli","Indore","Jaipur","Jalandhar","Jamnagar","Jamshedpur","Jodhpur","Kanpur","Kolhapur","Kozhikode","Lucknow","Ludhiana","Madurai","Mangalore","Mysore","Nagpur","Nashik","Patna","Pondicherry","Rajkot","Ranchi","Salem","Shimla","Surat","Thiruvananthapuram","Tirunelveli","Trichy","Udupi","Vadodara","Varanasi","Vijayawada","Vizag");
	
	//var a = cityArr.indexOf(city_name); 
	var a = $.inArray(city_name,cityArr); 
	
	var randomNumber = Math.floor((Math.random()*19)+1);
	
	if(myVar[randomNumber] == 0)
	{
		var rurl = WEBROOT+"comp_detail.php";
	}
	else if(a != -1 && myVar[randomNumber] == 1)
	{
		var rurl = WEBROOT+"result.php";
	}
	else
	{
		var rurl = WEBROOT+"comp_detail.php";
	}
	
	if(window.event) {//IE 6
		window.event.returnValue = false;
        window.location = rurl;
        return false;
    }else {//firefox
        window.location = rurl;
    }
}

function css_browser_selector(u) {	
    var ua = u.toLowerCase(),
        is = function (t) {
            return ua.indexOf(t) > -1
        }, g = 'gecko',
        w = 'webkit',
        s = 'safari',
        o = 'opera',
		ol = 'operal',
        m = 'mobile',
        h = document.documentElement,
        b = [(!(/opera|webtv/i.test(ua)) && /msie\s(\d)/.test(ua)) ? ('ie ie' + RegExp.$1) : is('firefox/2') ? g + ' ff2' : is('firefox/3.5') ? g + ' ff3 ff3_5' : is('firefox/3.6') ? g + ' ff3 ff3_6' : is('firefox/3') ? g + ' ff3' : is('gecko/') ? g : is('opera') ? (/version\/(\d+)/.test(ua) ? ((RegExp.$1 > 10) ? o : ol) + ' ' + o + RegExp.$1 : (/opera(\s|\/)(\d+)/.test(ua) ? ((RegExp.$2 > 10) ? o : ol) + ' ' + o + RegExp.$2 : '')) : is('konqueror') ? 'konqueror' : is('blackberry') ? m + ' blackberry' : is('android') ? m + ' android' : is('chrome') ? w + ' chrome' : is('iron') ? w + ' iron' : is('applewebkit/') ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.$1 : '') : is('mozilla/') ? g : '', is('j2me') ? m + ' j2me' : is('iphone') ? m + ' iphone' : is('ipod') ? m + ' ipod' : is('ipad') ? m + ' ipad' : is('mac') ? 'mac' : is('darwin') ? 'mac' : is('webtv') ? 'webtv' : is('win') ? 'win' + (is('windows nt 6.0') ? ' vista' : '') : is('freebsd') ? 'freebsd' : (is('x11') || is('linux')) ? 'linux' : '', 'js'];
    c = b.join(' ');
	
    h.className += ' ' + c;
    return c;
};
css_browser_selector(navigator.userAgent);

function ajxphnesms(id)
{
	var closeurl = "";
	if ($("#wcity").val() == "")
	{
		alert("Please Select Valid City");
		$("#wcity").focus();
		return false;
	}

	var hidcases = "";
	if ($("#hidcases").length != 0)
	{
		hidcases = "&hidcases="+$("#hidcases").val();
	}
	
	$.ajax({url:WEBROOT+"ajxmain.php?city="+$("#wcity").val()+"&cases=citycheck", success:function(result){
		if(result=="City Failed")
		{
			$("#wcity").focus();
			alert("Please Select Valid City");
			$("#wcity").focus();
			return false;
		}
		else
		{
			if (id == "1")
			{
				$.ajax({url:WEBROOT+"functions/ajx88888send_sms.php?city="+$("#wcity").val()+"&type=2&mobile="+$("#mobile").val()+"&vc="+$("#vcodelft1").val()+$("#vcodert1").val()+"&number="+$("#hidNumber").val()+hidcases,async:false, success:function(result){
					if (result == "1")
					{
						$('#smstext').html('SMS has been successfully sent to Mobile No.');
						$('#jvfmob').html($('#mobile').val());
						openDiv("jvf");
						$('#jvc button').attr('onclick','').unbind('click');
						$('#jvc button').click(function() { sendSMS('vcode');});
					}
					else if (result == "5")
					{
						alert("Please enter correct verification code.");
						return false;
					}
				}});

			}
			else
			{
				if($("#mobile").val() == "")
				{
					alert("Please Enter Mobile number");
					$("#mobile").focus();
					return false;
				}
				if(isNaN($("#mobile").val()))
				{
					alert("Please Enter Valid Mobile number");
					$("#mobile").focus();
					return false;
				}
				if($("#mobile").val().length != 10)
				{
					alert("Please Enter Valid 10 Digit Mobile number");
					$("#mobile").focus();
					return false;
				}
				$fchar = $("#mobile").val().charAt(0);	
				if($fchar != 7 && $fchar != 8 && $fchar != 9)
				{
					alert("Please Enter Valid 10 Digit Mobile number");
					$("#mobile").focus();
					return false;
				}
				var alphaExp = /^[0-9]+$/;
				if(!$("#mobile").val().match(alphaExp))
				{
					alert("Please Enter Valid Mobile number");
					$("#mobile").focus();
					return false;
				}
				

				$.ajax({url:WEBROOT+"functions/ajx88888send_sms.php?city="+$("#wcity").val()+"&type=1&mobile="+$("#mobile").val()+"&number="+$("#hidNumber").val()+hidcases, success:function(result){
					if (result=="1")
					{
						$('#smstext').html('SMS has been successfully sent to Mobile No.');
						$('#jvfmob').html($('#mobile').val());
						openDiv("jvf");
					}
					else
					{
						openDiv("jvc");
						$('#jvc button').attr('onclick','').unbind('click');
						$('#jvc button').click(function() { ajxphnesms('1');});
					}

				}});
			}
		}

	}});
}

function trackEvent(category,action,label)
{
	var live = liveCheck();
	
	if(live)
	{
		ga('b._trackEvent', category, action, label);
	}
}

function trackPageview(url)
{
	var live = liveCheck();

	if(live)
	{
		ga('b._trackPageview', url);
	}
}

function loginUser(name,mobile,email,smssucess)
{
	loginId = getCookie('inLogID');
	if(!loginId){
		if(smssucess == 1){
			$.post(WEBROOT+"functions/ajxuserlogin.php", {name:name,mobile:mobile,email:email}, function(data) {
				if(data == 1){
					str = location.href;
					loc1 = str.substr(-2);
					if(loc1 == '/1'){
					  Nhref = str.replace(str.substr(-2),'');
					  window.location = Nhref;
					}
					else{
						setTimeout("location.reload(true)",500);
					}
				}
				else if(data == 2){
					if(!$("#newuserpass").is(':visible')) {
						closeDiv('smssuccess');
						$("#Nname").val(name);
						$("#Nphn").val(mobile);
						$("#Nemail").val(email);
						openDiv('newuserpass');
					} else { 
						return true;
					}
				}else if(data == 3){
					return false;
				} 
			});
		}
	}
	else if(smssucess == 1)
	{
		pageReload();
	}
}

function signup_user()
{
	name = $("#Nname").val();
	mobile = $("#Nphn").val()
	email = $("#Nemail").val();
	pswd1 = $("#Npass").val();
	pswd = $.trim(pswd1)
	
	if(pswd == ""){
		$("#autopswd").show();
	} else { 
		$.post(WEBROOT+"functions/ajxsignup.php", {name:name,mobile:mobile,email:email,pswd:pswd}, function(data) {
			if(data == 1){
				str = location.href;
				loc1 = str.substr(-2);
				if(loc1 == '/1'){
				  Nhref = str.replace(str.substr(-2),'');
				  window.location = Nhref;
				}
				else{
					location.reload(true);
				}
			}
		});
	}
}

// Validate Email
function validateEmail_val(x)
{
    if(x != "")
    {
		var atpos=x.indexOf("@");
		var dotpos=x.lastIndexOf(".");
		if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
		  {
		  return false;
		  }
		return true;
     }
	else
	{
		return false;
	}
}

function validateEmail(id,msg)
{
    var x=ed(id).value;
    if(x != "")
    {
		var atpos=x.indexOf("@");
		var dotpos=x.lastIndexOf(".");
		if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
		  {
		  $("#"+id+"Err").show();
		  ed(id+"Err").innerHTML = msg;
		  ed(id).focus();
		  return false;
		  }
		ed(id+"Err").innerHTML = "";
		return true;
	}
	else
	{
		return true;
	}
}

function getXMLHTTPReqObj(){
	if (typeof XMLHttpRequest != 'undefined'){
		return new XMLHttpRequest();
	}
	try{
		return new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e){
		try{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e) {}
	}
	return false;
}

function ed(id){return document.getElementById(id);}
function es(id){return document.getElementById(id).style;}

/* Autosuggest JS */

var date = new Date();
date.setTime(date.getTime()+(30*24*60*60*1000));
var validcity = 0;
var whatid,JSONObject = null;var citydiv="#cauto";var cachearr = new Array();var url = location.href;
var casesCity  = 'city'
var casesWhat  = 'what'
var casesWhere = 'where'
var casesArea = 'areaMenu'
var casesArea = 'chkoutArea'
var casesStdcode = 'stdcode'
var casesPincode  = 'pincode';
var casesArea = 'areaGrocery'
var casesArea = 'chkoutGroceryArea'
if(url.indexOf('jdsoftware.com') >= 0) {
	var cookieondomain = '.jdsoftware.com';
}
else if(url.indexOf('blrsoftware.com') >= 0) {
	var cookieondomain = '.blrsoftware.com';
}
else {
	var cookieondomain = '.justdial.com';
}
String.prototype.autovalue = function(id){
    if (onloadFn == "contest" && this=="what")
    {
       return 'whatcontest';
    }
	else if (onloadFn == "customercare" && this=="what")
    {//harshada
		return 'customercare';
    }//harshada
	else if (id == "#what" && onloadFn == "contest")
	{
		if (this.trim()=="")
			return  " ";
		else
			return String(this.replace(/\'/gi,"")+"!ct!0!ct!"+$("#gender").val());	
		
	}
	return String(this.replace(/\'/gi,""));
 };

Autosuggest = function() {
	$('#city,#ctlnk').click(function(event){		
		if(this.id == 'ctlnk')
		{
			$('#ctyBox').show();
			$('#ctlnk').hide();
			$('#city').focus();
		}
		citydiv = get_city_cont(this.id);
		if($('#'+this.id).val() == '')
		{
			JSONS("autosuggest.php",{cases: 'popCity',search: '@A@'+'',scity:getCookie('scity') },citydiv);
			setTimeout("_ct('cityauto','hmpg')",1000);
		}
		else 
		{
			JSONS("autosuggest.php",{cases: casesCity.autovalue(),search: '@A@'+'',scity:getCookie('scity') },citydiv);
			setTimeout("_ct('cityauto','hmpg')",1000);
		}
	});
	$('#arlnk').click(function(event){		
		if(this.id == 'arlnk')
		{
			$('#arBox').show();
			$('#arlnk').hide();
			$('#where').focus();
		}
	});
	
	$("#txtDstnPincode").click(function(event){	
			
		if($("#flMaincity").val()!=""){		
			JSONS("ajxmain.php",{cases: casesPincode.autovalue(),search: $(this).val().trim()+'',city:$("#flMaincity").val() },"#pincodeAuto");
		}
	});

	$('#areaMenu').click(function(event){		
		JSONS("ajxmain.php",{cases:  'dlarea',search: '',type:'' ,active:1,city:  ''+ $('#city').val()+'',docId:$("#docid").val(),domId:$('#domId').val()},'#area_Suggest_popup');
	});
     $('#areaGrocery').click(function(event){
		$("#gcyareaid").val('')	; 		
		JSONS("ajxmain.php",{cases:  'dlgroceryarea',limit:20,search: '',type:'all' ,city:  ''+ $('#city').val()+'',docId:$("#gcydocid").val(),bid:bid},'#area_Grocery_Suggest_popup');
	});   
       
	

	
       
$('#txtArea').click(function(event){		
			$("#pinAuto").hide();
			JSONS("ajxmain.php",{cases:  'servicepickuparea',type_flag:''+ $("#type_flag").val()+'',docId:$("#mpdocid").val(),pickup:'y'},'#areaAuto');			
			 
			 if($("#type_flag").val() == '64' || $("#type_flag").val() == '8192' || $("#type_flag").val() == '512' || $("#type_flag").val() == '33554432' || $("#type_flag").val() == '1073741824') {
				 if(!($('#areaAuto div.slider-vertical').slider("value")>0)) {
				 setSlider($('#areaAuto'));
				 if($('#areaAuto div.sct').height() <= 300 && $('#areaAuto div.sct').height() != null){ 
					 $("#areaAuto").height($('#areaAuto div.sct').height());
				 }
				 else{ 
					 $("#areaAuto").height(300);
				 }
			 }	
				 
			 }
	});	
	

	$('#txtArea').focusout(function(event) {				
		//$('#areaAuto').hide();		
		if($('#txtArea').val() != '') {
			if(!$('#picksubar').is(':visible')) {
				servicePickUpFocusout('fo');
			}
		}
	});
	
	if(onloadFn == "fav")
	 {
		$('#fvinp').focus(function(event){
			$('#fvinp').val('');
			$('#fvinp').removeClass("grey");
		});
		$('#fvinp').keyup(function(event){
		if(event.which==39 || event.which==37) return;
		if (handleKeys(event,"#fvinp","","#favauto")==true)return false;
		if(favstr != '' && favstr == $('#fvinp').val().autovalue("#fvinp"))return false;
		favstr = $('#fvinp').val().trimSpace().autovalue("#fvinp");
		favstr = favstr.replace(/[[\]{}()*+\.?,\\^$|#]+/g,'');
		favstr = favstr.replace(/\-/g,' ');
		favstr = favstr.replace(/[\s+]+/g,' ');
		favstr	= ltrim(favstr);
		favstr = favstr.toLowerCase();
		if(favstr != " " && event.which != 13)
		{
			var passmobile = (getCookie('ln') != '' && getCookie('attn_user') != 'logout') ? getCookie('ln') : '';
			JSONS("autosuggest.php",{cases: 'whatfav',search:  ''+favstr+'' ,area:  ''+ getCookie('inweb_area')+'',city:  ''+ $('#city').val()+'',scity:getCookie('scity'), mobile : passmobile},'#favauto' );
		}
		});
		
		$('#fvinp').focusout(function(event) {
			$('#fvinp').val('');
			$("#favauto").hide();
			getfav_comp();
		});
	 }
	
        
		if((onloadFn == 'detailsPage' || onloadFn == 'menuPage') && (tabVal == '2' || tabGroceryVal == '2' || tabGroceryVal == '1' || tabVal == 'tcareaddress' || tabVal == 'booklab address'))
		{
            $('#chkoutArea').click(function(event){		
                JSONS("ajxmain.php",{cases:  'dlarea',search: '',type:'' ,active:1,city:  ''+ $('#city').val()+'',docId:$("#docid").val(),domId:$('#domId').val()},'#chkoutAuto');
            });
            $('#pchkoutArea').click(function(event){		
				if(tabGroceryVal == '2'|| tabGroceryVal == '1' )	
					JSONS("ajxmain.php",{cases:  'dlgroceryarea',limit:'',search: '',type:'all' ,city:  ''+ $('#city').val()+'',docId:$("#gcydocid").val(),bid:bid},'#pchkoutAuto');
                else
					JSONS("ajxmain.php",{cases:  'dlarea',search: '',type:'' ,active:1,city:  ''+ $('#city').val()+'',docId:$("#docid").val(),domId:$('#domId').val()},'#pchkoutAuto');     
            });
            $('#chkoutArea').focusout(function(event) { 
                    
                   
                    
                    $.ajax({
                                    url:WEBROOT+"functions/ajxAreaSelect.php",
                                    type: "post",
                                    data :{area:$("#chkoutArea").val(),docid:$("#docid").val(),domPincode:$('#domPincode').val(),domId:$('#domId').val()},
                                    async:false, 
                                    success:function(result){
                    
                        var tmpArr = result.split("|~|");
                        
                        if(tmpArr[0] != 1){
                            var arpass = 0;
                            var arpass2 = 0;
                            $.ajax({
                                    url:WEBROOT+"ajxmain.php", 
                                    dataType:"json",
                                    data :{
                                            cases : 'dlarea',
                                            search : '',
                                            type : 'all',
                                            city : ''+ $('#city').val()+'',
                                            docId : $("#docid").val()
                                    },
                                    async:false, 
                                    success:function(result){
                                       
                                        $(result.results).each( function(i,val)
                                       {
                                          var needle = val.value.toLowerCase();
                                          
                                          var haystacka = $("#txtbldg").val().toLowerCase();
                                          var haystackb = $("#txtLocation").val().toLowerCase();
                                          var haystackc = $("#txtLandmark").val().toLowerCase();
                                          var haystackd = $("#chkoutArea").val().replace(/^At /,'');
                                          haystackd = haystackd.toLowerCase();
                                          
                                          /*if(strstr(haystacka, needle) !=  false || strstr(haystackb, needle) !=  false || strstr(haystackc, needle) !=  false){
                                              arpass++;
                                          }*/
                                          
                                          if(strstr(needle,haystackd) !=  false){
                                               arpass2++;
                                           }


                                       })
                                    }
                            });
                            
                            
                            
                        }
                        
			if(tmpArr[0] == 1 || arpass2 >0){
                                
                                 $('#chkoutArea').next().text(''); 
                                 var pincodes = tmpArr[1].split(',');
                                  
                                 if(pincodes.length > 1){
                                     
                                    
                                     var inrHTML = '';
                                     inrHTML += '<select class="multpncd" name="Pincode" id="txtPin">';
                                     
                                     for(var p=0;p<pincodes.length;p++)
                                     {
                                         inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
                                     }
                                     
                                     inrHTML += '</select>';
                                     
                                     $('#pinCont').html(inrHTML);
                                     
                                 }
                                 else{
                                     if($.trim($("#txtPin").val()) == ''){
                                    var inrHTML = '';
                                     
                                     inrHTML += ' <input disabled="disabled" type="text" name="Pincode" value="'+tmpArr[1]+'"  id="txtPin"/>';
                                    
                                     $('#pinCont').html(inrHTML);
                                     }
                                     
                                 }
                                 
                                 //$('#pinCont').show();
                                 
                                 $('#flgArea').val('1');
				
			}else{
				$('#chkoutArea').next().show();
                                var part = ($("#isreg").val() == 5) ? "retailer" : 'restaurant' ;
                                var part2 = ($("#isreg").val() == 5) ? "" : 'food ' ;
				
                                $('#chkoutArea').next().text('Sorry, this '+part+ ' does not deliver '+part2+'in '+$.trim($('#hdnDlAr').val())+'. Please try some other area or select another '+part+ ' .');
                                $('#flgArea').val('0');
				
                        }
                                    }});
                    $("#chkoutAuto").hide();
                    
            });
            $('#pchkoutArea').focusout(function(event) 
            { 
				var purl;
				var pdata;
				if(tabGroceryVal == '2')
				{
					purl = WEBROOT+"functions/ajxgroceryaction.php";
					pdata = {area:$("#pchkoutArea").val(),docid:$("#gcydocid").val(),action:'checkGroceryDelivery',bid:bid,areaid:$("#gcyareaid").val()}
					
				}
				else if(onloadFn == 'detailsPage' && (tabVal == 'tcareaddress' || tabVal == 'booklab address')) {
				    purl = WEBROOT+"ajxmain.php";
				    pdata = { cases : 'exactarea', search : $("#pchkoutArea").val(),docId : docId,type : 'areas',city : ''+ $('#city').val()+'',active : 1 ,'edit' : 1};
				}
				else
				{
					purl = WEBROOT+"functions/ajxAreaSelect.php";
					pdata = {area:$("#pchkoutArea").val(),docid:$("#docid").val(),domPincode:$('#domPincode').val(),domId:$('#domId').val()};
				}
                   
                    
				$.ajax({
					url:purl,
					type: "post",
					data :pdata,
					async:false, 
					success:function(result)
					{
						var tmpArr = result.split("|~|");
						if(tmpArr[0] == 1)
						{
							$('#pchkoutArea').next().text(''); 
							var pincodes = tmpArr[1].split(',');
							if(pincodes.length > 1)
							{
								var inrHTML = '';
								inrHTML += '<select class="multpncd" name="pPincode" id="ptxtPin">'; 
								for(var p=0;p<pincodes.length;p++)
								{
									inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
								}
								inrHTML += '</select>'; 
								$('#ppinCont').html(inrHTML);	 
							}
							else
							{
								if($.trim($("#ptxtPin").val()) == '')
								{
									var inrHTML = '';
									inrHTML += ' <input disabled="disabled" type="text" name="pPincode" value="'+tmpArr[1]+'"  id="ptxtPin"/>';
									$('#ppinCont').html(inrHTML);
								} 
							}
							//$('#pinCont').show();
							$('#pflgArea').val('1');
						}
						else
						{
							if(onloadFn == 'detailsPage' && (tabVal == 'tcareaddress' || tabVal == 'booklab address' || tabGroceryVal == '1' || tabGroceryVal == '2' )) { 
								var errTxt = "Please enter a valid area";
								$('#pchkoutArea').next().text(errTxt).show();
								$('#pflgArea').val('0');
							}
							else
							{
								$('#pchkoutArea').next().show();
								var part = ($("#isreg").val() == 5) ? "retailer" : 'restaurant' ;
								var part2 = ($("#isreg").val() == 5) ? "" : 'food ' ;
								$('#pchkoutArea').next().text('Sorry, this '+part+ ' does not deliver '+part2+'in '+$.trim($('#pchkoutArea').val())+'. Please try some other area or select another '+part+ ' .');
								$('#pflgArea').val('0');
							}
						}
					}
				});
				$("#pchkoutAuto").hide();    
            });
		}
        if(onloadFn == 'detailsPage' && (tabGroceryVal == '2' || tabGroceryVal == '1'))
        {    
            $('#chkoutGroceryArea').click(function(event)
            {	
				$("#gcyareaid").val('')	;
                JSONS("ajxmain.php",{cases:  'dlgroceryarea',limit:20,search: '',type:'all' ,city:  ''+ $('#city').val()+'',docId:$("#gcydocid").val(),bid:bid},'#chkoutGroceryAuto');
            });
            
            $('#chkoutGroceryArea').focusout(function(event) 
            {   
				$.post(WEBROOT+"functions/ajxgroceryaction.php",{area:$("#chkoutGroceryArea").val(),docid:$("#gcydocid").val(),action:'checkGroceryDelivery',bid:bid,areaid:$("#gcyareaid").val()}, function(result)
				{
					var tmpArr = result.split("|~|");
					if(tmpArr[0] == 1)
					{			
						$('#chkoutGroceryArea').next().text(''); 
						var pincodes = tmpArr[1].split(','); 
						if(pincodes.length > 1)
						{
							var inrHTML = '';
							inrHTML += '<select class="multpncd" name="Pincode" id="txtPin">';
							for(var p=0;p<pincodes.length;p++)
							{
								inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
							}
							inrHTML += '</select>';
							$('#pinCont').html(inrHTML);	 
						}
						else
						{	
							if($.trim($("#txtPin").val()) == ''){		 
								var inrHTML = '';			 
								inrHTML += ' <input disabled="disabled" type="text" name="Pincode" value="'+tmpArr[1]+'"  id="txtPin"/>';		
								$('#pinCont').html(inrHTML);		
							}		 
						}			 
						$('#flgArea').val('1');
					}
					else
					{
						$('#chkoutGroceryArea').next().text('Sorry, this store does not deliver here. Please try some other area or select any other store.');  
						$('#flgArea').val('0');
					}
                });
                $("#chkoutGroceryAuto").hide();    
            }); 
		}
        
	$('#areaMenu').focusout(function(event) { 
		$("#area_Suggest_popup").hide();
	});
	$('#areaGrocery').focusout(function(event) { 
		$("#area_Grocery_Suggest_popup").hide();
	});

        
        $('#tcareArea').focusout(function(event){ 
            $('#tcareAuto').hide();
        });
        
        $('#mpolisArea').focusout(function(event){
           $('#mpolisAuto') .hide();
        });

	
	$('#city,#flcity,#wcity').keyup(function(event) {		
		citydiv = get_city_cont(this.id);		
		if (handleKeys(event,"#"+this.id,"#what",citydiv)==true) return false;
		if($(this).val().trim() == '') {
			JSONS("autosuggest.php",{cases: 'popCity',search: '',scity:getCookie('scity') },citydiv);
		} else {
			JSONS("autosuggest.php",{cases: casesCity.autovalue(),search: $(this).val().trim()+'',scity:getCookie('scity') },citydiv);
		}
 	});

	$('#city,#what,#where,#where_a').focus(function(event){
		citydiv = get_city_cont(this.id);
		if($("#" + this.id).hasClass("grey") || this.id=="city" || this.id=="where")
		{
			if($("#" + this.id).val()!="")
			{
				$("#" + this.id).attr("alt",$("#" + this.id).val());
			}
			$("#" + this.id).val("");
			if(this.id=="where")
			{
				$("#arlnk").html('Area');
				$("#where").val('');
				$("#arlnk").addClass("grey");
				if(onloadFn == 'Index')
				{
					fn_Banner('','','','',1);
				}
			}
		}
		
		if (this.id=="where_a") { $('#sauto_b').css('display', 'none'); };
		
		if (this.id!="city") $("#" + this.id).removeClass("grey");
		if(this.id=='what' && valcheck == 1)
		{
			$("#city").val(getCookie('inweb_city'));
			/*alert("Please Select Valid City");
			$("#city").focus();
			$("#" + this.id).addClass("grey");
			JSONS("autosuggest.php",{cases: casesCity.autovalue(),search: '@A@'+'',scity:getCookie('scity') },citydiv);*/
		}
		else if(this.id=='what' && valcheck == 2)
		{
			$("#city").val(getCookie('inweb_city'));
			/*alert("Please Select Valid City");
			$("#city").focus();
			JSONS("autosuggest.php",{cases: casesCity.autovalue(),search: '@A@'+'',scity:getCookie('scity') },citydiv);*/
		}
	});
	$('#what,#where,#where_a,#where_b,#areaMenu,#chkoutArea,#pchkoutArea,#chkoutGroceryArea,#areaGrocery,#tcareArea,#mpolisArea,#txtArea,#txtDstnPincode').keyup(function(event)
	{ 
		if(onloadFn=="National Search")	{			
			if(event.which == 13) {
				gofun();
			}
			return false;
		}
		if ($("#"+this.id).val().substr(0,4)=="e.g." || $("#"+this.id).val()=="" && this.id == "what") {
			divHide("","");
			return false;
		}
		if (this.id=="what") 
		{
 			whatid="";
			if(event.which==39 || event.which==37) return;
			if (handleKeys(event,"#what","#where","#sauto")==true)
				return false;
			/*if(!cachearr[$('#city').val().toUpperCase()+' '+$('#what').val().toUpperCase().autovalue()])
			{*/
		        var str = $('#what').val().trimSpace().autovalue("#what");
				str = str.replace(/[[\]{}()*+?,\\^$|#]+/g,'');
				str = str.replace(/\.-/g,' ');
				str = str.replace(/[\s+]+/g,' ');
				str	= ltrim(str);
				str = str.toLowerCase();
				
				if(str != " " && str != "" && str.length>1 && str.length<80)
            	{
					var cookcity = ($('#city').val()) ? $('#city').val() : (getCookie('scity') ? getCookie('scity') : $('#city').val());
					var areaval = ($('#where').val().substr(0,4)=='e.g.') ? '' : $('#where').val();
					if(alat==undefined)
					{
							JSONS('autosuggest.php',{cases:casesWhat.autovalue(),search:''+str+'',city:''+cookcity+'',area:''+areaval+'',scity:getCookie('scity')},'#sauto');
					}
					else
					{
						if(areaval.substr(0,4)=='e.g.')
						{
							areaval=alat=alon='';
						}
						JSONS('autosuggest.php',{cases:casesWhat.autovalue(),search:''+str+'',city:''+cookcity+'',area:''+areaval+'',
						lat:''+alat+'',lon:''+alon+'',scity:getCookie('scity')},'#sauto');
					}
                }
            /*}
			else
            {
				JSONcache(cachearr[$('#city').val().toUpperCase()+' '+$('#what').val().trim().toUpperCase()],{search:  ''+$('#what').val().trim()+'' ,city:  ''+ $('#city').val()+'' ,cases:  casesWhat.autovalue()},'#sauto');
            }*/
		}
		else if (this.id=="chkoutArea" && tabVal != '2')
		{
			if (handleKeys(event,"#chkoutArea","","#chkoutAuto")==true) return false;

			var strg = $('#chkoutArea').val().trim();
			strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
			strg = strg.replace(/\-/g,' ');
			strg = strg.replace(/\'/g,'');
			strg = strg.replace(/[\s+]+/g,' ');

			var strg1 = strg.substr(0,2);
			var strg2 = strg.substr(0,3);

			if(strg1.toLowerCase() != "at" || strg2.toLowerCase() == "at ")
			{
				JSONS("ajxmain.php",{cases:  'where',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId:$("#docid").val()},'#chkoutAuto');
			}
		}
		else if (this.id=="cbrand")
		{
			if (handleKeys(event,"#cbrand","","#brandauto")==true) return false;
		}
		else if (this.id=="cmodel")
		{
			if (handleKeys(event,"#cmodel","","#modelauto")==true) return false;
		}
		else if (this.id=="ctime")
		{
			if (handleKeys(event,"#ctime","","#timeauto1")==true) return false;
		}
		else if (this.id=="where_a" || this.id=="where_b")
		{
			if(this.id=="where_a") {
				var spnId = 'sauto_a';
			} else if(this.id=="where_b") {
				var spnId = 'sauto_b';
			}
			if (handleKeys(event,"#"+this.id,"","#"+spnId)==true) return false;

			var strg = $('#'+this.id).val().trim();
			strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
			strg = strg.replace(/\-/g,' ');
			strg = strg.replace(/\'/g,'');
			strg = strg.replace(/[\s+]+/g,' ');

			var strg1 = strg.substr(0,2);
			var strg2 = strg.substr(0,3);

			if(strg1.toLowerCase() != "at" || strg2.toLowerCase() == "at ")
			{
				JSONS("ajxmain.php",{cases:  'where',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId:$("#docid").val()},'#'+spnId);
			}
		}
		else 
		{
			if(!$("#fda").is(':visible') && !$("#gda").is(':visible') && tabVal != 'tcareaddress' && tabVal != 'booklab address')
			{
				if((onloadFn == 'detailsPage' || onloadFn == 'menuPage')  && (tabVal == '2' || tabGroceryVal == '2' || tabGroceryVal == '1'))
				{
					if($("#edtAddr").is(':visible'))
					{
						if (handleKeys(event,"#pchkoutArea","","#pchkoutAuto")==true) return false;
						$('#pflgArea').val('0');
						var strg = $('#pchkoutArea').val().trim();
						strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
						strg = strg.replace(/\-/g,' ');
						strg = strg.replace(/\'/g,'');
						strg = strg.replace(/[\s+]+/g,' ');

						var strg1 = strg.substr(0,2);
						var strg2 = strg.substr(0,3);

						if(strg1.toLowerCase() != "at" || strg2.toLowerCase() == "at ")
						{
							if(tabGroceryVal == '2' || tabGroceryVal == '1')
								JSONS("ajxmain.php",{cases:  'dlgroceryarea',limit:20,search: ''+strg+'',type:'all' ,city:  ''+ $('#city').val()+'',docId:$("#gcydocid").val(),bid:bid},'#pchkoutAuto');
							else
								JSONS("ajxmain.php",{cases:  'dlarsrch',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId:$("#docid").val()},'#pchkoutAuto');   
						}
					}
					else if(onloadFn == 'detailsPage' && (tabGroceryVal == '2' || tabGroceryVal == '1'))
					{
						if (handleKeys(event,"#chkoutGroceryArea","","#chkoutGroceryAuto")==true) return false;
						$('#flgArea').val('0');
						var strg = $('#chkoutGroceryArea').val().trim();
						strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
						strg = strg.replace(/\-/g,' ');
						strg = strg.replace(/\'/g,'');
						strg = strg.replace(/[\s+]+/g,' ');

						var strg1 = strg.substr(0,2);
						var strg2 = strg.substr(0,3);

						if(strg1.toLowerCase() != "at" || strg2.toLowerCase() == "at ")
						{
							$("#gcyareaid").val('')	;
							JSONS("ajxmain.php",{cases:  'dlgroceryarea', type:'all',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId:$("#gcydocid").val(),bid:bid},'#chkoutGroceryAuto');
						}
					}
					else
					{
						if (handleKeys(event,"#chkoutArea","","#chkoutAuto")==true) return false;
						$('#flgArea').val('0');
						var strg = $('#chkoutArea').val().trim();
						strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
						strg = strg.replace(/\-/g,' ');
						strg = strg.replace(/\'/g,'');
						strg = strg.replace(/[\s+]+/g,' ');

						var strg1 = strg.substr(0,2);
						var strg2 = strg.substr(0,3);

						if(strg1.toLowerCase() != "at" || strg2.toLowerCase() == "at ")
						{
							JSONS("ajxmain.php",{cases:  'dlarsrch',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId:$("#docid").val(),domId:$('#domId').val()},'#chkoutAuto');
						}
					}
				}
				else if (this.id=="txtArea") 
				{ 
					if(!$('#picksubar').is(':visible')) 
					{
						$("#pinAuto").hide();
						if(event.which==13)
						{					
							handleKeys(event,"#txtArea","","#areaAuto");					
							servicePickUpFocusout('');
						}
						else if(event.which==9)
						{
							
							JSONS("ajxmain.php",{cases:  'servicepickuparea',type_flag:''+ $("#type_flag").val()+'',docId:$("#mpdocid").val(),pickup:'y'},'#areaAuto');	
						}
						else if (event.which!=9){
											
							if (handleKeys(event,"#txtArea","","#areaAuto")==true) return false;
							
							var strg = $('#txtArea').val().trim();
							JSONS("ajxmain.php",{cases:  'servicepickuparea',type_flag:''+ $("#type_flag").val()+'',docId:$("#mpdocid").val(),pickup:'y',area:strg},'#areaAuto');
						}
					}	
				}
				else if(this.id=="txtDstnPincode") 
				{					
					if (handleKeys(event,"#txtDstnPincode","","#pincodeAuto")==true) return false;				
					if ($("#flMaincity").val()!=""){
						JSONS("ajxmain.php",{cases: casesPincode.autovalue(),search: $(this).val().trim()+'',city:$("#flMaincity").val() },"#pincodeAuto");
					}
				}
				else
				{
					if (handleKeys(event,"#where","","#aauto")==true) return false;
					var str = $('#where').val().trim();
					str = str.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
					str = str.replace(/\-/g,' ');
					str = str.replace(/\'/g,'');
					str = str.replace(/[\s+]+/g,' ');
					
					var str1 = str.substr(0,2);
					var str2 = str.substr(0,3);
					var str_reg = /^[^a-zA-Z0-9]+$/.test(str);
					if(str_reg == false && (str1.toLowerCase() != "at" || str1.match(/^[A-Za-z0-9]+$/)
					))
					{
						JSONS("ajxmain.php",{cases:  casesWhere.autovalue(),search:  ''+str+'' ,city:  ''+ $('#city').val()+''},'#aauto');
					}
				}
			}
	
			if($("#fda").is(':visible'))
			{		
				if (handleKeys(event,"#areaMenu","","#area_Suggest_popup")==true) return false;
				$("#proceedBtn").hide();
				$("#closeBtn").show();
				
				var strg = $('#areaMenu').val().trim();
				strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
				strg = strg.replace(/\-/g,' ');
				strg = strg.replace(/\'/g,'');
				strg = strg.replace(/[\s+]+/g,' ');
				
				var strg1 = strg.substr(0,2);
				var strg2 = strg.substr(0,3);
				
				if(strg1.toLowerCase() != "at" || strg1.match(/^[A-Za-z0-9]+$/))
				{
					JSONS("ajxmain.php",{cases:  'dlarsrch',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId:$("#docid").val(),domId:$('#domId').val()},'#area_Suggest_popup');
				}
			}
			else if($("#gda").is(':visible'))
			{ 
				if (handleKeys(event,"#areaGrocery","","#area_Grocery_Suggest_popup")==true) return false;
				
				$("#gcyproceedBtn").hide();
				$("#gcycloseBtn").show();
				
				var strg = $('#areaGrocery').val().trim();
				strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
				strg = strg.replace(/\-/g,' ');
				strg = strg.replace(/\'/g,'');
				strg = strg.replace(/[\s+]+/g,' ');
				
				var strg1 = strg.substr(0,2);
				var strg2 = strg.substr(0,3);
				
				if(strg1.toLowerCase() != "at" || strg2.toLowerCase() == "at ")
				{
					$("#gcyareaid").val('')	;
					JSONS("ajxmain.php",{cases:  'dlgroceryarea',search:  ''+strg+'',type:"all" ,city:  ''+ $('#city').val()+'',docId:$("#gcydocid").val(),bid:bid},'#area_Grocery_Suggest_popup');
				}
			}
			
			if(onloadFn == 'detailsPage' && tabVal == 'tcareaddress')
			{
			   $('#tAreaVal').val('');
			   if($("#edtAddr").is(':visible')) {
			       
			       if (handleKeys(event,"#pchkoutArea","","#pchkoutAuto")==true) return false;
			       $('#pflgArea').val('0');
			       var strg = $('#pchkoutArea').val().trim();
			   }
			   else { 
			       if (handleKeys(event,"#tcareArea","","#tcareAuto")==true) return false;
			       var strg = $('#tcareArea').val().trim();
			   }
			    
			    strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
			    strg = strg.replace(/\-/g,' ');
			    strg = strg.replace(/\'/g,'');
			    strg = strg.replace(/[\s+]+/g,' ');

			    var strg1 = strg.substr(0,2);
			    var strg2 = strg.substr(0,3);

			    if(strg1.toLowerCase() != "at" || strg1.match(/^[A-Za-z0-9]+$/))
			    {
				if($("#edtAddr").is(':visible')) {
				    JSONS("ajxmain.php",{cases:  'where',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId : docId},'#pchkoutAuto');
				}
				else {     
				    JSONS("ajxmain.php",{cases:  'where',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId : docId},'#tcareAuto');
				}
			    }
		   }	
                   
                   if(onloadFn == 'detailsPage' && tabVal == 'booklab address')
                   {
		       
                        $('#mpLabAreaVal').val('');
		        if($("#edtAddr").is(':visible')) {
			       if (handleKeys(event,"#pchkoutArea","","#pchkoutAuto")==true) return false;
			       $('#pflgArea').val('0');
			       var strg = $('#pchkoutArea').val().trim();
			}
			else { 
			    if (handleKeys(event,"#mpolisArea","","#mpolisAuto")==true) return false;
			    var strg = $('#mpolisArea').val().trim();
			}
			
                        strg = strg.replace(/[[\]{}()*+?.,\\^$|#]+/g,'');
                        strg = strg.replace(/\-/g,' ');
                        strg = strg.replace(/\'/g,'');
                        strg = strg.replace(/[\s+]+/g,' ');

                        var strg1 = strg.substr(0,2);
                        var strg2 = strg.substr(0,3);

                        if(strg1.toLowerCase() != "at" || strg1.match(/^[A-Za-z0-9]+$/))
                        {
			    if($("#edtAddr").is(':visible')) {
				JSONS("ajxmain.php",{cases:  'where',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId : docId},'#pchkoutAuto');
			    }
			    else { 	
				JSONS("ajxmain.php",{cases:  'where',search:  ''+strg+'' ,city:  ''+ $('#city').val()+'',docId : docId},'#mpolisAuto');
			    }
                        }
                   }
                   
		}
	});
	$('#verifycodeval').keypress(function(event) {
		//alert(event.which); //harshada
		if(event.which == 13) {
				testing();
				return false;
			}			
	});
	$('#what,#where,#areaMenu,#chkoutArea,#pchkoutArea,#chkoutGroceryArea,#areaGrocery,#tcareArea,#mpolisArea,#txtArea').keydown(function(event)
	{
		if (event.which != 9 && this.id != 'where') {
			$("#"+this.id).focus();
		}
		else if (event.which == 9) 
		{
			if (JSONObject != null)	JSONObject.abort();
			if (this.id=="what") 
			{
				whatid=$("#sauto ul li a.act").attr("id");
				if (whatid!=undefined) 
				{
					var what_arr = whatid.split('|');
					$('#catid').val(what_arr[0]);
					$('#type').val(what_arr[1]);
					if(what_arr[1]==1 && what_arr[4]!='')
					{
						$('#where').val(what_arr[4]);
						$('#arlnk').html(what_arr[4]);
						$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+what_arr[4]+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
						document.index.city.value = what_arr[3];
					}
					setData("#"+this.id,$("#sauto ul li a.act").text().replace(' [+]',''));
				}
			}
			else 
			{
				setData("#"+this.id,$("#aauto ul li a.act").text());
                if (this.id=="areaMenu") 
                {
					setData("#"+this.id,$("#area_Suggest_popup ul li a.active").text());
				}
                if(this.id=="chkoutArea")
                {
                    setData("#"+this.id,$("#chkoutAuto ul li a.active").text());
				}
                                if(this.id=="pchkoutArea")
                                {
                                    setData("#"+this.id,$("#pchkoutAuto ul li a.active").text());
				}
				if (this.id=="areaGrocery") 
				{
					setData("#"+this.id,$("#area_Grocery_Suggest_popup ul li a.active").text());
				}
				if(this.id=="chkoutGroceryArea")
				{
					setData("#"+this.id,$("#chkoutGroceryAuto ul li a.active").text());
				}         
			}
			divHide('','');
		}
 	});

	$('#aauto,#area_Suggest_popup,#area_Grocery_Suggest_popup,#sauto,#cauto,#nca,#fauto,#wauto','#favauto').mouseover(function(event){$("#" + this.id + " ul li a").removeClass("act");});
	$('.dar,.darsub').mouseup(function(event){
		citydiv = get_city_cont(this.id);
        if($(this).hasClass('darsub')==true) {
            citydiv = "#fauto";  $("#cauto").html(""); }
        else {
            citydiv = "#cauto"; $("#fauto").html(""); }
    	if($(citydiv).is(":visible")==false) {
			$.get(WEBROOT + "template/city_div.php",{city:$('#city').val()}, function(data) {
                $(citydiv).html(data);				
			});
		}
		$(citydiv).toggle();
	});
	$('#go').click(function(event){
		replace_whatout();
		gofun();
	});
};
var divHide = function(Nextobject,divHolder) {
	$(".jauto").hide();
	if(Nextobject != "")
	{
		$(Nextobject).focus();
	}
}

function get_city_cont(id)
{
	var c = '';
	if(id=="flcity")
	{
		c = "#fauto";
	}
	else if(id=="wcity")
	{
		c = "#wauto";
	}
	else if(onloadFn == 'National Search')
	{
		c = "#nca";
	}
	else
	{
		c = "#cauto";
	}
	return c;
}

function ltrim(s)
{
	var l=0;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	return s.substring(l, s.length);
}

function setData(object,data,divID) 
{
	
	valcheck = 0;
	if(object == "#city")
	{
		$("#arlnk").html('Area');
		$("#where").val('');
		$("#arlnk").addClass("grey");
	}
	if (object == "#city" && data == "") 
	{
		data = autoValue;
	}
	if (data) 
	{
		autoValue=data;			
		$(object).val(data);
		if(object == '#flcity')
		{
			$.get(WEBROOT + "ajxmain.php",{cases:  casesStdcode,city:  ''+ data+''}, function(data) 
			{
				if(document.getElementById('flpcode'))
					{
						$("#flpcode").focus();
					}
					else if(document.getElementById('advpcode'))
					{
						$("#advpcode").focus();
					}
					else if(document.getElementById('txtDstnPincode'))
					{						
						$("#fauto").hide();
						$("#flcity").triggerHandler( "focusout" );						
						$("#txtDstnPincode").val('');						
						$("#txtDstnPincode").triggerHandler( "click" );
						$("#txtDstnPincode").focus();
						return true;
					}
					//$(".std").html(data);
			});
		}
	}
	if (object == "#city" && data != "")
	{
		if(getCookie('usrcity').toLowerCase()==data.toLowerCase() || getCookie('usrcity')==''){
			getLocation();
		}
		$('#ctlnk').text($("#city").val());
		$('#ctlnk').show();
		$('#ctyBox').hide();		
		document.cookie = 'inweb_area=;expires=0; path=/; domain=' + cookieondomain;
		//document.cookie = 'inweb_city='+$("#city").val()+'; '+date+'; path=/; domain=' + cookieondomain;
		document.cookie = 'inweb_city='+$("#city").val()+';expires=0;path=/;domain='+cookieondomain+';' + ';';
		var tcity = getCookie('scity');
		if(tcity!=$("#city").val())
		{
			$("#wlnk").html('...');
			$("#where").val('');
			$(".menu_outer").html('');
			if($(".menu_outer").attr('class').indexOf("hkul")!=-1)
			{
				$(".menu_outer").removeClass().addClass("menu_outer dn");
			}
			document.cookie = 'scity='+$("#city").val()+';expires=0;path=/;domain='+cookieondomain+';' + ';';
			if(document.cookie.indexOf("sarea") != -1){
				document.cookie = 'sarea=;expires=0;path=/;domain='+cookieondomain+';' + ';';
			}
			document.cookie = 'slat=;expires=0;path=/;domain='+cookieondomain+';' + ';';
			document.cookie = 'slan=;expires=0;path=/;domain='+cookieondomain+';' + ';';
			//$('.detarea').addClass("dn");
			$(".detarea").html(disparea());
		}

		if (data.length > 22)
			$("#wherein").html(data.substr(0,22)+"..."+"?");
		else
			$("#wherein").html(data+"?");
		$("#chkrembercity").removeAttr('checked');
		/*if(onloadFn=="National Search") window.location = WEBROOT;*/
		/*var actcity = $("#city").val().trim();
		if(actcity.toLowerCase() == 'delhi / ncr')
		{
			hiwcity = 'Delhi-NCR';
		}
		else
		{
			hiwcity = actcity;
		}*/
		//if(onloadFn == "howitworks"){ window.location = WEBROOT+hiwcity+"/online-food-ordering-service";}
	}
	
	 
	
	//if (object == "#where" && $("#what").hasClass("grey") && onloadFn != "National Search")
	if (object == "#where" && $("#what").hasClass("grey") && onloadFn == "Index")
	{
		fn_Banner();
	}
     if(object == "#areaMenu"){
         
               $("#hdnslAr").val($("#areaMenu").val());
         
         	 $.ajax({
                                    url:WEBROOT+"functions/ajxAreaSelect.php",
                                    type: "post",
                                    data :{area:$("#areaMenu").val(),docid:$("#docid").val(),domPincode:$('#domPincode').val(),domId:$('#domId').val()},
                                    async:false, 
                                    success:function(result){
                         var tmpArr = result.split("|~|");
			if(tmpArr[0] == 1){
				//$("#green").show();
				$("#error").hide();
				$("#areaDisp").html("<b>"+$("#areaMenu").val()+"</b>");
				var tmVal = $('#dltm :selected').val();
				if(typeof tmVal != 'undefined'){
					 $("#dlVldt").hide();	
					 $("#proceedBtn").show();  
					 $("#closeBtn").hide();
				}
			}
			else
			{
                                
                                 $.ajax({
                                    url:WEBROOT+"functions/ajxsubarea.php", 
                                    type: "post",
                                    dataType:"json",
                                    data :{
                                            search : $.trim($("#areaMenu").val()),
                                            city : ''+ $('#city').val()+'',
                                            docId : $("#docid").val()
                                    },
                                    async:false, 
                                    success:function(result){
                                      if(result.results.length){
                                            var inrHTML = '';
                                            inrHTML += '<table width="100%" class="tblrw">';

                                            for(var k=0;k < result.results.length;k=k+3)
                                            {
                                                var sub1 = '';
                                                var sub2 = '';
                                                var sub3 = '';
                                                var cls = '';
                                                if(typeof result.results[k] !='undefined'){
                                                    sub1 = result.results[k].text;
                                                }
                                                if(typeof result.results[k+1] !='undefined'){
                                                    sub2 = result.results[k+1].text;
                                                }
                                                if(typeof result.results[k+2] !='undefined'){
                                                    sub3 = result.results[k+2].text;
                                                }
                                                inrHTML += '<tr>';
                                                if(sub1 == ''){
                                                    cls = 'sublast';
                                                }
                                                inrHTML += "<td class='"+cls+"'><a href='javascript:void(0);' onclick='fillBx(\""+sub1+"\")'>"+sub1+"</a></td>";
                                                inrHTML += '<td class="spc"></td>';
                                                if(sub2 == ''){
                                                    cls = 'sublast';
                                                }
                                                inrHTML += "<td class='"+cls+"'><a href='javascript:void(0);' onclick='fillBx(\""+sub2+"\")'>"+sub2+"</a></td>";
                                                inrHTML += '<td class="spc"></td>';
                                                if(sub3 == ''){
                                                    cls = 'sublast';
                                                }
                                                inrHTML += "<td class='"+cls+"'><a href='javascript:void(0);' onclick='fillBx(\""+sub3+"\")'>"+sub3+"</a></td>";
                                                
                                                inrHTML += '<td class="spc"></td>';
                                                inrHTML += '</tr>';                                            
                                            }


                                           inrHTML += '</table>';
                                           
                                           
                                           $('#arlistt').html(inrHTML); 
                                          
                                           openDiv('subar');
                                           
                                            if($('#arlistt').length)
                                             {
                                                     setSlider($('#arlistt'));
                                             }
                                             
                                             if($('#arlistt div.sct').height() <= 300){
                                                     $("#arlistt").height($('#arlistt div.sct').height());
                                             }
                                             else{
                                                     $("#arlistt").height(300);
                                             }
				           closeDiv('fda');
                                           divFlg = 0;
                                          

                                         }
                                         
                                    }
                                });
				//$("#green").hide();
                                
                                
				$("#error").show();
				$("#areaDisp1").html("<b>"+$("#areaMenu").val()+"</b>");
				$("#proceedBtn").hide();
				$("#closeBtn").show();
			}
		}});
	}   
     if(object == "#chkoutArea"){
        
                 $.post(WEBROOT+"functions/ajxAreaSelect.php",{area:$("#chkoutArea").val(),docid:$("#docid").val()}, function(result){
                	 	
                        var tmpArr = result.split("|~|");
                        if(onloadFn == 'product_dt' || onloadFn == 'prodcheckout')
                        {
                        	$('#delarea_bst').val(data);
                        }	
			if(tmpArr[0] == 1){
                                $('#chkoutArea').next().hide();
                                $('#chkoutArea').next().html(''); 
                                 
                                 var pincodes = tmpArr[1].split(',');
                                  
                                 if(pincodes.length > 1){
                                     
                                    
                                     var inrHTML = '';
                                     inrHTML += '<select class="multpncd" name="Pincode" id="txtPin">';
                                     
                                     for(var p=0;p<pincodes.length;p++)
                                     {
                                         inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
}
                                     
                                     inrHTML += '</select>';
                                     
                                     $('#pinCont').html(inrHTML);
                                     
                                 }
                                 else{
                                     
                                    var inrHTML = '';
                                     
                                     inrHTML += ' <input disabled="disabled" type="text" name="Pincode" value="'+tmpArr[1]+'"  id="txtPin"/>';
                                    
                                     $('#pinCont').html(inrHTML);
                                     
                                 }
                                 
                                 //$('#pinCont').show();
                                 
                                 $('#flgArea').val('1');
				
			}else if(vertical != "shopfront"){ 
				var part = ($("#isreg").val() == 5) ? "retailer" : 'restaurant' ;
				var part2 = ($("#isreg").val() == 5) ? "" : 'food ' ;
				
                                $('#chkoutArea').next().text('Sorry, this '+part+ ' does not deliver '+part2+'in '+$.trim($('#hdnDlAr').val())+'. Please try some other area or select another '+part+ ' .');
                                $('#flgArea').val('0');
				
                        }
                        
                    });
         
         
		
	} 
    if(object == "#pchkoutArea")
    {
		var purl
		var pdata;
		if(tabGroceryVal == '2' || tabGroceryVal == '1')
		{
			purl = WEBROOT+"functions/ajxgroceryaction.php";
			pdata = {area:$("#pchkoutArea").val(),docid:$("#gcydocid").val(),action:'checkGroceryDelivery',bid:bid,areaid:$("#gcyareaid").val()}
			
		}
		else if(onloadFn == 'detailsPage' && (tabVal == 'tcareaddress' || tabVal == 'booklab address')) {
		    purl = WEBROOT+"ajxmain.php";
		    pdata = { cases : 'exactarea', search : $("#pchkoutArea").val(),docId : docId,type : 'areas',city : ''+ $('#city').val()+'',active : 1 ,'edit' : 1};
		}
		else
		{
			purl = WEBROOT+"functions/ajxAreaSelect.php";
			pdata = {area:$("#pchkoutArea").val(),docid:$("#docid").val()};
			
		}
		$.ajax({
				url:purl,
				type: "post",
				data :pdata,
				
			success:function(result)
			{
				var tmpArr = result.split("|~|");
				if(tmpArr[0] == 1)
				{
					$('#pchkoutArea').next().hide();
					$('#pchkoutArea').next().html(''); 
					var pincodes = tmpArr[1].split(','); 
					if(pincodes.length > 1)
					{
						var inrHTML = '';
						inrHTML += '<select class="multpncd" name="pPincode" id="ptxtPin">'; 
						for(var p=0;p<pincodes.length;p++)
						{
							inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
						}
						inrHTML += '</select>';
						$('#ppinCont').html(inrHTML);
					}
					else
					{
						var inrHTML = '';
						inrHTML += ' <input disabled="disabled" type="text" name="pPincode" value="'+tmpArr[1]+'"  id="ptxtPin"/>';
						$('#ppinCont').html(inrHTML); 
					}
					//$('#pinCont').show();
					$('#pflgArea').val('1');
				}
				else
				{
				    if(onloadFn == 'detailsPage' && (tabVal == 'tcareaddress' || tabVal == 'booklab address' || tabGroceryVal == '1' || tabGroceryVal == '2' )) { 
					    var errTxt = "Please enter a valid area";
					    $('#pchkoutArea').next().text(errTxt).show();
					    $('#pflgArea').val('0');
				    }
				    else { 
					var part = ($("#isreg").val() == 5) ? "retailer" : 'restaurant' ;
					var part2 = ($("#isreg").val() == 5) ? "" : 'food ' ;
					$('#pchkoutArea').next().text('Sorry, this '+part+ ' does not deliver '+part2+'in '+$.trim($('#pchkoutArea').val())+'. Please try some other area or select another '+part+ ' .');
					$('#pflgArea').val('0');
				    }
				}
			}		
		});
		
	} 
	if(object == "#areaGrocery")
	{
		$.post(WEBROOT+"functions/ajxgroceryaction.php",{area:$("#areaGrocery").val(),docid:$("#gcydocid").val(),action:'checkGroceryDelivery',bid:bid,areaid:$("#gcyareaid").val()}, function(result){
			var tmpArr = result.split("|~|");
			if(tmpArr[0] == 1)
			{
				$("#error").hide();
				$("#gcyareaDisp").html("<b>"+$("#areaGrocery").val()+"</b>");
				var tmVal = $('#gcydltm :selected').val();
				if(typeof tmVal != 'undefined')
				{
					$("#gcydlVldt").hide();	
					$("#gcyproceedBtn").show();  
					$("#gcycloseBtn").hide();
				}	
			}
			else
			{
				$('#gcyareaid').val('');
				$('#gcypanindia_areaid').val('');
				docId = $("#gcydocid").val();
				 $.ajax({
					url:WEBROOT+"functions/ajxgroceryaction.php", 
					type: "post",
					dataType:"json",
					data :{
							search : $.trim($("#areaGrocery").val()),
							city : ''+ $('#city').val()+'',
							docId : docId,
							action:'getGroceryDeliverySubArea',
							bid:bid
					},
					async:false, 
					success:function(result){
						if(result.results.length){
							var inrHTML = '';
							inrHTML += '<table width="100%" class="tblrw">';

							for(var k=0;k < result.results.length;k=k+3)
							{
								var sub1 = '';
								var sub2 = '';
								var sub3 = '';
								var areaidsub1 = '';
								var areaidsub2 = '';
								var areaidsub3 = '';
								var panareaidsub1 = '';
								var panareaidsub2 = '';
								var panareaidsub3 = '';
								var cls =  '';
								if(typeof result.results[k] !='undefined'){
									sub1 = result.results[k].text;
									areaidsub1 = result.results[k].area_id;
									panareaidsub1 = result.results[k].panindia_areaid;
								}
								if(typeof result.results[k+1] !='undefined'){
									sub2 = result.results[k+1].text;
									areaidsub2 = result.results[k+1].area_id;
									panareaidsub2 = result.results[k+1].panindia_areaid;
								}
								if(typeof result.results[k+2] !='undefined'){
									sub3 = result.results[k+2].text;
									areaidsub3 = result.results[k+2].area_id;
									panareaidsub3 = result.results[k+2].panindia_areaid;
								}
								inrHTML += '<tr>';
								if(sub1 == ''){
									cls = 'sublast';
								}
								inrHTML += "<td class='"+cls+"'><a href='javascript:void(0);' onclick='fillGcyBx(\""+sub1+"\",\""+areaidsub1+"\",\""+panareaidsub1+"\")'>"+sub1+"</a></td>";
								inrHTML += '<td class="spc"></td>';
								if(sub2 == ''){
									cls = 'sublast';
								}
								inrHTML += "<td class='"+cls+"'><a href='javascript:void(0);' onclick='fillGcyBx(\""+sub2+"\",\""+areaidsub2+"\",\""+panareaidsub2+"\")'>"+sub2+"</a></td>";
								inrHTML += '<td class="spc"></td>';
								if(sub3 == ''){
									cls = 'sublast';
								}
								inrHTML += "<td class='"+cls+"'><a href='javascript:void(0);' onclick='fillGcyBx(\""+sub3+"\" ,\""+areaidsub3+"\",\""+panareaidsub3+"\")'>"+sub3+"</a></td>";
								
								inrHTML += '<td class="spc"></td>';
								inrHTML += '</tr>';                                            
							}


						   inrHTML += '</table>';
						   
						   
						   $('#arlistt').html(inrHTML); 
						  
						   openDiv('gcysubar');
						   
							if($('#arlistt').length)
							 {
									 setSlider($('#arlistt'));
							 }
							 
							 if($('#arlistt div.sct').height() <= 300){
									 $("#arlistt").height($('#arlistt div.sct').height());
							 }
							 else{
									 $("#arlistt").height(300);
							 }
							closeDiv('gda');
						}
						 
					}
				});
				//$("#green").hide();
                                
                                
				$("#error").show();
				$("#gcyareaDisp1").html("<b>"+$("#areaGrocery").val()+"</b>");
				$("#gcyproceedBtn").hide();
				$("#gcycloseBtn").show();
			}
		});
	}
	if(object == "#chkoutGroceryArea")
	{
		$.post(WEBROOT+"functions/ajxgroceryaction.php",{area:$("#chkoutGroceryArea").val(),docid:$("#gcydocid").val(),action:'checkGroceryDelivery',bid:bid,areaid:$("#gcyareaid").val()}, function(result)
		{
			var tmpArr = result.split("|~|");
			if(tmpArr[0] == 1)
			{					
				$('#chkoutGroceryArea').next().text(''); 
				var pincodes = tmpArr[1].split(','); 
				if(pincodes.length > 1)
				{
					var inrHTML = '';
					inrHTML += '<select class="multpncd" name="Pincode" id="txtPin">'; 
					for(var p=0;p<pincodes.length;p++)
					{
						inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
					} 
					inrHTML += '</select>';
					$('#pinCont').html(inrHTML);	 
				}
				else
				{ 
					var inrHTML = ''; 
					inrHTML += ' <input disabled="disabled" type="text" name="Pincode" value="'+tmpArr[1]+'"  id="txtPin"/>';
					$('#pinCont').html(inrHTML);	 
				}
				$('#flgArea').val('1');	
			}
			else
			{
				$('#chkoutGroceryArea').next().text('Sorry, this store does not deliver here. Please try some other area or select any other store.');  
				$('#flgArea').val('0');	
			}			
		});
	}         	   
     
    if(object == '#where_a') {
		//alert('where_a');
		var divIdArr = divID.split('|');
		$('#lat_a').val(divIdArr[6]);
		$('#lng_a').val(divIdArr[7]);	
		if($('#where_b').val() != '' && $('#lat_b').val() != '' && $('#lng_b').val() != '') {
			if(parseFloat($('#lat_a').val()).toFixed(5) == parseFloat($('#lat_b').val()).toFixed(5) && parseFloat($('#lng_a').val()).toFixed(5) == parseFloat($('#lng_b').val()).toFixed(5)) {
				alert('No route possible.');
				return false;
			}
			getUserDirection('userDirections', '1');
		} else {
			jdmapmarker(divIdArr[6], divIdArr[7]);
		}	
		if($('#where_b').val() == '') {
			$('#getDir').removeClass('dn');
			$('#compAdd').html($('#where_a').val());
		}
	} else if(object == '#where_b') {
		//alert('where_b');
		var divIdArr = divID.split('|');
		$('#lat_b').val(divIdArr[6]);
		$('#lng_b').val(divIdArr[7]);
		if($('#where_a').val() != '') {
			if(parseFloat($('#lat_a').val()).toFixed(5) == parseFloat($('#lat_b').val()).toFixed(5) && parseFloat($('#lng_a').val()).toFixed(5) == parseFloat($('#lng_b').val()).toFixed(5)) {
				alert('No route possible.');
				return false;
			}
			getUserDirection('userDirections', '1');
		}
	}    

    if (object=='#city' && typeof(onloadFn)!= 'undefined' && onloadFn == "filter" && typeof(getcity)!='undefined' && typeof(movieId)!='undefined') {
		data = data.replace(' / ','-');		
		var rediUrl = (window.location.href.replace(getcity,data));			    
		if (rediUrl.indexOf("%3Cnear%3")>0) {
			var rediUrl = WEBROOT+data+'/'+$('#vid').val()+'/Movies_b2c';	
		}			
		if (data.toLowerCase()=='delhi-ncr'){
				data = 'Delhi';
			}
		$.ajax({			
		  url  : WEBROOT+'functions/ajxBookTicket.php?city='+data+'&type=isMovieExist&vid='+$('#vid').val() ,
		  success:function(error)
				{					
					if(error=='0'){
						window.location.href = rediUrl;
					}
					else {
						window.location.href = WEBROOT;
					}
				}
			});				
	}
}
var handleKeys = function(evt,object,Nextobject,divHolder,divSelection) {
	if (!divSelection) divSelection = $(divHolder + " ul li a.act");
	if (typeof evt.length == "number")
		keyCode = evt.split("-")[1];
	else
		keyCode = evt.which;
	if (keyCode == 13) {
		if(object == "#areaMenu"){
		if ($.trim($('#domId').val()) != ''){
				} else{
            $('#dldt').focus();
			}
        }
		if(divHolder == "#aauto"){
            $('#arlnk').removeClass('grey');
        }
        if(object == "#areaGrocery"){
			$('#gcydldt').focus();
			areaid = $(divSelection).attr("id");
			if(typeof areaid !='undefined')
            {
				var tmpid = areaid.split('|');
				$('#gcyareaid').val(tmpid[12]);
				$('#gcypanindia_areaid').val(tmpid[13]); 
				
			}	 
		}
                
                if (object == "#chkoutArea"){
                    whrid = $(divSelection).attr("id");
                    if(typeof whrid !='undefined')
                    {
                        // to fetch multiple pincodes -- start
                        var tmp = whrid.split('|');
                        
                        var pincodes = tmp[8].split(',');
                                  
						 if(pincodes.length > 1){
							 
							
							 var inrHTML = '';
							 inrHTML += '<select class="multpncd" name="Pincode" id="txtPin">';
							 
							 for(var p=0;p<pincodes.length;p++)
							 {
								 inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
							 }
							 
							 inrHTML += '</select>';
							 
							 $('#pinCont').empty().html(inrHTML);
							 
						 }
						 else{
							
							var inrHTML = '';
							 
							 inrHTML += ' <input disabled="disabled" type="text" name="Pincode" value="'+tmp[8]+'"  id="txtPin"/>';
							
							 $('#pinCont').empty().html(inrHTML);
							 
							 
						 }
                        
                        // to fetch multiple pincodes -- end
                       
                    }
                }
				else if (object == "#pchkoutArea"){
                    whrid = $(divSelection).attr("id");
                    if(typeof whrid !='undefined')
                    {
                        // to fetch multiple pincodes -- start
                        var tmp = whrid.split('|');
                        
                        var pincodes = tmp[8].split(',');
                                  
						 if(pincodes.length > 1){
							 
							
							 var inrHTML = '';
							 inrHTML += '<select class="multpncd" name="pPincode" id="ptxtPin">';
							 
							 for(var p=0;p<pincodes.length;p++)
							 {
								 inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
							 }
							 
							 inrHTML += '</select>';
							 
							 $('#ppinCont').empty().html(inrHTML);
							 
						 }
						 else{
							
							var inrHTML = '';
							 
							 inrHTML += ' <input disabled="disabled" type="text" name="pPincode" value="'+tmp[8]+'"  id="ptxtPin"/>';
							
							 $('#ppinCont').empty().html(inrHTML);
							 
							 
						 }
                        
                        // to fetch multiple pincodes -- end
                       
                    }
                }
				else if (object == "#txtDstnPincode"){
					$('#txtDstnPincode').css("color","#424242");	
			$("#pincodeAuto").hide(); 
		}
		else if ( object == "#txtPickupDate"){
			$("#hdnPickupDate").val($(divSelection).attr("id"));
			$('#txtPickupDate').css("color","#424242");	
			$("#autoPickupdate").hide();
		}
else if (object =="#flcity" && $('#type_flag') && $('#type_flag').val()=='8192'){			
			if ($(divSelection).text()!=""){
				var selCity = $(divSelection).text();
			}
			else{
				var selCity = $("#flcity").val();
			}
			setData(object,selCity);			
			return true;
		} 
		else if ( object == "#txtBrand"){
			changeBrand('txtBrand',$(divSelection).text(),'autoBrand','otherBrandId');	
			$('#txtBrand').css("color","#424242");		
			$("#autoBrand").hide();
		}
		else if ( object == "#txtCountry"){			
			$("#autoCountry").hide();
			$('#txtCountry').css("color","#424242");
		}
		if (object == "#chkoutGroceryArea")
		{
			whrid = $(divSelection).attr("id");
			if(typeof whrid !='undefined')
			{
				var tmp = whrid.split('|');
				var pincodes = tmp[8].split(',');
			
				if(pincodes.length > 1)
				{
					var inrHTML = '';
					inrHTML += '<select class="multpncd" name="Pincode" id="txtPin">';
					for(var p=0;p<pincodes.length;p++)
					{
						inrHTML += '<option value="'+pincodes[p]+'">'+pincodes[p]+'</option>';
					}
					 
					inrHTML += '</select>';
					$('#pinCont').empty().html(inrHTML);
				}
				else
				{
					var inrHTML = '';
					inrHTML += ' <input disabled="disabled" type="text" name="Pincode" value="'+tmp[8]+'"  id="txtPin"/>';
					$('#pinCont').empty().html(inrHTML);
					  
				} 
				$('#gcyareaid').val(tmp[12]);
				$('#gcypanindia_areaid').val(tmp[13]);    
			}
		}
                
                if(object == '#tcareArea'){
                    var divselId = $(divSelection).attr("id");
                    if(typeof divselId != 'undefined'){
                            var pinarr = divselId.split('|');
                            $('#txtPincode').val(pinarr[8]);
                            $('#txtPincode').attr('readonly',true);
                            var pinStr = '';
                            if(pinarr[8].indexOf(",") > -1){
                                    pincodes = pinarr[8].split(',');
                                    pinStr = '<select class="multpncd" name="Pincode" id="txtPincode">';
                                    for(var i = 0;i < pincodes.length;i++){
                                            pinStr += '<option value="' + pincodes[i] + '">' + pincodes[i] + '</option>';
                                    }
                                    pinStr += '</select>';
                            }
                            else {
                                    pinStr = '<input class="finp" type="text" value="' + pinarr[8] + '" id="txtPincode" placeholder="e.g. 400064" readonly="readonly"/>';
                            }
                            $('#spnPincodes').html(pinStr);
                            $('#tAreaVal').val(pinarr[8]);
                    }
                }                
                
                if(object == '#mpolisArea'){
                    var divselId = $(divSelection).attr("id");
                    if(typeof divselId != 'undefined'){
                            var pinarr = divselId.split('|');
                            $('#txtPincode').val(pinarr[8]);
                            $('#txtPincode').attr('readonly',true);
                            var pinStr = '';
                            if(pinarr[8].indexOf(",") > -1){
                                    pincodes = pinarr[8].split(',');
                                    pinStr = '<select class="multpncd" name="Pincode" id="txtPincode">';
                                    for(var i = 0;i < pincodes.length;i++){
                                            pinStr += '<option value="' + pincodes[i] + '">' + pincodes[i] + '</option>';
                                    }
                                    pinStr += '</select>';
                            }
                            else {
                                    pinStr = '<input class="finp" type="text" value="' + pinarr[8] + '" id="txtPincode" placeholder="e.g. 400064" readonly="readonly"/>';
                            }
                            $('#spnPincodes').html(pinStr);
                            $('#mpLabAreaVal').val(pinarr[8]);
                    }
                }                
                
        
		if(object === "#what")
		{
			var whathere = $(divSelection).attr("id");
			if(typeof whathere == 'undefined'){
				gofun();
			}
            //$('#arBox').show();$('#arlnk').hide();$('#where').focus();
		}
		if (object == "#what") whatid = $(divSelection).attr("id");
		setData(object,$(divSelection).text().replace(' [+]',''), $(divSelection).attr("id"));
		if(object == '#ctime') {
			$('#timeauto1').hide();
		}
		if(object == '#purifierbrand') {
			$('#purifierbrandauto').hide();
		}
		if(object == '#purifiermodel') {
			$('#purifiermodelauto').hide();
		}
		if(object == '#cno') {
			$('#cnoauto').hide();
		}
		if(object == '#cbrand') {
		eval($(divSelection).attr("onclick"));
		}
		if(object == '#cmodel') {
			$('#modelauto').hide();
		}
		if(object == "#what")
		{
			$(".jauto").hide();
		}
		else
		{
			if(object != "#areaMenu"){
				divHide(Nextobject,divHolder); 
			}
			if(object != "#areaGrocery"){
				divHide(Nextobject,divHolder); 
			}
		}
        
		if(object == "#wcity")
		{
			return false;
		}
		if(whatid != undefined && object == "#what") 
		{
			//##	CONDITION HANDLED TO REDIRECT B2B AND ALL AREA CATEGORY TO RE-DIRECT TO ITS LISTING PAGE	
			//##	FORMAT  catid-type-aflg(area not mandatory flag)  Ex. 157784-1-1
			//##	SO IF type=1 AND aflg=1 THEN REDIRECT TO ITS CATEGORY LISTING PAGE

			/*var tmp = whatid.split('-');
			if(tmp[1]==1 && tmp[2]==0){
				return true;
			}
			else*/
			var tmp = whatid.split('|');
			$('#psearch').val('');
			$('#prid').val('');
			gofun(tmp);
		}
		else if(whatid == undefined && object == "#what") 
		{
			gofun('dongo');
		}
		else if(object == "#fvinp" && $(divSelection).hasClass("act")) 
		{
			
			var favarray = $(divSelection).attr("id").split('|');
			$(divSelection).removeClass("act");
			if(favarray[0] != '')
			{
				document.getElementById('fvinp').value = '';
				$('#fvinp').focus();
				if(favarray[14] != '' && favarray[14] == 0 && favarray[15] != '' && favarray[15] == 1)
				{
					upd_delfav(favarray[0],'edited','');
				}
				else
				{
					add_favorites(favarray[0],favarray[4],favarray[5],favarray[15]);
				}
				return;
			}
		}
		else if (object == "#city" && onloadFn=="National Search")
		{
			/*
			document.cookie = 'inweb_city='+$("#city").val().trim()+'; '+date+'; path=/; domain=' + cookieondomain;
			window.location = WEBROOT;
			return false;
			*/
			ngofun();
		}
		else if (object == "#where"){
			var aselct = $(divSelection).text();
			if(aselct != '' && aselct != null && aselct != undefined)
			{
				document.cookie = 'inweb_area='+$(divSelection).text().trim()+';expires=0;path=/;domain='+cookieondomain;
				$("#arlnk").text($(divSelection).text().trim());
				$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+$(divSelection).text().trim()+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
			}
			else
			{
				var auto_text = $("#where").val();
				if(auto_text != '' && auto_text != null && auto_text != undefined)
				{
					$("#where").val(trim(auto_text));
					$("#arlnk").text(trim(auto_text));
					$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+trim(auto_text)+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
					document.cookie = 'free_area='+trim(auto_text)+';expires=' + date.toGMTString() + ';path=/;domain='+cookieondomain;
				}
			}
			//if(keyCode != 13)
			//{
				whereid = $(divSelection).attr("id");
				if(typeof whereid !='undefined')
				{
					changeArea = true;
					var tmp = whereid.split('|');
					if(tmp[6] && tmp[7])
					{
						alat = tmp[6];
						alon = tmp[7];
						if(getCookie('sarea')!=$("#where").val())
						{
							if($("#where").val())
							{
								document.cookie = 'sarea='+$("#where").val()+';'+((IEbwsr == 1) ? '' : 'expires=0')+';path=/;domain='+cookieondomain;
							}
							document.cookie = 'slat='+alat+';'+((IEbwsr == 1) ? '' : 'expires=0')+';path=/;domain='+cookieondomain;
							document.cookie = 'slon='+alon+';'+((IEbwsr == 1) ? '' : 'expires=0')+';path=/;domain='+cookieondomain;
							$("#where").val($("#where").val());
							$("#arlnk").text($("#where").val());
							$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+$("#where").val()+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
						}
					}
				}
			//}
			if(typeof iwhat !='undefined' && iwhat.toLowerCase() != $("#what").val().toLowerCase())
			{
				gofun('',true);
			}
			else
			{
				gofun('do',true);
			}
		}			
		else if(onloadFn=="National Search") {
			gofun();
		}
		else if (object == '#mvarea' && divHolder=='#mvareadd'){			
			setMovieArea();
			return false;
		}				
		return true;
	} else if (keyCode == 38 || keyCode == 40) {
		if(object == "#areaMenu" || object == "#chkoutArea" || object == "#pchkoutArea"  || object == "#areaGrocery" || object == "#chkoutGroceryArea"){
			if(keyCode == 38){
				if ($(".slider-vertical").slider("value")<100){
					$(".slider-vertical").slider("value",$(".slider-vertical").slider("value")+3);
				}
			}
			if(keyCode == 40){
				if ($(".slider-vertical").slider("value")>0){
					$(".slider-vertical").slider("value",$(".slider-vertical").slider("value")-3);
				}
			}
			
		}
		
		var li_Index="-1";
		$(divHolder+' ul li a').each(function(index,data) {
			if($(data).hasClass("act")==true) {
				li_Index = index;
			}
		});
		if(keyCode == 38 && li_Index == "-1")  // 38 = KeyUp
			li_Index = $(divHolder+' ul li a').length;
		if (keyCode == 38) {
			if (li_Index==0)
				li_Index = $(divHolder+' ul li a').length-1;
			else
				li_Index--;
		} else {
			if (($(divHolder+' ul li a').length-1)==li_Index)
				li_Index = 0;
			else
				li_Index++;
		}
		$(divHolder+' ul li a').each(function(index,data) {
			if (index  == li_Index) {
				autoValue = $(this).text().replace(' [+]','');
				if(object == "#what") whatid = $(this).attr("id").replace(' [+]','');
				$(this).addClass("act");
				if(object == "#fvinp")
				{
					$(this).find('.fvlnk').removeClass("dn");
					$(this).find('.cmpwth').attr("style","width:78%;display:block");
				}
			}
			else
			{
				$(this).removeClass("act");
				if(object == "#fvinp")
				{
					$(this).find('.fvlnk').addClass("dn");
					$(this).find('.cmpwth').attr("style","");;
				}
			}
		});
		
		if(object=="#txtArea" || object=="#txtCountry" || object=="#cbrand" || object=="#cmodel" || object=="#ctime"){
			if (li_Index>=0 && $(divHolder+' div.slider-wrap').length){				
			var totHeight = $(divHolder+' div.sct').height();
			var liTotHeight = $(divHolder+' div.sct ul li').height();				 
				if (parseInt(liTotHeight*li_Index) < parseInt(totHeight/2)){
				relativeHeight = Math.floor((liTotHeight*li_Index* 100)/totHeight);
				}
				else {
					relativeHeight = Math.ceil((((liTotHeight*li_Index)+liTotHeight)* 100)/totHeight);
				}
				var sliderVal = 100 - relativeHeight;
				$(".slider-vertical").slider("value",sliderVal);			
			}			
		}
		
		return true;
	 }
	 else {
		 return false;
	 }
};
JSONS = function(URL,parameter,divHolder) {
	
	if (JSONObject != null)	JSONObject.abort();
	if(auto == true) {
            clearTimeout(timeauto);
            timeauto = setTimeout('timout()',250);
            timeoutURL=URL;
            timeoutparameter=parameter;
            timeoutdivHolder=divHolder;
            return false;
        }
     auto = true;
    JSONObject = $.getJSON(WEBROOT + URL, parameter, function(data) {
		if(parameter['cases'] == "what") {
			cachearr[parameter['city'].toUpperCase()+' '+parameter['search'].toUpperCase()] = data;
		}
		if(data == null) {
			divHide('',divHolder);
			return false;
		}
		if(data.results == null) {
			divHide('',divHolder);
			return false;
		}
		if(data == undefined || data.results == null) {
			divHide('',divHolder);
			return false;
		}
		if(!data.results.length){
			if(divHolder=="#areaAuto")
			$(".fauto").hide();
			else
			divHide('',divHolder);
			return false;
		}
		
		
		
		var autoData = '<ul>';
		if(parameter['search'] != "@A@" && parameter['cases'] != "what"  && parameter['cases'] != "where" && parameter['cases'] != "areaMenu" && parameter['cases'] != "chkoutArea" && parameter['cases'] != "pchkoutArea" && parameter['cases'] != "areaGrocery" && parameter['cases'] != "chkoutGroceryArea" && parameter['cases'] != 'tcareArea' && parameter['cases'] != 'mpolisArea')
		autoValue = data.results[0]['text'];
		
		var oval  = '';
		var rate  = '';
		var ucity = '';
		var uarea = '';
		var ulat  = '';
		var ulon  = '';
        var zipc  = '';
		$.each(data.results, function(i,obj) 
		{ 
			oval = (onloadFn == "fav") ? obj['mname']: obj['oval'];
			if(obj['rate']!=null)
				rate = addRating(obj['rate']);
			if(obj['city']!=null)
				ucity = obj['city'];
			if(obj['areaname']!=null)
				uarea = obj['areaname'];
			if(obj['lat']!=null)
				ulat = obj['lat'];
			if(obj['lon']!=null)
				ulon = obj['lon'];
			if(obj['pincode']!=null)
				zipc = obj['pincode'];
			if(obj['areaid']!=null)
				areaid = obj['areaid'];	
			if(obj['panindia_areaid']!=null)
				panindia_areaid = obj['panindia_areaid'];		
			if (obj['main_area']!=null){ //pickup service area
				uarea = obj['main_area'];
				obj['value'] = obj['areaname_display'];				
			}
			if (divHolder=="#areaAuto") {
				if(obj['broader_pincode']!=null){
					zipc = obj['broader_pincode'];
				}
				else if(obj['pincode']!=null) {
					zipc = obj['pincode'];
				}
			}
			if(oval && oval != "")
			{
				oval = oval.replace("'","&#39");
			}
			
			if(rate)
			{
				
				if(onloadFn == "fav")
				{
					autoData +=  "<li><a id='"+obj['id']+"|"+obj['type']+"|"+(obj['aflg']?obj['aflg']:0)+"|"+ucity+"|"+uarea+"|"+oval+"|"+ulat+"|"+ulon+"|"+zipc+"|"+obj['asflg']+"|"+obj['enflg']+"|"+obj['enid']+"|"+obj['areaid']+"|"+obj['panindia_areaid']+"|"+(obj['active']?obj['active']:0)+"|"+(obj['fav']?obj['fav']:0)+"' href='javascript:void(0);'><span class='cmpwth'>"+ obj['value'] + rate + (obj['info']? " "+obj['info']:'')+"</span><span class='fvlnk dn'>"+((obj['fav'] && obj['fav'] == 1) ? "<span class='fvico'></span><em>Added to Favorites</em></span>" : "<span class='fvic'></span><em>Add to Favorites</em></span>")+"</a></li>";
				}
				else
				{
					autoData += "<li><a id='"+obj['id']+"|"+obj['type']+"|"+(obj['aflg']?obj['aflg']:0)+"|"+ucity+"|"+uarea+"|"+oval+"|"+ulat+"|"+ulon+"|"+zipc+"|"+obj['asflg']+"|"+obj['enflg']+"|"+obj['enid']+"|"+obj['areaid']+"|"+obj['panindia_areaid']+"' href='javascript:void(0);'>"+ obj['value'] + rate + (obj['info']? " "+obj['info']:'')+"</a></li>";
				}
			}
			else
			{
				if(onloadFn == "fav")
				{
					autoData += "<li><a id='"+obj['id']+"|"+obj['type']+"|"+(obj['aflg']?obj['aflg']:0)+"|"+ucity+"|"+uarea+"|"+oval+"|"+ulat+"|"+ulon+"|"+zipc+"|"+obj['asflg']+"|"+obj['enflg']+"|"+obj['enid']+"|"+obj['areaid']+"|"+obj['panindia_areaid']+"|"+(obj['active']?obj['active']:0)+"|"+(obj['fav']?obj['fav']:0)+"' href='javascript:void(0);'><span class='cmpwth'>"+ obj['value'] + (obj['info']? " "+obj['info']:'')+"</span><span class='fvlnk dn'>"+((obj['fav'] && obj['fav'] == 1) ? "<span class='fvico'></span><em>Added to Favorites</em></span>" : "<span class='fvic'></span><em>Add to Favorites</em></span>")+"</a></li>";
				}
				else
				{
					autoData += "<li><a id='"+obj['id']+"|"+obj['type']+"|"+(obj['aflg']?obj['aflg']:0)+"|"+ucity+"|"+uarea+"|"+oval+"|"+ulat+"|"+ulon+"|"+zipc+"|"+obj['asflg']+"|"+obj['enflg']+"|"+obj['enid']+"|"+obj['areaid']+"|"+obj['panindia_areaid']+"' href='javascript:void(0);'>"+ obj['value'] + (obj['info']? " "+obj['info']:'')+"</a></li>";
				}
			}
		});

		autoData += "</ul>";		

		$(divHolder).html(autoData);
		if(onloadFn == "fav"){
		$('#favauto ul li a').hover(
			function() {
				$('.fvlnk', this).show();
			},
			function() {
				$('.fvlnk', this).hide();
			});
          }     
		if(divHolder=="#cauto")
			$('#cauto ul li a').mousedown(function(e){setData("#city",$(this).text()); });
		else if(divHolder=="#nca")
			$('#nca ul li a').mousedown(function(e){setData("#city",$(this).text());});
		else if(divHolder=="#fauto")
			$('#fauto ul li a').mousedown(function(e){setData("#flcity",$(this).text());divHide("","");});
		else if(divHolder=="#wauto")
			$('#wauto ul li a').mousedown(function(e){setData("#wcity",$(this).text());divHide("","");});
        else if(divHolder=="#area_Suggest_popup")
			$('#area_Suggest_popup ul li a').mousedown(function(event){handleKeys("key-13","#areaMenu","#go","#area_Suggest_popup",this)});
        else if(divHolder=="#chkoutAuto")
			$('#chkoutAuto ul li a').mousedown(function(event){handleKeys("key-13","#chkoutArea","#go","#chkoutAuto",this)});
        else if(divHolder=="#pchkoutAuto")
			$('#pchkoutAuto ul li a').mousedown(function(event){handleKeys("key-13","#pchkoutArea","#go","#pchkoutAuto",this)});
		else if(divHolder=="#area_Grocery_Suggest_popup")
			$('#area_Grocery_Suggest_popup ul li a').mousedown(function(event){handleKeys("key-13","#areaGrocery","#go","#area_Grocery_Suggest_popup",this)});
		else if(divHolder=="#chkoutGroceryAuto")
			$('#chkoutGroceryAuto ul li a').mousedown(function(event){handleKeys("key-13","#chkoutGroceryArea","#go","#chkoutGroceryAuto",this)});				
		else if(divHolder=="#sauto")
			$('#sauto ul li a').mousedown(function(event){handleKeys("key-13","#what","#where","#sauto",this);avoidneararea = 1;return false;});
		else if(divHolder=="#favauto")
			$('#favauto ul li a').mousedown(function(event){$(this).addClass("act");handleKeys("key-13","#fvinp","","#favauto",this);return false;});
		else if(divHolder=="#aauto")
			$('#aauto ul li a').mousedown(function(event){handleKeys("key-13","#where","#go","#aauto",this)});
		else if(divHolder=="#sbd")
			$('#sbd ul li a').mousedown(function(event){handleKeys("key-13","#sortbydist","#go","#sbd",this)});
		else if(divHolder=="#mvareadd")
			$('#mvareadd ul li a').mousedown(function(event){handleKeys("key-13","#mvarea","#go","#mvareadd",this)});
		else if(divHolder=="#snfaauto")
			$('#snfaauto ul li a').mousedown(function(event){handleKeys("key-13","#snfarea","#snfname","#snfaauto",this)});
		else if(divHolder == '#tcareAuto')  
			   $('#tcareAuto ul li a').mousedown(function(event){handleKeys("key-13","#tcareArea","#go","#tcareAuto",this)}); 
		else if(divHolder == '#mpolisAuto')  
			   $('#mpolisAuto ul li a').mousedown(function(event){handleKeys("key-13","#mpolisArea","#go","#mpolisAuto",this)}); 
		else if(divHolder=="#areaAuto")
			$('#areaAuto ul li a').mousedown(function(event){handleKeys("key-13","#txtArea","txtPin","#areaAuto",this)});
		else if(divHolder=="#pincodeAuto")
			$('#pincodeAuto ul li a').mousedown(function(event){handleKeys("key-13","#txtDstnPincode","","#pincodeAuto",this)});		
		else if(divHolder == '#sauto_a')  
		    $('#sauto_a ul li a').mousedown(function(event){handleKeys("key-13","#where_a","","#sauto_a",this)}); 
		else if(divHolder == '#sauto_b')  
			$('#sauto_b ul li a').mousedown(function(event){handleKeys("key-13","#where_b","","#sauto_b",this)}); 		
		if(parameter['cases'] == "dlarea") {
			//var divMenu = document.getElementById('arWrapper');
			//divMenu.fleXcroll.updateScrollBars();
			//$("#arWrapper").show();
			//fleXenv.fleXcrollMain("arWrapper");
			/*if($('#arWrapper').length)
			{
		
				setSlider($('#arWrapper'));
			}*/
			
		}
		
               
		
		$(divHolder).show();
		
               
		
		if(divHolder == "#area_Suggest_popup"){
			
			setSlider($('#area_Suggest_popup'));
			
			if($('#area_Suggest_popup div.sct').height() <= 300){
				$("#area_Suggest_popup").height($('#area_Suggest_popup div.sct').height());
			}
			else{
				$("#area_Suggest_popup").height(300);
			}
		}
		
		if(divHolder == "#chkoutAuto" || divHolder == "#areaAuto" || divHolder == "#pchkoutAuto"){
		
			setSlider($(divHolder));
                        
                        
			
			if($(divHolder+' div.sct').height() <= 300){
				$(divHolder).height($(divHolder+' div.sct').height());
			}
			else{
				$(divHolder).height(300);
			}
		}
		if(divHolder == "#area_Grocery_Suggest_popup")
		{
			setSlider($('#area_Grocery_Suggest_popup'));
			if($('#area_Grocery_Suggest_popup div.sct').height() <= 300){
				$("#area_Grocery_Suggest_popup").height($('#area_Grocery_Suggest_popup div.sct').height());
			}
			else{
				$("#area_Grocery_Suggest_popup").height(300);
			}
		}
		if(divHolder == "#chkoutGroceryAuto")
		{
			setSlider($('#chkoutGroceryAuto'));
			if($('div.sct').height() <= 300){
				$(".scroll-pane").height($('div.sct').height());
			}
			else{
				$(".scroll-pane").height(300);
			}
		}
		
		if(divHolder == "#chkoutAuto")
		{
			setSlider($('#chkoutAuto'));
			if($('div.sct').height() <= 300){
				$(".scroll-pane").height($('div.sct').height());
			}
			else{
				$(".scroll-pane").height(300);
			}
		}

            if(divHolder == '#tcareAuto'){
                    setSlider($('#tcareAuto'));
			if($('#tcareAuto div.sct').height() <= 300){
                $("#tcareAuto").height($('#tcareAuto div.sct').height());
			}
			else{
                        $("#tcareAuto").height(300);
			}
		}
		
            if(divHolder == '#mpolisAuto'){
                setSlider($('#mpolisAuto'));
		if($('#mpolisAuto div.sct').height() <= 300){
                $("#mpolisAuto").height($('#mpolisAuto div.sct').height());
			}
			else{
                        $("#mpolisAuto").height(300);
			}
		}

		
		
	});
}
JSONcache = function(data,parameter,divHolder) {
		if (JSONObject != null)	JSONObject.abort();
		if(data.results == null) {
			divHide('',divHolder);
			return false;
		}
		if(data == undefined) {
			divHide('',divHolder);
			return false;
		}
		if(!data.results.length){
			divHide('',divHolder);
			return false;
		}
		var autoData = '<ul>';
		if(parameter['search'] != "@A@" && parameter['cases'] != "what"  && parameter['cases'] != "where" && parameter['cases'] != "areaMenu" && parameter['cases'] != "chkoutArea" && parameter['cases'] != "pchkoutArea" && parameter['cases'] != "areaGrocery" && parameter['cases'] != "chkoutGroceryArea" && parameter['cases'] != 'tcareArea' && parameter['cases'] != 'mpolisArea')
			autoValue = data.results[0]['text'];
		$.each(data.results, function(i,obj) {
			autoData += "<li><a id='"+obj['id']+"-"+obj['type']+"' href='javascript:void(0);'>"+ obj['value'] + (obj['info']? " "+obj['info']:'')+ "</a></li>";
		});
		autoData += "</ul>";
		$(divHolder).html(autoData);
		if(divHolder=="#cauto")
			$('#cauto ul li a').mousedown(function(e){setData("#city",$(this).text());});
		else if(divHolder=="#nca")
			$('#nca ul li a').mousedown(function(e){setData("#city",$(this).text());});
		else if(divHolder=="#fauto")
			$('#fauto ul li a').mousedown(function(e){setData("#flcity",$(this).text());divHide("","");});
		else if(divHolder=="#wauto")
			$('#wauto ul li a').mousedown(function(e){setData("#wcity",$(this).text());divHide("","");});
        else if(divHolder=="#area_Suggest_popup")
			$('#area_Suggest_popup ul li a').mousedown(function(event){handleKeys("key-13","#areaMenu","#go","#area_Suggest_popup",this)});
        else if(divHolder=="#chkoutAuto")
			$('#chkoutAuto ul li a').mousedown(function(event){handleKeys("key-13","#chkoutArea","#go","#chkoutAuto",this)});
        else if(divHolder=="#pchkoutAuto")
			$('#pchkoutAuto ul li a').mousedown(function(event){handleKeys("key-13","#pchkoutArea","#go","#pchkoutAuto",this)});
		else if(divHolder=="#area_Grocery_Suggest_popup")
			$('#area_Grocery_Suggest_popup ul li a').mousedown(function(event){handleKeys("key-13","#areaGrocery","#go","#area_Grocery_Suggest_popup",this)});
		else if(divHolder=="#chkoutGroceryAuto")
			$('#chkoutGroceryAuto ul li a').mousedown(function(event){handleKeys("key-13","#chkoutGroceryArea","#go","#chkoutGroceryAuto",this)});				
		else if(divHolder=="#sauto")
			$('#sauto ul li a').mousedown(function(event){handleKeys("key-13","#what","#where","#sauto",this);avoidneararea = 1;return false;});
		else if(divHolder=="#favauto")
			$('#favauto ul li a').mousedown(function(event){$(this).addClass("act");handleKeys("key-13","#fvinp","","#favauto",this);return false;});
		else if(divHolder=="#aauto")
			$('#aauto ul li a').mousedown(function(event){handleKeys("key-13","#where","#go","#aauto",this)});
		else if(divHolder=="#sbd")
			$('#sbd ul li a').mousedown(function(event){handleKeys("key-13","#sortbydist","#go","#sbd",this)});
		else if(divHolder=="#mvareadd")
			$('#mvareadd ul li a').mousedown(function(event){handleKeys("key-13","#mvarea","#go","#mvareadd",this)});
		else if(divHolder=="#snfaauto")
			$('#snfaauto ul li a').mousedown(function(event){handleKeys("key-13","#snfarea","#snfname","#snfaauto",this)});
                else if(divHolder == '#tcareAuto')  
                       $('#tcareAuto ul li a').mousedown(function(event){handleKeys("key-13","#tcareArea","#go","#tcareAuto",this)}); 
                else if(divHolder == '#mpolisAuto')  
                       $('#mpolisAuto ul li a').mousedown(function(event){handleKeys("key-13","#mpolisArea","#go","#mpolisAuto",this)}); 
		else if(divHolder=="#areaAuto")
			$('#areaAuto ul li a').mousedown(function(event){handleKeys("key-13","#txtArea","txtPin","#areaAuto",this)});	
		else if(divHolder=="#sauto_a")
			$('#sauto_a ul li a').mousedown(function(event){handleKeys("key-13","#where_a","","#sauto_a",this)});			
		else if(divHolder=="#sauto_b")
			$('#sauto_b ul li a').mousedown(function(event){handleKeys("key-13","#where_b","","#sauto_b",this)});	
		$(divHolder).show();
}

function addRating(rate,type)
{
	if(!type)
		type = 'ms';
	
	if(rate=='0.0') return;
	var tmp = rate.toString().split('.');
	var star= '<span class="stars_m">';
	for(i=0;i<5;i++)
	{
		if(i<tmp[0])
			star += '<span class="ms10"></span>';
		else if(i==tmp[0] && tmp[1])
			star += '<span class="ms'+tmp[1]+'"></span>';
		else
			star += '<span class="ms0"></span>';
	}
	star += '</span>';
	return star;
}

function addRating_type(rate,type)
{
	if(!type)
		type = 'ms';
	
	if(rate=='0.0') return;
	var tmp = rate.toString().split('.');
	var star= '<span class="stars_m">';
	for(i=0;i<5;i++)
	{
		if(i<tmp[0])
			star += '<span class="'+type+'10"></span>';
		else if(i==tmp[0] && tmp[1])
			star += '<span class="'+type+tmp[1]+'"></span>';
		else
			star += '<span class="'+type+'0"></span>';
	}
	star += '</span>';
	return star;
}/*common updated star new design*/

function timout() {
    auto=false;
    JSONS(timeoutURL,timeoutparameter,timeoutdivHolder);
    timeauto = null;
}
var auto = true;var timeoutURL= "";var timeoutparameter= "";var timeoutdivHolder= "";var timeauto= "";


/* Idx JS */ 

var stat = true;var url;var bannerAjaxObj;
var touchy=(navigator.userAgent).indexOf("CPU OS 5_0")==-1 && ('ontouchstart' in document.documentElement)?true:false;
var valcheck = 0;
var feedid = "";
var ajxHTML5 = true;
var tickval = 1000000;
var addnewval = 0;
var hidereview = 0;
var change = 0;

//home page views
function homepageview()
{
	var now = new Date();
	var cur_time = now.getTime();
	var c = ($("#city").val() != '') ? $("#city").val() : autoValue;
	$.getJSON(WEBROOT+"homepageview.php", {city: c, onloadfn : onloadFn, date_t : cur_time }, function(data) {
		
	});
}


// Get Data for - City, what, Where
function getData()
{
	if (onloadFn == "contest") 
	{
		$("#what").val(defcontesttxt);
		$("#what").addClass("grey");
		return false;
	}
	
	var c = ($("#city").val() != '') ? $("#city").val() : autoValue;
	
	$("#what").val('Search for anything, anywhere in India');
	$("#what").addClass("grey");
	if(getCookie('scity') && (c == getCookie('scity')) && ($("#where").val() == "" || $("#where").val() == null || $("#where").val().substr(0,4) == 'e.g.'))
	{
		if(getCookie('inweb_area') && getCookie('inweb_area') != '' && getCookie('inweb_area') != null && getCookie('inweb_area').substr(0,4) != 'e.g.')
		{
			var wc = getCookie('inweb_area').replace(/\+/g," ");
			$('#where').val(wc);
			alat = '';
			alon = '';
		}		
		else if(getCookie('sarea'))
		{
			var wc = getCookie('sarea');
			$('#where').val(wc);
			alat = getCookie('slat');
			alon = getCookie('slon');
		}
	}
	/*$.getJSON(WEBROOT+"ajxmain.php", {city: c,cases: 'suggestion' }, function(data) {
		if (data == null) return false;
		$("#what").val(data.results[0].category);
		$("#what").addClass("grey");

		var a_cook = getCookie('inweb_area');
		if($("#city").val()!="National Search" && (typeof a_cook == "undefined" || a_cook == "" || a_cook.toLowerCase().indexOf('e.g.') != -1))
		{
			document.cookie = 'inweb_area='+data.results[0].area+';expires=0; path=/; domain=' + cookieondomain;
		}

		if(c!=getCookie('scity'))
		{
			if(!$("#where").val().length)
			{
				$("#where").val(data.results[0].area);
				if(data.results[0].area != ''){
					$('#arlnk').text(data.results[0].area);
					$('#arlnk').removeClass('grey');
				}
			}
		}
		else
		{
			if($("#where").val() == "" || $("#where").val() == null || $("#where").val().substr(0,4) == 'e.g.')
			{
				if(getCookie('inweb_area') != '' && getCookie('inweb_area') != null && getCookie('inweb_area').substr(0,4) != 'e.g.')
				{
					var wc = getCookie('inweb_area').replace(/\+/g," ");
					$('#where').val(wc);
					$('#where').removeClass();
					$('#where').addClass('jsin');
					if(wc != ''){
						$('#arlnk').text(wc);
						$('#arlnk').removeClass('grey');
					}
					alat = '';
					alon = '';
				}		
				else if(getCookie('sarea'))
				{
					var wc = getCookie('sarea');
					$('#where').val(wc);
					$('#where').removeClass();
					$('#where').addClass('jsin');
					if(wc != ''){
						$('#arlnk').text(wc);
						$('#arlnk').removeClass('grey');
					}
					alat = getCookie('slat');
					alon = getCookie('slon');
				}
				else
				{
					$("#where").val(data.results[0].area);
					if(data.results[0].area != ''){
						$('#arlnk').text(data.results[0].area);
						$('#arlnk').removeClass('grey');
					}
				}
			}
		}

		if($("#where").val().indexOf('e.g.') != -1)
			document.getElementById('where').className = 'grey';
	});*/
	
	if (onloadFn != "Index" && onloadFn != "National Search" && onloadFn != "fbIndex") return false;
	$("#ps_data").html("");
    poppage = 1;
	fn_Banner();
	
	/*if(onloadFn != "fbIndex")
	{
		setTimeout("ratingFeed()",1000);
	}*/
}

// ### Harshada - Code Start ###
function testing()
{
	var catidcall = document.codeverifier.catiddet.value;
	//var vcode  = document.codeverifier.verifycodeval.value;
	var vcodelft = $("#vcodelft").val();
	var vcodert = $("#vcodert").val();
	var vcode = vcodelft+'-'+vcodert;
	
	var illegalc = /^[A-Za-z0-9]+-[A-Za-z0-9]+$/;
	if (!vcode.match(illegalc))
	{
		alert("Enter valid characters in verification code");	
		return false;
	}
	
	$.ajax({url:WEBROOT+"checkdb.php?vcode="+vcode+"&catid="+catidcall,async:false,success:function(result){
		if(result == "" && result.length==0)
		{
			document.getElementById('testchange').style.display = "none";
			document.getElementById('errormsg').style.display = "block";
			openDiv('mob_verify');
			$("#vcodelft").val('');
			$("#vcodert").val('');
			$("#vcodelft").focus();
			return false;
		}
		else
		{	
		params = result.split("|@|");
					
		frm_url  = WEBROOT+'os_index.php?city='+escape(params[0])+'&parentid='+escape(params[1])+'&docid='+escape(params[1]);
					
		$('<form action="'+frm_url+'" method="POST">' + 
			'<input type="hidden" name="checksum" value="' + params[2] + '">' +
			'<input type="hidden" name="wovc" value="' + params[4] + '">' +
			'</form>').appendTo($(document.body)).submit();	
			return false;
        }
	}});
}
// ### Harshada - Code End ###

function funcomp()
{	
	var caler = document.sender.mobilechecker.value;
	var mobile = caler.substring(0,10);
	var catidcall = document.sender.catidcall.value;
	
	if (trim(mobile) != "")
	{
		document.getElementById('loading').style.display = "block";
		$.ajax({url:WEBROOT+"ajaxsmsverify.php?mobile="+mobile+"&catid="+catidcall,async:false, success:function(result){
		
		if(result== 2)
		{
			document.getElementById('loading').style.display = "none";
			openDiv('nomobile');
		}
		if(result== 1)
		{
			document.getElementById('loading').style.display = "none";
			openDiv('mob_verify');
			
		}
		if(result== 0)
		{
			document.getElementById('loading').style.display = "none";
			openDiv('failed_attempt');
		}
		}});
	}
	else
	{
		document.getElementById('loading').style.display = "none";
		openDiv('nomobile');
	}
}

 
function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

//################################################harshada###########################################

function ratingFeed(){

	/*if(onloadFn == "Search" || onloadFn == 'detailsPage' || onloadFn == 'National Search')
	{
		ajxHTML5 = false;
		hidereview = 1;
	}*/

	var cityVal = getCookie_homepage('inweb_city');

	if (onloadFn == "National Search") 
		cityVal = "National Search";
	else if (cityVal == "" ) 
		cityVal= "Mumbai";

	if (ajxHTML5 == true)
	{
		try
		{
			var source = new EventSource('functions/idxReview.php');
			source.onmessage = function(e) {
				feed(e.data);
			};
		}catch(e)
		{
			ajxHTML5 = false;
		}
		
	}
	else
	{
		if($('#fct'))
		{
			if(cityVal == "Delhi++NCR")
				cityVal = "Delhi";
			
			$.get(WEBROOT+"functions/idxReview.php", {cases: 'reviewPush', city: cityVal, hidereview: hidereview }, function(data) {

			if (data.indexOf("data: ")!=-1) 
			{
				var tmp = data.split("data: ");
				feed(tmp[1]);
			}
			else
			{
				feed(data);
			}

			endtime=(new Date()).getTime();
			if((endtime-starttime)/1000 < 60)
				setTimeout("ratingFeed()",10000);
			});
		}
	}
}

try
{
	if(window.HTMLCanvasElement) {
		ajxHTML5 = true;
	}
	/*Server Event Start*/
	var http = require('http');
	var sys = require('sys');
	var fs = require('fs');

	http.createServer(function(req, res) {
	  debugHeaders(req);

	  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
		if (req.url == '/events') {
		  sendSSE(req, res);
		} else {
		  res.writeHead(404);
		  res.end();
		}
	  } else {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(fs.readFileSync(__dirname + '/sse-node.html'));
		res.end();
	  }
	}).listen(1000);

	function sendSSE(req, res) {
	  res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	  });

	  var id = (new Date()).toLocaleTimeString();

	  setInterval(function() {
		constructSSE(res, id, (new Date()).toLocaleTimeString());
	  }, 1000);

	  constructSSE(res, id, (new Date()).toLocaleTimeString());
	  //res.end();
	}

	function constructSSE(res, id, data) {
	  res.write('id: ' + id + '\n');
	  res.write("data: " + data + '\n\n');
	}

	function debugHeaders(req) {
	  sys.puts('URL: ' + req.url);
	  for (var key in req.headers) {
		sys.puts(key + ': ' + req.headers[key]);
	  }
	  sys.puts('\n\n');
	}
/*Server Event End*/
}
catch(e)
{
	ajxHTML5 = false;
}

function feed(data)
{
	if(onloadFn == "National Search") return false;
	if (data == undefined) return false;
	if (data == "") return false;
	var bfeed = data.split("|@|");
	var data = bfeed[0];
	tickval = bfeed[1];
	tickval = tickval*1;
	addnewval = tickval - (intcnt*1);
	intcnt = tickval;
	myCounter.add(addnewval);

	//if(onloadFn == "National Search") return false;

	if(data)
	{
	var feed = data.split("!@!");
	
	if (feed[0] == "" || feed[0] == 0) 
	{
		var feedcan = 1;
	}
	else
	{
	
		/*Feed Rating*/
		var milion = feed[0]/1000000;
		milion = Math.round(milion);
		var amount = feed[0];
		amount = amount.split("").reverse();
		var output = "";
		var outputHtml = "";
		for ( var i = 0; i <= amount.length-1; i++ ){
			output = amount[i] + output;
			outputHtml = '<span class="blue_box">'+amount[i]+'</span>'+outputHtml;
			if ((i+1) % 3 == 0 && (amount.length-1) !== i)
			{	
				output = ',' + output;
				outputHtml = '<span class="comma"></span>'+outputHtml;
			}
			
		}
		outputHtml = outputHtml+'<span class="font20">Reviews &amp; Ratings</span>';
		$("#feedmillion").html(milion);
		$("#plus_rating").html(outputHtml);
	}
	
	if (onloadFn != "Index" && onloadFn != "National Search" && onloadFn != "latest_Reviews_Ratings") return false;

	/* Feed Rating*/
	
	if (feedid == "")
	{
		feedid  = parseInt($(".jrev:first").attr("id"));
	}

	if (feed[8] == feedid) return false;
	feedid=parseInt(feed[8]);

	$(".jrev:last").fadeOut('slow',function(){
		
		var tmp = '<section class="jrev"><a onclick = "_ct(\'idxrev\',\'hmpg\');" rel="nofollow" id="'+feedid+'" href="'+feed[6]+'"><span class="rd"><span class="rdh" title="'+feed[2]+' in '+feed[9]+'">'+feed[2]+', '+feed[9]+'</span></span>	<section class="OvrallRatings"><span>Rated</span><span class="stars_m">';

		for(i=1;i<=feed[5];i++)
		{
			tmp += '<span class="ms10"></span>';
		}
		
		for(i=feed[5];i<=4;i++)
		{
			tmp += '<span class="ms0"></span>';
		}

		tmp += '</span><span>By '+feed[3]+'</span>	<span class="time">at '+feed[7]+'</span></section></a></section>';

		$(".jrev:first").before(tmp);
		$(".jrev:first").attr("style","display:none");

		$(".jrev:first").fadeIn('slow',function(){
			$(".jrev:last").remove();
		});
	
		return false;
	});
	}

}
function fn_Banner(id,rowCnt,table,vertical,fromc)
{
	//var clearflag = false;
	var c = (onloadFn == 'National Search') ? 'National Search' : $("#city").val().trim();
	var whr = encodeURIComponent($("#where").val().trim());
	if (whr.substr(0,4)=='e.g.') {
		var where = getCookie('sarea') ? getCookie('sarea') : '';
	} else {
		var where = '';
		if(whr)
			where = whr;
		else if(getCookie('inweb_area'))
			where = getCookie('inweb_area');
		else if(getCookie('sarea'))
			where = getCookie('sarea');
		else
			where = '';
	}
	if(fromc && fromc == 1)
	{
		where = '';
	}
	var url = "autosuggest.php?cases=popular&strtlmt="+rowCnt+"&city="+c+"&table="+table+"&where="+where+"&scity="+getCookie('scity');
	
	//var url = "autosuggest.php?cases=popular&strtlmt="+rowCnt+"&city="+c+"&table="+table+"&where="+encodeURIComponent($("#where").val().trim());
	if (id=="-1")
	{
		url += "&casename=tmp,tmp1,0-24&case=tmp,tmp1,cat&id=1";
       //clearflag = true;
    }
	else if (id)
	{
		url += "&casename=tmp,tmp1,"+rowCnt+"-24&case=tmp,tmp1,cat&id="+id;
	}
	
	if (id == undefined || id == "undefined" || id == "" || id == "-1")
	{
		id = 1;
	}

	if (vertical == undefined || vertical == "undefined" || vertical == "")
	{
		vertical = 0;
	}

	if (rowCnt == undefined || rowCnt == "undefined" || rowCnt == "")
	{
		rowCnt = 0;
	}

	if (bannerAjaxObj)
	{
		bannerAjaxObj.abort();
	}
			
	var p = '';
		
	if(table == 'b2b')
	{
		p = 'b2b'
		$('#b2c').click(function() { fn_Banner('','','b2c');_ct('popular_search_categories','hmpg');});		
		$('#b2b').attr('onclick','').unbind('click');
		$('#b2c').removeClass();
		$('#b2b').addClass('jsel');
	}
	else
	{
		p = 'psc';
		table = 'b2c';
		$('#b2c').attr('onclick','').unbind('click');
		$('#b2b').click(function() { fn_Banner('-1','','b2b');_ct('popular_b2b_categories','hmpg');});
		$('#b2c').addClass('jsel');
		$('#b2b').removeClass();
	}
	
	$("#pand").removeClass();
	$("#andr").hide();
	$("#hotkeys").show();
	
	//openDiv('jldr');
	bannerAjaxObj = $.get(WEBROOT+url, {}, function(data) {
		if(data != '')
		{
			change = 1;
			var d = eval('(' + data + ')');
			var i;
			var j;
			var hkdisp = 1;

			/* Hot Keys Data */
			var html = '';			
			var bnhtml = '';			
			var tophkhtml =  '';
			var bothkhtml =  '';
			for(i=0; i<3; i++)
			{
				var inhkc = d.results[i].length ;
				for(j=0; j < inhkc; j++)
				{
					var c = p + '_' + d.results[i][j]['vdname'];
					var assoc = d.results[i][j]['assoc'];
					var vid = d.results[i][j]['vid'];
					var targetblk = '';
					
					/*if(assoc == 3) { targetblk = "target='_blank'";} 
					if(vid == 223) { targetblk = "";}*/ 
					if(i == 0)
					{
						tophkhtml += '<li>';
							tophkhtml += '<a class="block" href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">';
								tophkhtml += '<span class="'+d.results[i][j]['vicon']+'"></span>';
							tophkhtml += '</a>';
							tophkhtml += '<a class="nm" href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">'+d.results[i][j]['vdname']+'</a>';
						tophkhtml += '</li>';
					}
					else if(hkdisp > 18)
					{
						bothkhtml += '<li>';
							bothkhtml += '<a class="block" href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">';
								bothkhtml += '<span class="'+d.results[i][j]['vicon']+'"></span>';
							bothkhtml += '</a>';
							bothkhtml += '<a class="nm" href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">'+d.results[i][j]['vdname']+'</a>';
						bothkhtml += '</li>';
					}
					else
					{
						html += '<li>';
							html += '<a class="block" href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">';
								html += '<span class="'+d.results[i][j]['vicon']+'"></span>';
							html += '</a>';
							html += '<a class="nm" href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">'+d.results[i][j]['vdname']+'</a>';
						html += '</li>';
						hkdisp ++;
					}
				}
			}
			$(".pi_outer").html(bnhtml+'<section class="htokeysec htky"><ul class="tophotKeys">'+tophkhtml+'</ul></section><section class="htokeysec"><ul class="hotKeys">'+html+'</ul></section><section class="htokeysec htkyn dn" id="morehkys"><ul class="hotKeys">'+bothkhtml+'</ul></section><span class="shmore"><a href="javascript:showMoreHotkeys();" id="moredivanc">More</a></span>');
		}
		ipad_fscroll();
		//closeDiv('jldr');
	});
	
	if(getcity == 'JD-on-Android' && change==0)
	{
		JDandroid('hotkeys','andr','android');
	}
	areaCookie();
	
	var now = new Date();
                            var time = now.getTime();
                            time += 3600 * 1000;
                            now.setTime(time);
	document.cookie="dealBackCity=" + c +
                            '; expires=' + now.toGMTString() + 
                            '; path=/' +
                            '; domain='+cookieondomain;
}

function showMoreHotkeys()
{
	var isVisMore = $("#morehkys").hasClass('dn');
	if(isVisMore)
	{
		$("#morehkys").removeClass('dn');
		$("#moredivanc").html('Less');
		_ct('hkmore', 'hmpg');
	}
	else
	{
		$("#morehkys").addClass('dn');
		$("#moredivanc").html('More');
		_ct('hkless', 'hmpg');
	}
}

function areaCookie() {
	var tmp = $("#what").val().split("(");
	var tmpWhere = tmp.slice(-1);
	if ($("#where").val().substr(0,4)=="e.g.") {
		$("#where").addClass("grey");
	}
	var loct = ($("#chkrembercity").attr("checked")=="checked" && !$("#where").hasClass("grey")) ? $("#where").val().trim() : "";
	//document.cookie = 'inweb_area='+loct+';expires=0; path=/; domain=' + cookieondomain;
}
function hideDiv(id) {
	if(id == 'city_Suggest_Main') {
		var evt = window.event||arguments.callee.caller.arguments[0];
		var eobj = window.event?evt.srcElement:evt.target;
        var href= String($(eobj).attr("href"));
        if(eobj == '' || href !="undefined") {
            return;
		}
	}
	var evt = window.event||arguments.callee.caller.arguments[0];
	if($(evt.target).attr("href")) return;
	$('#account').addClass('whiteBorder');
	$('#account').removeClass('accountBorder');

	if(document.getElementById(id)) {
    	var obj = document.getElementById(id);
    	var eobj = window.event?evt.srcElement:evt.target;
		if($(evt.target).hasClass("dar")==true) return;
    	if(eobj.nodeType == 3) {
			eobj = eobj.parentNode;
		}
      	while(eobj.parentNode) {
      		if(eobj == obj) {
				return;
			}
      		eobj = eobj.parentNode;
    	}
    	obj.style.display = 'none';
  	}
  	$('#showHideDiv').hide();
};


function blockhomepage()
{
	
	$(".homepage").animate({ 
					marginTop: "-141px"
					}, 800 ,function(){
								$("#acc_opt").addClass("ac_opt");
		$("#acc_opt").removeClass("acc_opt");
		$(".callus").addClass("call_us");
		$(".call_us").removeClass("callus");
		
		$(".android_img").addClass("androidimg");
		$(".android_img").removeClass("android_img");
			
		});
		
}
function getBlockDivScroll()
{
    if (touchy == true && stat == true) {
        var topBlock = $(window).scrollTop()+40;
        $('.blockMsg').animate({top:topBlock+'px'},'fast');
        if($('.feedbckbtn').hasClass('feedbckbtn')) {
            $('.feedbckbtn').animate({top:($(window).scrollTop()+$(window).height()-100)+'px'},'fast');
        }
    }
}
function getScrollTop() {
    if (window.pageYOffset != null) {
        var _pageScrollTop = window.pageYOffset;
    } else {
        var _pageScrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop ;
    }
    return _pageScrollTop;
}
function gofun(tmp,ara) 
{
	if($('#what').val().indexOf('e.g.')==-1 && $('#what').val()!="" && $('#what').val()!="Search for anything, anywhere in India")
	{
		$("#srcbtn").removeClass('srcbtn').addClass('srcbtngif');
		$('#go').attr('disabled','disabled');
	}
	if(tmp=='utab')
	{
		document.index.what.value = $('#what').val();

		if($('#where').val().substr(0,4)!='e.g.')
			document.index.where.value = $('#where').val();
		else
			document.index.where.value = '';

		document.index.submit();
		return;
	}
	else if(tmp=='do')
	{
		if(!$('#what').val() || $('#what').val().substr(0,4)=='e.g.' || $('#what').val()=="Search for anything, anywhere in India")
		{
			$("#what").focus();
			if(touchy == true) {
				window.setTimeout(function(){
					$("#what").click();
				}, 100);
			}

			//setTimeout('$("#what").focus();',300);
			//$('#what').focus();
			return;
		}
		var tt = $('#what').val().trim();
		if(tt.length>1 && $('#what').val()!="Search for anything, anywhere in India")
		{
			$.ajax({url:WEBROOT+"ajxmain.php?city="+$("#city").val()+"&cases=validatecity",async:false, success:function(result){
			
				if ((whatid !== undefined) && (whatid != null) && (whatid != "undefined"))
				{
					var whtarr = whatid.split('|');
					if(whtarr[3])
					{
						if(whtarr[3].toLowerCase() == result)
							document.index.city.value = $("#city").val();
						else
							document.index.city.value = whtarr[3];
					}
					else
					{
						document.index.type.value = 1;
						document.index.city.value =$('#ctlnk').text();
					}
				}
				else
				{
					document.index.type.value = 1;
					document.index.catid.value= '';
					document.index.city.value =$('#ctlnk').text();
					document.cookie = 'alter=1;  path=/; domain=' + cookieondomain;
				}
			}});
			if($("#itab").val() != 1){
				document.cookie = "tab=toprs;path=/; domain=" + cookieondomain;
			}

			document.cookie = 'inar='+$('#where').val()+';  path=/; domain=' + cookieondomain;
			document.index.where.value= (ara) ? $('#where').val() : '';
			document.index.what.value = $('#what').val();
			document.index.type.value = $('#type').val();
			document.index.submit();
			return;
		}
	}
	else if(tmp=='dongo' && (!$('#where').val() || $('#where').val().substr(0,4)=='e.g.'))
	{
		var tt = $('#what').val().trim();
		if(tt.length>1)
		{
			document.index.city.value = $('#city').val();
			document.index.what.value = $('#what').val();
			//$('#arBox').show();
			//$('#arlnk').hide();
			//$('#where').focus();
			return;
		}
	}
	else if(tmp=='dongo' && $('#where').val())
	{
		var tt = $('#what').val().trim();
		if(tt.length>1)
		{
			if ((whatid === undefined) || (whatid == null) || (whatid == "undefined"))
			{
				document.cookie = 'alter=1;  path=/; domain=' + cookieondomain;
			}
			document.index.what.value = $('#what').val();
			document.index.where.value= $('#where').val();
			document.index.type.value = 1;
			document.index.catid.value = '';
			if(getCookie('inweb_area') && !getCookie('inweb_area').substr(0,4)!='e.g.')
			{
				document.index.submit();
			}
			return;
		}
	}
	else if(tmp)
	{
		var cty  = $('#city').val().replace(/\s\/\sncr+/ig,'').toLowerCase();

		document.index.catid.value= tmp[0];
		document.index.type.value = tmp[1];
		document.index.city.value = tmp[3];
		
		// make variables empty
		if((document.index.prid != undefined) && (document.index.psearch != undefined) && (document.index.sfsearch != undefined))
		{
			document.index.prid.value = '';
			document.index.psearch.value = '';
			document.index.sfsearch.value = '';
		}
		// ends here
		
		if(tmp[5]!='undefined'){
			document.index.what.value = tmp[5];
		}
		if(tmp[9]!='undefined'){
		document.index.asflg.value= tmp[9];
		}
		if(tmp[10]!='undefined'){
		document.index.enflg.value= tmp[10];
		}
		if(tmp[11]!='undefined'){
		document.index.prid.value= tmp[11];
		}
		if(tmp[3].toLowerCase() != $("#city").val().toLowerCase()) {
			document.cookie = 'inweb_area=;expires=0; path=/; domain=' + cookieondomain;
		}
		
		var ctmp= (tmp[3].toLowerCase()=='delhi  ncr' || tmp[3].toLowerCase()=='delhi ncr') ? 'delhi' : tmp[3].toLowerCase();
		
		if(tmp[4]) { 
			document.index.where.value= tmp[4];
		} else if (!tmp[4] && tmp[3] && tmp[3].toLowerCase()==hiddencity.toLowerCase() /*&& tmp[2] != 1*/ && (typeof iwhat == 'undefined' || iwhat != $('#what').val())) {
			document.index.where.value= (getCookie('scity').toLowerCase() == ctmp.toLowerCase() || getCookie('scity') == "" || ctmp == "") ? ((getCookie('sarea') != '') ? getCookie('sarea') : '') : $('#where').val();
		} else if(!tmp[4] && tmp[3] && ctmp.toLowerCase()!=cty) { //tmp[3] 
			document.index.where.value= '';
		} else if($('#where').val() && $('#where').val().substr(0,4)!='e.g.' && (ctmp.toLowerCase()==cty || getCookie('scity') == "" || ctmp == "") /*&& tmp[2] != 1*/ && (typeof iwhat == 'undefined' || iwhat != $('#what').val())) { //tmp[3]
			//document.index.where.value= $('#where').val();
			} else {
			document.index.where.value= ''; 
		}
		if(document.index.where.value == '' && onloadFn == 'Index' && $('#where').val().trim() != '')
		{
			document.index.where.value = $('#where').val(); 
		}
		var scty = tmp[4].replace(/\scity+/ig,'').toLowerCase();

		var ara = $('#where').val();
		
		if(tmp[1]==1 && tmp[2]==0 && (!ara || ara.substr(0,4)=='e.g.') && !tmp[4] && ctmp==cty)
		{
			document.index.submit();
		}
		else if(tmp[1]==1 && tmp[2]==0 && scty==cty && tmp[4] && (!ara || ara.substr(0,4)=='e.g.'))
		{
			document.index.submit();
		}
		if((tmp[4]=='' && ctmp!=$("#city").val().toLowerCase()) || tmp[4]!='' || tmp[2]==1 || changeArea || (getCookie('inweb_area') && getCookie('inweb_area').substr(0,4)!='e.g.'))
		{
			document.index.submit();
		}
		else
		{
           document.index.submit();
		}
		return;
	}
	whatlength = $('#what').val().length;

	if(onloadFn == 'National Search')
	{
		$("#city").val('National Search');
	}
	if($('#what').val().indexOf('e.g.')!=-1 || $('#what').val()=="" || $('#what').val()=="Search for anything, anywhere in India") {
		if(tmp == undefined) {
			alert('Please enter category / company name for search.');
		}
		$("#what").focus();
		if(touchy == true) {
			window.setTimeout(function(){
				$("#what").click();
			}, 100);
		}
		//setTimeout('$("#what").focus();',300);
		//$('#what').focus();
		return false;	
	}
	else if(whatlength < 2 ){
		if(tmp == undefined) {
			alert('Too few characters entered. Please expand your search.');
		}
		$("#what").focus();
		if(touchy == true) {
			window.setTimeout(function(){
				$("#what").click();
			}, 100);
		}
		//setTimeout('$("#what").focus();',300);
		//$('#what').focus();
		return false;	
	}
	else {
		if ($('#what').val().indexOf('e.g.')!=-1 || $('#what').val()=="") {
			if (onloadFn == "National Search") {
				if(tmp == undefined) {
					alert("Please enter company name for search.");
				}
				$("#what").focus();
				if(touchy == true) {
					window.setTimeout(function(){
						$("#what").click();
					}, 100);
				}
				//setTimeout('$("#what").focus();',300);
				//$("#what").focus();
			} else {
				if(tmp == undefined) {
					alert("Please enter category / company name for search.");
				}
				$("#what").focus();
				if(touchy == true) {
				window.setTimeout(function(){
						$("#what").click();
					}, 100);
				}
				//setTimeout('$("#what").focus();',300);
				//$('#what').focus();
			}
			return false;
		}
		if (whatid)
			var Catid_Type = whatid.split("|");
		else
		{
			var Catid_Type = new Array("","1");
			//document.cookie = 'alter=1;  path=/; domain=' + cookieondomain;
		}
		if($("#itab").val() != 1){
			document.cookie = "tab=toprs;path=/; domain=" + cookieondomain;
		}	

		document.index.city.value = $('#city').val();
		if(Catid_Type[2]==2){
			var tmp = $('#what').val().split('|');
			document.index.what.value = tmp[0];
		}
		else{
			document.index.what.value = $('#what').val();
		}
		document.cookie = 'inweb_what='+document.index.what.value+'; '+date+'; path=/; domain=' + cookieondomain;
		if(onloadFn != "National Search")
		{
			//document.index.where.value = ($('#where').val().indexOf('e.g.') != -1) ? "" : $('#where').val().trim();
			document.index.where.value= (getCookie('scity').toLowerCase() == $('#city').val().toLowerCase() && getCookie('sarea') != '') ? getCookie('sarea') : '';
			document.cookie = 'inar='+document.index.where.value+';  path=/; domain=' + cookieondomain;
			if(typeof iwhat != 'undefined' && iwhat == $('#what').val())
			{
				document.index.where.value = '';
			}
		}
		
		document.index.catid.value	= (Catid_Type[0]=="undefined") ? "" : Catid_Type[0];
		document.index.type.value	= (Catid_Type[1]=="undefined") ? "" : Catid_Type[1];
		document.index.asflg.value	= (Catid_Type[6]=="undefined") ? "" : Catid_Type[9];
		document.index.enflg.value	= (Catid_Type[7]=="undefined") ? "" : Catid_Type[10];
		document.index.prid.value	= (Catid_Type[8]=="undefined") ? "" : (Catid_Type[11] ? Catid_Type[11] : document.index.prid.value);
		if(Catid_Type[4])
			document.index.where.value= Catid_Type[4];
		if (Catid_Type[1] == "2" || onloadFn == 'National Search')
			$("#where").val("");
		areaCookie();
		
		if(document.index.where.value == '' && onloadFn == 'Index' && $('#where').val().trim() != '')
		{
			document.index.where.value = $('#where').val(); 
		}
		if($("#city").val() == "National Search")
		{
			document.index.submit();
		}
		else
		$.ajax({url:WEBROOT+"ajxmain.php?city="+$("#city").val()+"&cases=citycheck",async:false, success:function(result){
			if(result=="City Failed")
			{
				$("#city").val(getCookie('inweb_city'));
				document.index.submit();
			}
			else
			{
				document.index.submit();
			}
		}});
	}
}
function change_temp() {
	$("#ftemp_val").toggle();	$("#temp_val").toggle();	$("#temp_type").toggle();	$("#ftemp_type").toggle();
}
String.prototype.trim = function() {return $.trim(this)}
var poppage = 1;
var wait = false;
function lazyloading() {
    if ( poppage == 3 || wait == true) return false;
    try {
		
		if($(document).height()-$(window).height()-$("#footer").height()-150<$(window).scrollTop()) {
            poppage++;
            document.getElementById("page_"+poppage).onclick();
            setTimeout("wait=false",1000);
            wait = true;
        }
    } catch (ex) { }
}
function clear_div(div_id)
{
	$("#err_"+div_id).html("");
}
function _ct(a, d, v) {
    a = escape(a);d = escape(d);v = escape(v);
    
    var url = WEBROOT+"functions/click_tracker.php?city="+$("#city").val()+"&li="+a+"&ll="+d+"&ver="+v+"&rnd="+Math.random();
    if(v == 'bus')
    {
		if(getCookie('attn_user') == 'logout')
		{
			url = WEBROOT+"functions/click_tracker.php?mobile=&li="+a+"&ll="+d+"&ver="+v+"&rnd="+Math.random();
		}
		else
		{
			url = WEBROOT+"functions/click_tracker.php?mobile="+getCookie('inLogMobile')+"&li="+a+"&ll="+d+"&ver="+v+"&rnd="+Math.random();
		}
	}
	
	if(v == '32')
	{
		if(getCookie('attn_user') == 'logout')
		{
			loginmob = '';loginname ='';
		}
		else
		{
			loginmob = getCookie('inLogMobile');
			loginname = getCookie('inLogName');
		}
		
		url = WEBROOT+"functions/click_tracker.php?mobile="+loginmob+"&name="+loginname+"city="+$("#city").val()+"&li="+a+"&ll="+d+"&ver="+v+"&rnd="+Math.random();
	}
	
	$.ajax({
		url:url,
		async:false
	});
}

function _ct_map(a, d, v) {
	var now = new Date();
	var cur_time = now.getTime();
	if(mapdisplayed == 0)
	{
		$.ajax({
		url:WEBROOT+"functions/map_log.php?date="+cur_time,
		async:false
		});
		mapdisplayed = 1;
	}
}


String.prototype.trimSpace  = function(){return this.replace(/\s{2,}/g,' ')};

function closeHome()
{
	var hp	=	1;
	//var expire = new Date();
	//expire.setTime(expire.getTime()+(90*24*60*60*1000));
	document.cookie = 'jdhomepage='+hp+';  path=/; domain=' + cookieondomain;	
	var divHeight =$(window).height();
	$(".pi_outer").css({"min-height":divHeight-420, "display":"block"});//Home Page		
}
function getCookie_homepage(c_name) {
	if (document.cookie.length > 0) {
	var c_start=document.cookie.indexOf(c_name + "=");
		if(c_start!=-1) {
			c_start = c_start + c_name.length+1;
			var c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			if(c_name='inLogName')
				return unescape(document.cookie.substring(c_start,c_end).replace('+',' '));
            else
				return unescape(document.cookie.substring(c_start,c_end));
			
		}
	}
	return "";
}
function rankingsPush()
{
  var url = String(document.referrer);
  if (url.indexOf ("google.com") !=-1)
  {
	var urlVars = {};
	var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value)
	{
		urlVars[key] = value;
	});
    ga('_setCustomVar', '1', 'Google Rankings', urlVars["cd"], 1);
    ga('_trackPageview');
   }
}
function clearcookie(cityval)
{
	document.cookie = 'inweb_area=;expires=0; path=/; domain=' + cookieondomain;
	if(getCookie('inweb_city') != cityval && document.cookie.indexOf("sarea") != -1)
	{
		document.cookie = 'sarea=;expires=0; path=/; domain=' + cookieondomain;
	}
	document.cookie = 'inweb_city='+cityval+';'+date+'; path=/; domain=' + cookieondomain;
	document.cookie = 'scity='+cityval+';'+date+'; path=/; domain=' + cookieondomain;
}
function friendsReview(logname)
{
	$(".nt").html("Sign in to your Justdial account");
	fn_loginStart(logname);
}

/* Number Ticker JS */
$(".counter-number").each( function(i) {
    $(this).attr('id','num'+i);
});
function loadinput() {
    var newval = $("#numgo").val();
    loadticker(newval);
}
function loadticker(ticnum) {
	//var fticnum = add_commas(ticnum);
    var fticnum = ticnum;
    var numheight=28;
    addticker(fticnum);
    if (ticnum && ticnum != 0) {
        var s = String(fticnum);
        for (i=s.length;i>=0; i--)
        {
            var onum=s.charAt(i);          
            $("#num"+i).attr('value',onum);
        }
        $(".counter-number").each( function() {
            var nval=$(this).attr("value");
            if (!isNaN(nval)) {
                var nheight = (Number(nval)*numheight*-1);
				if(nheight == 0)
				{
					nheight = -1;
				}
				else
				{
					nheight = nheight+(((nheight*-1)/28)-1);
				}
                $(this).animate({ top: nheight+'px'}, 180 );
            }
            if (nval==','){
                $(this).animate({ top: '-271px'}, 180 );
            }
        });
    }
}
function addticker(newnum) {
    var digitcnt = $(".counter-number").size();
    var nnum = String(newnum).length;
    var digitdiff = Number(nnum - Number(digitcnt));
    if (digitdiff <0) {
        var ltdig = (Number(nnum)-1);
        $(".counter-number:gt(" + ltdig + ")").remove();
    }
    var j=1;
	var check = (digitdiff/3);
	check = Math.floor(check);
    for(i=1,p=digitdiff;i<=digitdiff;i++,p--) {
		if(p%3==0)
			$(".counter-wrap").append('<span class="new-comma"></span>');
		$(".counter-wrap").append('<div class="counter-number" id="num' + (Number(digitcnt+i-1)) + '">&nbsp;</div>');
    }
}
function add_commas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

/* Number Ticker JS ENDS */


function review_rating_page(city_name)
{
	var myVar = new Array("0","0","0","1","0","0","0","1","0","0","0","1","0","0","0","1","0","0","0","1");
	
	var cityArr = new Array("Ahmedabad","Bangalore","Chennai","Hyderabad","Delhi / Ncr","Kolkata","Mumbai","Pune","Thane","Navi Mumbai","Ghaziabad","Noida","Gurgaon","Faridabad","Secunderabad","Bengaluru","Madras","Calcutta","Agra","Alappuzha","Allahabad","Amritsar","Bhavnagar","Bhopal","Bhubaneshwar","Chandigarh","Coimbatore","Cuttack","Dharwad","Ernakulam","Goa","Hubli","Indore","Jaipur","Jalandhar","Jamnagar","Jamshedpur","Jodhpur","Kanpur","Kolhapur","Kozhikode","Lucknow","Ludhiana","Madurai","Mangalore","Mysore","Nagpur","Nashik","Patna","Pondicherry","Rajkot","Ranchi","Salem","Shimla","Surat","Thiruvananthapuram","Tirunelveli","Trichy","Udupi","Vadodara","Varanasi","Vijayawada","Vizag");
	
	//var a = cityArr.indexOf(city_name); 
	var a = $.inArray(city_name,cityArr); 
	
	var randomNumber = Math.floor((Math.random()*19)+1);
	
	if(myVar[randomNumber] == 0)
	{
		var rurl = WEBROOT+"comp_detail.php";
	}
	else if(a != -1 && myVar[randomNumber] == 1)
	{
		var rurl = WEBROOT+"result.php";
	}
	else
	{
		var rurl = WEBROOT+"comp_detail.php";
	}
	
	if(window.event) {//IE 6
		window.event.returnValue = false;
        window.location = rurl;
        return false;
    }else {//firefox
        window.location = rurl;
    }
}

function bigb_cookie() {
	
	var url = location.href;
	var cookie_domain;
	var cookie_name = 'ad_auto';
	var cookie_val = (getCookie(cookie_name) != '') ? getCookie(cookie_name) : 0;
	if(cookie_val < 3) {
		cookie_val++;
	}
	url.indexOf('jdsoftware.com')
	if(url.indexOf('jdsoftware.com') >= 0) {
		cookie_domain = '.jdsoftware.com';
	}
	else if(url.indexOf('blrsoftware.com') >= 0) {
		cookie_domain = '.blrsoftware.com';
	}
	else {
		cookie_domain = '.justdial.com';
	}
	
	var expDate = new Date();
	expDate.setYear(expDate.getFullYear() + 1);
	document.cookie = escape(cookie_name) + "=" + escape(cookie_val) + "; expires=" + expDate.toGMTString() + "; path=/; domain=" + cookie_domain;
}

function random_ad_film(auto) {

	var vdo_sz = 4;
	var rand_no = Math.floor(Math.random()*vdo_sz);
	//var rand_no = 0;
	if(auto == 1)
	{
		var loc = '';
		if(org_onloadFn == 'detailsPage' || org_onloadFn == 'read_mreview')
		{
			loc = 'dtpg';
		}
		else if(org_onloadFn == 'Result' || org_onloadFn == 'NSsearch')
		{
			loc = 'lspg';
		}
		else if(org_onloadFn == 'Index' || org_onloadFn == 'National Search')
		{
			loc = 'hmpg';
		}
		else
		{
			loc = org_onloadFn;
		}
		_ct('bigb_ad'+(rand_no+1)+'_auto', loc);
	}

	ad_film(rand_no, auto);
}

var pre_ad_id = '';
function ad_film(i, auto) 
{
	var ad_url_arr = new Array();
	ad_url_arr[0] = 'http://www.youtube.com/embed/2O9hoMQLku4';
	ad_url_arr[1] = 'http://www.youtube.com/embed/m-tpzzKRL-E';
	ad_url_arr[2] = 'http://www.youtube.com/embed/nGpLS0uCHqI';
	ad_url_arr[3] = 'http://www.youtube.com/embed/Ey7qakQeuW8';
	var ad_id_arr = new Array();
	ad_id_arr[0] = 'ad1';
	ad_id_arr[1] = 'ad2';
	ad_id_arr[2] = 'ad3';
	ad_id_arr[3] = 'ad4';

	if(document.getElementById(ad_id_arr[i])) 
	{
		for (j=0;j<4;j++)
		{
			document.getElementById(ad_id_arr[j]).className  = '';
		}

		document.getElementById(ad_id_arr[i]).className  = 'jsel';
		if(i ==3)
			document.getElementById(ad_id_arr[3]).className  = 'jsel last';
		else
			document.getElementById(ad_id_arr[3]).className  = 'last';

		document.getElementById('adif').src = ad_url_arr[i] + '?rel=0&autoplay=' + auto + '&autohide=1&wmode=transparent&showinfo=0';
	}
}

function JDandroid(hid,sid,key)
{
	loadJS(WEBROOT+'tools/js/jdonmobile.js');
	var img_url = 'http://images.jdmagicbox.com/icontent/';
	if(key == undefined)
	{
		key = "iPhone";
	}
	if(!($.browser.msie && $.browser.version.substr(0, 1) < 8))
	{
		loadImg('.jap,.jam,.ico1,.ico2,.ico3,.jdtm,.qrcd', img_url+'AnroidAppSprite.png');
		loadImg('.iph,.anr,.imge1,.imge2,.imge3,.rb', img_url+'JD_on_Mobile_Iphone.png');
	}
	else
	{
		loadImg('.jap,.jam,.ico1,.ico2,.ico3,.jdtm,.qrcd', img_url+'AnroidAppSprite.gif');
		loadImg('.iph,.anr,.imge1,.imge2,.imge3,.rb', img_url+'JD_on_Mobile_Iphone.gif');
	}
	if(key == "iPhone")
	{
		$("#android").hide();
		$("#siph").show();
		$("#wphn").hide();
		$("#iph").addClass('divd');
		$("#jandro").removeClass('divd');
		$('#winph').removeClass('divd');
	}
	else if(key == "android")
	{	
		$("#android").show();
		$("#siph").hide();
		$("#wphn").hide();
		$("#iph").removeClass('divd');
		$("#jandro").addClass('divd');
		$('#winph').removeClass('divd');
	}
	else if(key == "window")
	{
		$("#android").hide();
		$("#siph").hide();
		$("#wphn").show();
		$('#winph').addClass('divd');
		$("#iph").removeClass('divd');
		$("#jandro").removeClass('divd');
	}
	
	$("#"+hid).hide();
	$("#aemsg").hide();
	$("#iemsg").hide();
	$("#aemsg").html('');
	$("#iemsg").html('');
	$("#b2c").removeClass();
	$("#b2b").removeClass();
	$("#"+sid).show();
	$("#pand").addClass('jsel');
	$('#b2c').click(function() { fn_Banner('','','b2c');_ct('popular_search_categories','hmpg');});
	$('#b2b').click(function() { fn_Banner('-1','','b2b');_ct('popular_b2b_categories','hmpg');});
	var a = $('.jaa').offset();
	$('html, body').animate({scrollTop: a.top}, 800);
}

function logAndroidApp(type)
{
	var sndflg = 0;
	$("#ander").hide();
	$("#ander").html("");
	var phn	=	$("#anphone").val();
	var em	=	$("#anmail").val();
	if(phn.search("e.g") == 0 && em.search("e.g") == 0 )
	{
		sndflg = 1;
		$("#ander").show();
		$("#ander").html("Enter phone number or Email id");
		return false;
	}
	if(phn == "" && em == "")
	{
		sndflg = 1;
		$("#ander").show();
		$("#ander").html("Enter phone number or Email id");
		return false;
	}
	if(phn!="" && phn.search("e.g") != 0 )
	{
		if(!validateMobile(phn))
		{
				
			sndflg = 1;
			$("#ander").show();
			$("#ander").html("Enter valid Mobile Number"); 
			return false;
		}
			
		var fchar = phn.charAt(0);	
		if(fchar != 7 && fchar != 8 && fchar != 9)
		{
			sndflg = 1;
			$("#ander").show();
			$("#ander").html("Enter valid Mobile Number"); 
			return false;
		}
		var alphaExp = /^[0-9]+$/;
		if(!phn.match(alphaExp))
		{
			sndflg = 1;
			$("#ander").show();
			$("#ander").html("Enter valid Mobile Number"); 
			return false;
		}
	}
			
	if(em != "" && em.search("e.g") != 0 )
	{
		if(!isValid(em,"email"))
		{
			sndflg = 1;
			$("#ander").show();
			$("#ander").html("Enter valid Email Id"); 
			return false;
		}
	}
	if(sndflg == 0)
	{
			DNDcheck('anphone','anmail');
		
	}
	
}

function ngofun()
{
	/*
	document.index.city.value = $('#city').val();
	document.index.what.value = $('#nst').val();
	document.index.where.value = '';
	document.index.catid.value = '';
	document.index.type.value = '';
	*/

	document.cookie = 'inweb_what='+document.index.what.value+'; '+date+'; path=/; domain=' + cookieondomain;
	document.cookie = 'inweb_city='+$("#city").val().trim()+'; '+date+'; path=/; domain=' + cookieondomain;
	$.ajax({url:WEBROOT+"ajxmain.php?city="+$("#city").val()+"&cases=citycheck",async:false, success:function(result){
		if(result=="City Failed")
		{
			$("#city").focus();
			alert("Please Select Valid City");
			return false;
		}
		else
		{
			var s = $('#nst').val().split('~');
			//var c = $('#city').val().replace('.','');
			var c = $('#city').val().replace(/[.,\/]+/g,'');
			var a = WEBROOT + c + '/' + s[1] + '/' + s[0];
			$('<form action="'+a+'"></form>').appendTo('body').submit();
		}
	}});
}
function validateMobile(x)
{
    if(x == "")
	{
		
		return false; 
	}
	if(isNaN(x)|| x.indexOf(" ")!=-1)
	{
		return false; 
	}
	var alphaExp = /^[0-9]+$/;
	if(!x.match(alphaExp))
	{
		return false; 
	}
	if(x.length != 10)
	{
		return false; 
	}
	$fchar = x.charAt(0);	
	if($fchar != 7 && $fchar != 8 && $fchar != 9)
	{
		return false; 
	}
	
	return true;
}

/* Corner JS */
(function(c){var a=document.createElement("div").style,h=a.MozBorderRadius!==undefined,j=a.WebkitBorderRadius!==undefined,e=a.borderRadius!==undefined||a.BorderRadius!==undefined,d=document.documentMode||0,l=c.browser.msie&&((c.browser.version<8&&!d)||d<8),i=c.browser.msie&&(function(){var n=document.createElement("div");try{n.style.setExpression("width","0+0");n.style.removeExpression("width")}catch(m){return false}return true})();c.support=c.support||{};c.support.borderRadius=h||j||e;function g(m,n){return parseInt(c.css(m,n))||0}function k(m){m=parseInt(m).toString(16);return(m.length<2)?"0"+m:m}function b(o){while(o){var m=c.css(o,"backgroundColor"),n;if(m&&m!="transparent"&&m!="rgba(0, 0, 0, 0)"){if(m.indexOf("rgb")>=0){n=m.match(/\d+/g);return"#"+k(n[0])+k(n[1])+k(n[2])}return m}if(o.nodeName.toLowerCase()=="html"){break}o=o.parentNode}return"#ffffff"}function f(o,m,n){switch(o){case"round":return Math.round(n*(1-Math.cos(Math.asin(m/n))));case"cool":return Math.round(n*(1+Math.cos(Math.asin(m/n))));case"sharp":return n-m;case"bite":return Math.round(n*(Math.cos(Math.asin((n-m-1)/n))));case"slide":return Math.round(n*(Math.atan2(m,n/m)));case"jut":return Math.round(n*(Math.atan2(n,(n-m-1))));case"curl":return Math.round(n*(Math.atan(m)));case"tear":return Math.round(n*(Math.cos(m)));case"wicked":return Math.round(n*(Math.tan(m)));case"long":return Math.round(n*(Math.sqrt(m)));case"sculpt":return Math.round(n*(Math.log((n-m-1),n)));case"dogfold":case"dog":return(m&1)?(m+1):n;case"dog2":return(m&2)?(m+1):n;case"dog3":return(m&3)?(m+1):n;case"fray":return(m%2)*n;case"notch":return n;case"bevelfold":case"bevel":return m+1;case"steep":return m/2+1;case"invsteep":return(n-m)/2+1}}c.fn.corner=function(m){if(this.length==0){if(!c.isReady&&this.selector){var n=this.selector,o=this.context;c(function(){c(n,o).corner(m)})}return this}return this.each(function(v){var u=c(this),D=[u.attr(c.fn.corner.defaults.metaAttr)||"",m||""].join(" ").toLowerCase(),K=/keep/.test(D),C=((D.match(/cc:(#[0-9a-f]+)/)||[])[1]),p=((D.match(/sc:(#[0-9a-f]+)/)||[])[1]),G=parseInt((D.match(/(\d+)px/)||[])[1])||10,E=/round|bevelfold|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dogfold|dog|invsteep|steep/,r=((D.match(E)||["round"])[0]),s=/dogfold|bevelfold/.test(D),q={T:0,B:1},z={TL:/top|tl|left/.test(D),TR:/top|tr|right/.test(D),BL:/bottom|bl|left/.test(D),BR:/bottom|br|right/.test(D)},H,N,F,I,y,O,B,L,J,x,M,P,A,t;if(!z.TL&&!z.TR&&!z.BL&&!z.BR){z={TL:1,TR:1,BL:1,BR:1}}if(c.fn.corner.defaults.useNative&&r=="round"&&(e||h||j)&&!C&&!p){if(z.TL){u.css(e?"border-top-left-radius":h?"-moz-border-radius-topleft":"-webkit-border-top-left-radius",G+"px")}if(z.TR){u.css(e?"border-top-right-radius":h?"-moz-border-radius-topright":"-webkit-border-top-right-radius",G+"px")}if(z.BL){u.css(e?"border-bottom-left-radius":h?"-moz-border-radius-bottomleft":"-webkit-border-bottom-left-radius",G+"px")}if(z.BR){u.css(e?"border-bottom-right-radius":h?"-moz-border-radius-bottomright":"-webkit-border-bottom-right-radius",G+"px")}return}if(!c.browser.msie||(c.browser.msie&&!u.is("input"))){H=document.createElement("div");c(H).css({overflow:"hidden",height:"1px",minHeight:"1px",fontSize:"1px",backgroundColor:p||"transparent",borderStyle:"solid"});N={T:parseInt(c.css(this,"paddingTop"))||0,R:parseInt(c.css(this,"paddingRight"))||0,B:parseInt(c.css(this,"paddingBottom"))||0,L:parseInt(c.css(this,"paddingLeft"))||0};if(typeof this.style.zoom!=undefined){this.style.zoom=1}if(!K){this.style.border="none"}H.style.borderColor=C||b(this.parentNode);F=c(this).outerHeight();for(I in q){y=q[I];if((y&&(z.BL||z.BR))||(!y&&(z.TL||z.TR))){H.style.borderStyle="none "+(z[I+"R"]?"solid":"none")+" none "+(z[I+"L"]?"solid":"none");O=document.createElement("div");c(O).addClass("jquery-corner");B=O.style;y?this.appendChild(O):this.insertBefore(O,this.firstChild);if(y&&F!="auto"){if(c.css(this,"position")=="static"){this.style.position="relative"}B.position="absolute";B.bottom=B.left=B.padding=B.margin="0";if(i){B.setExpression("width","this.parentNode.offsetWidth")}else{B.width="100%"}}else{if(!y&&c.browser.msie){if(c.css(this,"position")=="static"){this.style.position="relative"}B.position="absolute";B.top=B.left=B.right=B.padding=B.margin="0";if(i){L=g(this,"borderLeftWidth")+g(this,"borderRightWidth");B.setExpression("width","this.parentNode.offsetWidth - "+L+'+ "px"')}else{B.width="100%"}}else{B.position="relative";B.margin=!y?"-"+N.T+"px -"+N.R+"px "+(N.T-G)+"px -"+N.L+"px":(N.B-G)+"px -"+N.R+"px -"+N.B+"px -"+N.L+"px"}}for(J=0;J<G;J++){x=Math.max(0,f(r,J,G));M=H.cloneNode(false);M.style.borderWidth="0 "+(z[I+"R"]?x:0)+"px 0 "+(z[I+"L"]?x:0)+"px";y?O.appendChild(M):O.insertBefore(M,O.firstChild)}if(s&&c.support.boxModel){if(y&&l){continue}for(P in z){if(!z[P]){continue}if(y&&(P=="TL"||P=="TR")){continue}if(!y&&(P=="BL"||P=="BR")){continue}A={position:"absolute",border:"none",margin:0,padding:0,overflow:"hidden",backgroundColor:H.style.borderColor};t=c("<div/>").css(A).css({width:G+"px",height:"1px"});switch(P){case"TL":t.css({bottom:0,left:0});break;case"TR":t.css({bottom:0,right:0});break;case"BL":t.css({top:0,left:0});break;case"BR":t.css({top:0,right:0});break}O.appendChild(t[0]);var Q=c("<div/>").css(A).css({top:0,bottom:0,width:"1px",height:G+"px"});switch(P){case"TL":Q.css({left:G});break;case"TR":Q.css({right:G});break;case"BL":Q.css({left:G});break;case"BR":Q.css({right:G});break}O.appendChild(Q[0])}}}}}})};c.fn.uncorner=function(){if(e||h||j){this.css(e?"border-radius":h?"-moz-border-radius":"-webkit-border-radius",0)}c("div.jquery-corner",this).remove();return this};c.fn.corner.defaults={useNative:true,metaAttr:"data-corner"}})(jQuery);

/* Popup JS */
 (function(b){b.fn.bPopup=function(z,F){function K(){a.contentContainer=b(a.contentContainer||c);switch(a.content){case "iframe":var h=b('<iframe class="b-iframe" '+a.iframeAttr+"></iframe>");h.appendTo(a.contentContainer);r=c.outerHeight(!0);s=c.outerWidth(!0);A();h.attr("src",a.loadUrl);k(a.loadCallback);break;case "image":A();b("<img />").load(function(){k(a.loadCallback);G(b(this))}).attr("src",a.loadUrl).hide().appendTo(a.contentContainer);break;default:A(),b('<div class="b-ajax-wrapper"></div>').load(a.loadUrl,a.loadData,function(){k(a.loadCallback);G(b(this))}).hide().appendTo(a.contentContainer)}}function A(){a.modal&&b('<div class="b-modal '+e+'"></div>').css({backgroundColor:a.modalColor,position:"fixed",top:0,right:0,bottom:0,left:0,opacity:0,zIndex:a.zIndex+t}).appendTo(a.appendTo).fadeTo(a.speed,a.opacity);D();c.data("bPopup",a).data("id",e).css({left:"slideIn"==a.transition||"slideBack"==a.transition?"slideBack"==a.transition?g.scrollLeft()+u:-1*(v+s):l(!(!a.follow[0]&&m||f)),position:a.positionStyle||"absolute",top:"slideDown"==a.transition||"slideUp"==a.transition?"slideUp"==a.transition?g.scrollTop()+w:x+-1*r:n(!(!a.follow[1]&&p||f)),"z-index":a.zIndex+t+1}).each(function(){a.appending&&b(this).appendTo(a.appendTo)});H(!0)}function q(){a.modal&&b(".b-modal."+c.data("id")).fadeTo(a.speed,0,function(){b(this).remove()});a.scrollBar||b("html").css("overflow","auto");b(".b-modal."+e).unbind("click");g.unbind("keydown."+e);d.unbind("."+e).data("bPopup",0<d.data("bPopup")-1?d.data("bPopup")-1:null);c.undelegate(".bClose, ."+a.closeClass,"click."+e,q).data("bPopup",null);H();return!1}function G(h){var b=h.width(),e=h.height(),d={};a.contentContainer.css({height:e,width:b});e>=c.height()&&(d.height=c.height());b>=c.width()&&(d.width=c.width());r=c.outerHeight(!0);s=c.outerWidth(!0);D();a.contentContainer.css({height:"auto",width:"auto"});d.left=l(!(!a.follow[0]&&m||f));d.top=n(!(!a.follow[1]&&p||f));c.animate(d,250,function(){h.show();B=E()})}function L(){d.data("bPopup",t);c.delegate(".bClose, ."+a.closeClass,"click."+e,q);a.modalClose&&b(".b-modal."+e).css("cursor","pointer").bind("click",q);M||!a.follow[0]&&!a.follow[1]||d.bind("scroll."+e,function(){B&&c.dequeue().animate({left:a.follow[0]?l(!f):"auto",top:a.follow[1]?n(!f):"auto"},a.followSpeed,a.followEasing)}).bind("resize."+e,function(){w=y.innerHeight||d.height();u=y.innerWidth||d.width();if(B=E())clearTimeout(I),I=setTimeout(function(){D();c.dequeue().each(function(){f?b(this).css({left:v,top:x}):b(this).animate({left:a.follow[0]?l(!0):"auto",top:a.follow[1]?n(!0):"auto"},a.followSpeed,a.followEasing)})},50)});a.escClose&&g.bind("keydown."+e,function(a){27==a.which&&q()})}function H(b){function d(e){c.css({display:"block",opacity:1}).animate(e,a.speed,a.easing,function(){J(b)})}switch(b?a.transition:a.transitionClose||a.transition){case "slideIn":d({left:b?l(!(!a.follow[0]&&m||f)):g.scrollLeft()-(s||c.outerWidth(!0))-C});break;case "slideBack":d({left:b?l(!(!a.follow[0]&&m||f)):g.scrollLeft()+u+C});break;case "slideDown":d({top:b?n(!(!a.follow[1]&&p||f)):g.scrollTop()-(r||c.outerHeight(!0))-C});break;case "slideUp":d({top:b?n(!(!a.follow[1]&&p||f)):g.scrollTop()+w+C});break;default:c.stop().fadeTo(a.speed,b?1:0,function(){J(b)})}}function J(b){b?(L(),k(F),a.autoClose&&setTimeout(q,a.autoClose)):(c.hide(),k(a.onClose),a.loadUrl&&(a.contentContainer.empty(),c.css({height:"auto",width:"auto"})))}function l(a){return a?v+g.scrollLeft():v}function n(a){return a?x+g.scrollTop():x}function k(a){b.isFunction(a)&&a.call(c)}function D(){x=p?a.position[1]:Math.max(0,(w-c.outerHeight(!0))/2-a.amsl);v=m?a.position[0]:(u-c.outerWidth(!0))/2;B=E()}function E(){return w>c.outerHeight(!0)&&u>c.outerWidth(!0)}b.isFunction(z)&&(F=z,z=null);var a=b.extend({},b.fn.bPopup.defaults,z);a.scrollBar||b("html").css("overflow","hidden");var c=this,g=b(document),y=window,d=b(y),w=y.innerHeight||d.height(),u=y.innerWidth||d.width(),M=/OS 6(_\d)+/i.test(navigator.userAgent),C=200,t=0,e,B,p,m,f,x,v,r,s,I;c.close=function(){a=this.data("bPopup");e="__b-popup"+d.data("bPopup")+"__";q()};return c.each(function(){b(this).data("bPopup")||(k(a.onOpen),t=(d.data("bPopup")||0)+1,e="__b-popup"+t+"__",p="auto"!==a.position[1],m="auto"!==a.position[0],f="fixed"===a.positionStyle,r=c.outerHeight(!0),s=c.outerWidth(!0),a.loadUrl?K():A())})};b.fn.bPopup.defaults={amsl:50,appending:!0,appendTo:"body",autoClose:!1,closeClass:"jcl",content:"ajax",contentContainer:!1,easing:"swing",escClose:!0,follow:[!0,!0],followEasing:"swing",followSpeed:500,iframeAttr:'scrolling="no" frameborder="0"',loadCallback:!1,loadData:!1,loadUrl:!1,modal:!0,modalClose:!0,modalColor:"#000",onClose:!1,onOpen:!1,opacity:0.8,position:["auto","auto"],positionStyle:"absolute",scrollBar:!0,speed:250,transition:"fadeIn",transitionClose:!1,zIndex:9997}})(jQuery);

if(navigator.userAgent.match(/iPad/i)) {
		viewport = document.querySelector("meta[name=viewport]");
		viewport.setAttribute('content', 'width=1003');
    }

/* Feedback JS */
(function (b) {
    b.fn.bPopupleft = function (n, p) {
        function t() {
            b.isFunction(a.onOpen) && a.onOpen.call(c);
            k = (e.data("bPopupleft") || 0) + 1;
            d = "__bPopupleft" + k;
            l = "auto" !== a.position[1];
            m = "auto" !== a.position[0];
            i = "fixed" === a.positionStyle;
            j = r(c, a.amsl);
            f = l ? a.position[1] : j[1];
            g = m ? a.position[0] : j[0];
            q = s();
            a.modal && b('<div class="bModal ' + d + '"></div>').css({
                "background-color": a.modalColor,
                height: "100%",
                right: 0,
                opacity: 0,
                position: "fixed",
                top: 0,
                width: "100%",
                "z-index": a.zIndex + k
            }).each(function () {
                a.appending && b(this).appendTo(a.appendTo)
            }).animate({
                opacity: a.opacity
            }, a.fadeSpeed);
            c.data("bPopupleft", a).data("id", d).css({
                right: !a.follow[0] && m || i ? g : h.scrollLeft() + g,
                position: a.positionStyle || "absolute",
                top: !a.follow[1] && l || i ? f : h.scrollTop() + f,
                "z-index": a.zIndex + k + 1
            }).each(function () {
                a.appending && b(this).appendTo(a.appendTo);
                if (null != a.loadUrl) switch (a.contentContainer = b(a.contentContainer || c), a.content) {
                    case "iframe":
                        b('<iframe scrolling="no" frameborder="0"></iframe>').attr("src", a.loadUrl).appendTo(a.contentContainer);
                        break;
                    default:
                        a.contentContainer.load(a.loadUrl)
                }
            }).fadeIn(a.fadeSpeed, function () {
                b.isFunction(p) && p.call(c);
                u()
            })
        }
        function o() {
            a.modal && b(".bModal." + c.data("id")).fadeOut(a.fadeSpeed, function () {
                b(this).remove()
            });
            c.stop().fadeOut(a.fadeSpeed, function () {
                null != a.loadUrl && a.contentContainer.empty()
            });
            e.data("bPopupleft", 0 < e.data("bPopupleft") - 1 ? e.data("bPopupleft") - 1 : null);
            a.scrollBar || b("html").css("overflow", "auto");
            b("." + a.closeClass).die("click." + d);
            b(".bModal." + d).die("click");
            h.unbind("keydown." + d);
            e.unbind("." + d);
            c.data("bPopupleft", null);
            b.isFunction(a.onClose) && setTimeout(function () {
                a.onClose.call(c)
            }, a.fadeSpeed);
            return !1
        }
        function u() {
            e.data("bPopupleft", k);
            b("." + a.closeClass).live("click." + d, o);
            a.modalClose && b(".bModal." + d).live("click", o).css("cursor", "pointer");
            (a.follow[0] || a.follow[1]) && e.bind("scroll." + d, function () {
                q && c.stop().animate({
                    right: a.follow[0] && !i ? h.scrollLeft() + g : g,
                    top: a.follow[1] && !i ? h.scrollTop() + f : f
                }, a.followSpeed)
            }).bind("resize." + d, function () {
                if (q = s()) j = r(c, a.amsl), a.follow[0] && (g = m ? g : j[0]), a.follow[1] && (f = l ? f : j[1]), c.stop().each(function () {
                    i ? b(this).css({
                        right: g,
                        top: f
                    }, a.followSpeed) : b(this).animate({
                        right: m ? g : g + h.scrollLeft(),
                        top: l ? f : f + h.scrollTop()
                    }, a.followSpeed)
                })
            });
            a.escClose && h.bind("keydown." + d, function (a) {
                27 == a.which && o()
            })
        }
        function r(a, b) {
            var c = (e.width() - a.outerWidth(!0)) / 2,
                d = (e.height() - a.outerHeight(!0)) / 2 - b;
            return [c, 20 > d ? 20 : d]
        }
        function s() {
            return e.height() > c.outerHeight(!0) + 20 && e.width() > c.outerWidth(!0) + 20
        }
        b.isFunction(n) && (p = n, n = null);
        var a = b.extend({}, b.fn.bPopupleft.defaults, n);
        a.scrollBar || b("html").css("overflow", "hidden");
        var c = this,
            h = b(document),
            e = b(window),
            k, d, q, l, m, i, j, f, g;
        this.close = function () {
            a = c.data("bPopupleft");
            o()
        };
        return this.each(function () {
            c.data("bPopupleft") || t()
        })
    };
    b.fn.bPopupleft.defaults = {
        amsl: -125,
        appending: null,
        closeClass: null,
        content: "ajax",
        contentContainer: null,
        escClose: null,
        fadeSpeed: 250,
        follow: [!0, !0],
        followSpeed: 500,
        loadUrl: null,
        modal: !0,
        modalClose: null,
        modalColor: "#fff",
        onClose: null,
        onOpen: null,
        opacity: 0.7,
        position: [0, "auto"],
        positionStyle: "fixed",
        scrollBar: !0,
        zIndex: 500
    }
})(jQuery);

document.onkeydown=evntcapture
function evntcapture(evt)
{
	evt=evt ? evt : event;
	if(evt.keyCode==27)
	{
		document.cookie = escape('BDprofile') + "=" + escape(1) + ";  path=/; domain=" + cookieondomain;
	}
	if(evt.keyCode==13 && $("#mn").is(":visible"))
	{
		DNDcheck('mn');
		return false;  
	}
}

function latestreviewimg()
{
	$.ajax({url:WEBROOT+"functions/getReviewerImg.php?city=mumbai&interval=today&start=0&end=50",async:false, success:function(result){
		alert(result);
	}});		
}

function liveCheck()
{	
	var l = 0;
	
	var pos = WEBROOT.search('justdial.com');

	l = (pos == -1) ? 0 : 1;

	return l;
}

function addAutoSuggestIframe(divHolder)
{
    if($.browser.msie && $.browser.version.substr(0, 1) < 7)
    {
        //hack for ie6
        var ifrId = 'ifrAuto_' + divHolder.slice(1);
        var ifr = '<iframe id="' +ifrId+ '" src="javascript:\'<html></html>\';" scrolling="no" frameborder="0" style="position:absolute;width:100%;height:768px;top:0px;left:0px;display:block;background:none;z-index:9000" ></iframe>';
        $(ifr).insertBefore($(divHolder).find('ul'));
        $(divHolder).find('ul').css({'z-index':'11000','position':'relative'});
		$(divHolder).find('ul li').css({'z-index':'11000','position':'relative'});
        $('#' + ifrId).height($(divHolder).height());

    
    }
}
/*dynamic footer alignment*/
$(window).bind('load orientationchange', function(event){
		/*if(onloadFn != "Index" && onloadFn != "customercare" && onloadFn != "fav")
		{
		if($('#compdetails').css('position') != 'fixed')
		{
		if(window.location.hash) {}
		else{
			if((onloadFn == 'detailsPage' || onloadFn == 'Result' || (onloadFn == 'National Search' && org_onloadFn  == 'NSsearch')) && (tab == 'undefined' || tab == undefined || tab == '' || tab == null || tab == 'null' || tab == 'highestrate' || tab == 'rating_srch') && org_onloadFn != 'advertise' && org_onloadFn != 'free_listing') {
				if(window.location.href.indexOf("#rvw") == -1)
				{
					var a = (org_onloadFn  == 'Result' || org_onloadFn  == 'NSsearch') ? $('.jmc').offset() : $('.jbrd').offset();
					a = (onloadFn == 'detailsPage') ? $('.jdlc').offset() : a;
				}
				if(typeof a !=  'undefined')
				{
					setTimeout (function () {
					
						if(!$("#city").is(':focus') && !$("#what").is(':focus') && !$("#where").is(':focus'))
						{
							var dtmp =  ($('.jcnwrp') && onloadFn == 'detailsPage' && tab != 'writereview') ? 0: ( (org_onloadFn  == 'Result' || org_onloadFn  == 'NSsearch') ? 0 : 15);
							dtmp = (tab == 'highestrate') ? 38 : dtmp;
							dtmp = (onloadFn == 'jd_on_mobile') ? 60 : dtmp;
							if($(window).scrollTop() <= a.top+dtmp)
								scrollTo(0,a.top+dtmp);
						}
					}, 800);
				}
				var b = $('.breadCrumbHolder').offset();
				if(typeof b !=  'undefined')
				{
					setTimeout (function () {
						if(!$("#city").is(':focus') && !$("#what").is(':focus') && !$("#where").is(':focus'))
						{
							if($(window).scrollTop() <= b.top-10)
								scrollTo(0,b.top-10);
						}
					}, 800);
				}
				if(tab == "grocery" || tab == "grocerysearch" || tab == "pharmacy" || tab == "pharmacysearch")
				{   
					var c = $('.grysctg').offset();
					if(typeof c !=  'undefined'  )
					{
						setTimeout (function () {
							
								if($(window).scrollTop() <= c.top-10)
									scrollTo(0,c.top-10);
							
						}, 800);
					}
				}	
			}
		      }
			}
		}*/
 
		var divHeight = $(window).height();

		if(onloadFn == "detailsPage")
			$(".fltc .fltc_detail").css({"min-height":divHeight-55, "display":"block"});//Filter Page
		else
			$(".fltc").css({"min-height":divHeight-210, "display":"block"});//Filter Page
		
		if(org_onloadFn == "free_listing")
			$(".jdlc").css({"min-height":divHeight-200, "display":"block"});//Free listing Page
		else if(org_onloadFn == "fav")
			$(".jdlc").css({"min-height":divHeight-240, "display":"block"});//fav
		else if(org_onloadFn == "register")
			$(".jdlc").css({"min-height":divHeight-245, "display":"block"});//register
		else if(org_onloadFn == "Shop Online" || org_onloadFn == "Deals &amp; Offers")
			$(".jdlc").css({"min-height":divHeight-290, "display":"block"});//shoponline & deals offer
		else if(org_onloadFn == "mycart")
			$(".jdlc").css({"min-height":divHeight-200, "display":"block"});//My cart
		else
			$(".jdlc").css({"min-height":divHeight-145, "display":"block"});//other verticals
			
		$(".wrw").css({"min-height":divHeight-200, "display":"block"});//write your review
		$(".AD").css({"min-height":divHeight-200, "display":"block"});//Advertise
		$(".jmbl").css({"min-height":divHeight-200, "display":"block"}); //jd on mobile
		$(".container,.tyf").css({"min-height":divHeight-250, "display":"block"});//friend rating pages & CMS pages having 'container' class
		$(".jmc").css({"min-height":divHeight-230, "display":"block"}); //customer care page
		$(".tms").css({"min-height":divHeight-300, "display":"block"}); //privacy and terms page
		$(".signu_o").css({"min-height":divHeight-260, "display":"block", "clear":"both", "float":"left", "width":"100%"});//sign up page
		//$(".rsftr").css({"clear":"both","float":"left","width":"100%"}); // dt.css	
		$(".rsincty").css({"min-height":divHeight-200, "display":"block"});//online-food-ordering-service	
		$(".jdvert").css({"min-height":divHeight-120, "display":"block"});//bookvertical
		$(".hstry").css({"min-height":divHeight-200, "display":"block"});//Unified login	
		$(".myact").css({"min-height":divHeight-230, "display":"block"});//My Account	
		$(".mid_outer").css({"min-height":divHeight-180, "display":"block"});//My Account	
		$(".dealsinfo").css({"min-height":divHeight-400, "display":"block"});//My Account	

		
		if($(".homepage").is(":visible"))
			$(".pi_outer").css({"min-height":divHeight-465, "display":"block"});//Home Page	
		else
			$(".pi_outer").css({"min-height":divHeight-250, "display":"block"});//Home Page	
		if(touchy == true && navigator.userAgent.indexOf("CPU OS 5_0")) {
			$(".pi_outer").css({"min-height":divHeight-250, "display":"block"});
		}	
		
});//document ready

/*dynamic footer alignment ends*/



function get_stdcode(stdid, pinid, phnid, cityid, phninpid)
{
	var pinval = $.trim($("#"+pinid).val());
	var cityval	= trim($("#"+cityid).val());
	var data = null;
	$("#listStd").hide();

	if(cityval.toLowerCase() == 'delhi/ncr' || cityval.toLowerCase() == 'delhi / ncr')
		cityval = 'Delhi';

	if((pinval != '' && isValid(pinval, 'numeric')) || (pinval == '' && cityval != ''))
	{
		var sptdt = null;
		var stdcodes = '';
		var selhtml = '';
		var ddStd = '';
		var lstcodes = '';
		$.ajax({url:WEBROOT+"getstdcode.php",data:{pincode: pinval, city: cityval}, success:function(result){
			sptdt = result.split("#");

			if(sptdt.length > 1)
			{
				data = sptdt[0];
				if(trim(sptdt[1]) != '')
					stdcodes = sptdt[1].split(',');
			}
			else
			{
				data = result;
			}

			if($("#"+phninpid).hasClass("stderr"))
				$("#"+phninpid).removeClass("stderr");

			if(stdcodes.length == 1)
			{
				selhtml = stdcodes;
				$('#' + stdid).removeClass("stdDropDown");
			}
			else if(stdcodes.length > 1)
			{
				//selhtml = stdcodes[0];
				selhtml = "&nbsp;";
				lstcodes = '<ul id="stdlist">';
				for(var i=0;i<stdcodes.length;i++)
					lstcodes += '<li onclick="selStdCode(\''+stdcodes[i]+'\', \''+stdid+'\', \''+phninpid+'\')">'+stdcodes[i]+'</li>';
				lstcodes += '</ul>';
				$('#' + stdid).addClass("stdDropDown");
				/*selhtml = '<select id="selstd">';
				for(var i=0;i<stdcodes.length;i++)
					selhtml += '<option value="'+stdcodes[i]+'">'+stdcodes[i]+'</option>';
				selhtml += '</select>';*/
			}

			flag = trim(data);
			//if(flag == 1 || flag == 3)
			if(flag != 4)
			{
				//$("#"+ stdid).html(selhtml + lstcodes + ddStd);
				//$("#"+ stdid).html(selhtml);
				$(".std").html(selhtml);
				$("#listStd").html(lstcodes);
				$("#"+ stdid).show();
				$("#"+ phnid).attr('maxlength', '8');
				//$("#"+ phnid).val('');
				//$('.std').attr('style', 'display:block');
			}
			else
			{
				//$("#"+ stdid).html('');
				$(".std").html(selhtml);
				$("#"+ stdid).hide();
				$("#"+ phnid).attr('maxlength', '10');
				//$("#"+ phnid).val('');
			}

			//if($.trim(sptdt[0]) == 1)
			/*if(flag != 4)
			{
				$("#"+ phnid).attr('maxlength', '8');
				$("#"+ phnid).val('');
			}
			else
			{
				$("#"+ stdid).html('');
				$("#"+ stdid).hide();
				$("#"+ phnid).attr('maxlength', '10');
				$("#"+ phnid).val('');
			}*/
		}});
	}
	else
	{

		if(pinval != '')
			$("#"+ pinid).focus();

		$("#"+ pinid).val('');
		//$("#"+ stdid).html('');
		$(".std").html(selhtml);
		$("#"+ stdid).hide();
	}
}

function showStdList(divstd)
{
	if($("#listStd").html() != '')
		$("#listStd").toggle();

	/*$("#listStd").is(':visible')
	{
		$('#listStd').width($('#'+divstd).width()+20);
	}*/
}

function selStdCode(codeval, stdid, phninpid)
{
	$('.std').html(codeval);
	if(!$('#'+stdid).hasClass("stdDropDown"))
		$('#'+stdid).addClass("stdDropDown");

	if($('#'+phninpid).hasClass("stderr"))
		$('#'+phninpid).removeClass("stderr");

	$("#listStd").is(':visible')
	{
		$("#listStd").hide();
	}
}

function onJobsHover(dnm)
{
    if(touchy == false)
    {
		$('.'+dnm).animate({	
		}, 800, function() {
			$('.'+dnm).css('display', 'inline-block');
		});
    }
}

function onJobsOut(dnm)
{
    if(touchy == false)
    {
		$('.'+dnm).css('display', 'none');
		$('.'+dnm).animate({
		}, 1, function() {
	  });
    }
}
function showHide() {
    var ele = document.getElementById("showHideDiv");
    if(ele.style.display == "block") {
         ele.style.display = "none";
      }
    else {
        ele.style.display = "block";
    }
}

function odrHistoryBk(obj,type){
	 _ct('othorder','ordhis','1');
    var part = '';
    var currentPageUrl = "";
    if (typeof this.href === "undefined") {
        currentPageUrl = document.location.toString();
    }
    else {
        currentPageUrl = this.href.toString();
    }
   
   
    if(type == 'c'){
       
        part = "?c=1&did="+$("#docid").val();
    }
    
    if(type == 's'){
        if($.trim($("#docid").val())){
            part = "?c=2&did="+$("#docid").val();
        }
        else{
            part = "?c=2";
        }
        
    }
    
    
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    currentPageUrl = currentPageUrl.replace(/\/laundrypickup\?t=1|\/laundrypickup\?t=2|\/laundrypickup\?t=3|\/courier\?t=(.)*$/, '');
    document.cookie = 
        'bkurl=' + escape($.trim(currentPageUrl)) + 
        '; expires=' + now.toGMTString() + 
        '; path=/' +
        '; domain='+cookieondomain;
    
    //document.cookie = 'bkurl='+escape(currentPageUrl)+'; '+date+'; path=/; domain=' + cookieondomain;
    
    //obj.parentNode.style.display = 'none'
    if(type == 'l'){
        window.location.href = WEBROOT+'Terms-of-Use-Vertical';
    }
    else if(type == 'bktbl')
    {
		 window.location.href = WEBROOT+'book-a-table-history'+part;
    }
    else if(type == 'grocery')
    {
		 window.location.href = WEBROOT+'Account/Grocery'+part;
    } 
    else if(type == 'pharmacy')
    {
		 window.location.href = WEBROOT+'Account/Pharmacy'+part;
    } 
	else if(type == 'n'){}
    else{
        if(type == 's')
		{
                    window.location.href = WEBROOT+'Account/Food-Orders'+part;
		}
		else
		{
			window.location.href = WEBROOT+'order-history'+part;
		}
    }
    
    
}
function shopbk()
{
	var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    docid = $("#docid").val().replace(/\.+/g, '-');
    
    srch = $("#sfsearch").val();
    srch = srch.replace(/[[\]{}&()*+?.,\\^$|#]+/g,' ');
    srch = srch.replace(/\'/g,'');
    srch = srch.replace(/[\s+]+/g,'-');

    whr = $("#where").val();
    if(whr)
    {
    	whr = whr.replace(/[[\]{}&()*+?.,\\^$|#]+/g,' ');
    	whr = whr.replace(/\'/g,'');
    	whr = whr.replace(/[\s+]+/g,'-');
    	srch = srch+'-<near>-'+whr;
    }	
    	
	
	city = $("#city").val();
	
    currentPageUrl = WEBROOT+city+'/'+srch+'/'+docid+'_BZDET';
    		
    document.cookie = 
	'bkurl=' + escape($.trim(currentPageUrl)) + 
	'; expires=' + now.toGMTString() + 
	'; path=/' +
	'; domain='+cookieondomain;
	
}

function doctorVendorbk(obj,type,opt)
{
    var now = new Date();
    var time = now.getTime();
	var rurl = WEBROOT+'doctors-vendor/';
	
    time += 3600 * 1000;
    now.setTime(time);
    currentPageUrl = document.location.toString();
    document.cookie = 
            'bkurl=' + escape($.trim(currentPageUrl)) + 
            '; expires=' + now.toGMTString() + 
            '; path=/' +
            '; domain='+cookieondomain;
	
	if(opt == 'bkapp')
	{
		rurl += 'Book-Appointment';
	}
	else if(opt == 'tdyapp')
	{
		rurl += 'Todays-Appointment';
	}
	else if(opt == 'mngapp')
	{
		rurl += 'Manage-Appointment';
	}
	else if(opt == 'admin')
	{
		rurl += 'Doctor-Admin';
	}
	
	window.location.href = rurl;
}

function shopfbk()
{
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    currentPageUrl = document.location.toString();
    document.cookie = 
            'bkurl=' + escape($.trim(currentPageUrl)) + 
            '; expires=' + now.toGMTString() + 
            '; path=/' +
            '; domain='+cookieondomain;
}

function Cook(nm){ 
	if(document.cookie.length>0){
		var st=document.cookie.indexOf(nm+'=');
		if(st!=-1){
			st = st+nm.length+1;
			var en=document.cookie.indexOf(';',st);
			if (en==-1) en=document.cookie.length;
				var val = escape(document.cookie.substring(st,en));			
			return unescape(val);
		}
	}
	return '';
}
function geoSend(lat,lon){
	$.get(WEBROOT + "getlocation.php",{act:'geo',xlat:lat,xlon:lon}, function(data) {
		var d = data.split('|');

		//var cookdo = (WEBROOT.indexOf('jdsoftware.com')>=0) ? '.jdsoftware.com' : ((WEBROOT.indexOf('blrsoftware.com')>=0) ? '.blrsoftware.com' : '.justdial.com');
		if(d[0]==getCookie('scity') && d[1]==getCookie('sarea'))
		{
			return;
		}
		document.cookie = (d[0]) ? 'scity='+d[0]+';path=/;domain='+cookieondomain : 'scity=Mumbai;path=/;domain='+cookieondomain;
		document.cookie = (d[0]) ? 'usrcity='+d[0]+';path=/;domain='+cookieondomain : 'usrcity=Mumbai;path=/;domain='+cookieondomain;
		if(d[1]){
			document.cookie = 'sarea='+d[1]+';expires=0;path=/;domain='+cookieondomain;
			document.cookie = 'slat='+lat+';expires=0;path=/;domain='+cookieondomain;
			document.cookie = 'slon='+lon+';expires=0;path=/;domain='+cookieondomain;
			document.cookie = 'sgip='+d[2]+';expires=0;path=/;domain='+cookieondomain;
			document.cookie = 'srip='+d[3]+';expires=0;path=/;domain='+cookieondomain;
			if(onloadFn == 'detailsPage' || onloadFn == 'Result' || onloadFn == 'National Search') {
				$('#where_a').val(d[1]);
				$('#where_a').css('color', '#000000');
				$('#lat_a').val(lat);
				$('#lng_a').val(lon);
				currentLocation(lat, lon);
			} else {
				$('#city').val(d[0]);
				$('#ctlnk').text(d[0]);
				$('#wherein').text(d[0]+'?');
				$('#where').val(d[1]);
				if(d[1] != '')
				{
					$('#arlnk').text(d[1]);
					$('.detarea').html('<span class="areadet" onclick="aautodisp();"><span class="blmap"></span><span class="locdetc">'+d[1]+'</span></span><span class="cleararea"  onclick="clear_area();"></span>');
					//$('.detarea').removeClass('dn');
					$('#arlnk').removeClass('grey');
				}
				else
				{
					$('.detarea').html(disparea());
				}
				$('.detarea').removeClass('dn');
				document.getElementById('where').className = 'jsin';
				getData();
			}
		}
		else if(d[0]){
			$('#city').val(d[0]);
			$('#ctlnk').text(d[0]);
			$('#wherein').text(d[0]+'?');
			getData();
		}
		return;	
	});
}
function getLocation(){ 
	if(geo_position_js.init())
		geo_position_js.getCurrentPosition(showPosition,function(error){showPosition();},{timeout:2000});
	else
		geoSend();
}
function showPosition(position){
	if(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
	}
	geoSend(lat,lon);
}

function clear_text_box(eg_type,id,event) {
	
    

	
	if(event=="onfocus") {
		if(document.getElementById(id).value=="e.g Ravi Verma" || document.getElementById(id).value=="" || document.getElementById(id).value=="e.g 9867045061" || document.getElementById(id).value=="e.g. abc@xyz.com" || document.getElementById(id).value=="Listing Information" || document.getElementById(id).value=="e.g Ravi Verma" || document.getElementById(id).value=="e.g John Smith" || document.getElementById(id).value=="e.g user@email.com" || document.getElementById(id).value=="e.g. abc@xyz.com" || document.getElementById(id).value=="e.g 9867045061" || document.getElementById(id).value=="Enter Promo Code") {
			document.getElementById(id).value = "";
			document.getElementById(id).style.color = "#000000";
		}
	}
	if(event == "onblur") {

		if(document.getElementById(id).value=="") {
			if(id == "bd_name" || id == "bt_name" || id == "bd_name_detail" || id == "vbt_name"){
				document.getElementById(id).value = "e.g Ravi Verma";
			}
                        if(id == "vbt_nm" ){
                            document.getElementById(id).value = "e.g John Smith";
                            
                        }
                        if(id == "vbt_eml" ){
                            document.getElementById(id).value = "e.g user@email.com";
			}
			if(id == "snfemail" || id == "bd_email" || id == "bt_email" || id == "bd_email_detail" || id == "vbt_email") {
				document.getElementById(id).value = "e.g. abc@xyz.com";
			}
			if(id == "bd_mobile" || id == "bt_mobile" || id == "bd_mobile_detail" || id == "vbt_mobile") {
				document.getElementById(id).value = "e.g 9867045061";
			}
			if(id == "snflt") {
				document.getElementById(id).value = "Listing Information";
			}

			if(id == "promocodeinp"){
					document.getElementById(id).value = "Enter Promo Code";
				}


			document.getElementById(id).style.color = "#BDBDBD";
		}
                
                 if(id == "vbt_mobile"){
                    if(document.getElementById(id).value != "e.g 9867045061"){
                    validate_vmobile(0);
                    }
                }

	}
}


function batPopupHtml(bttype, docid, btaid, workingTrue)
{
		var btresvn_date= $('#btresvn_date').val();
		//alert($('#btresvn_date').val());
		
		if(workingTrue != 1) 
		{ 
			if(btresvn_date)
			{	
				$('#btdate').datepicker('setDate', $('#btresvn_date').val());
			}
			else
			{
				$('#btdate').datepicker('setDate', 'today');
			}
        } 
        else 
        {
			$('#btdate').datepicker('setDate', $('#btdate').val());
        }
        var npoption = '';
	$.getJSON(WEBROOT+"functions/ajxbooktable.php", {btdocid:docid,btdateval:$("#btdate").val()}, function(data) { 
		$('#bt_cnanval').html("<span>"+data.resultsdata[0].cname+"</span> ("+data.resultsdata[0].area+")");
		$('#btdocid').val(docid);
		$('#btcompname').val(data.resultsdata[0].cname);
		$('#btareaname').val(data.resultsdata[0].area);
		$('#btmin_time_rsvn').val(data.resultsdata[0].min_time_rsvn);
		var nprval = data.resultsdata[0].btnprval;
		var btdatevalarr = data.resultsdata[0].btdatearr;
		var bttimevalarr = data.resultsdata[0].bttimeval;
		var workingday = data.resultsdata[0].workingbtdatearr;
		var noprselected = $('#btnoprsn').val();
		var nopersonsel = $('#noofperson').val();
		var btresvn_time = $('#btresvn_time').val();
		
		
		if(nprval == 0 || nprval == '')
		{
			nprval = 20;
		}
		for(var i = 1; i <= nprval; i++)
		{
			if(i == noprselected) {
				var select_val = 'selected'; 
			}else if(i == 2) {
				var select_val = 'selected'; 
			} else {
				var select_val = ''; 
			}
			
			if(nopersonsel && nopersonsel == i)
			{	
				select_val = "selected=\"true\"";
			}
			
			npoption += "<option value='"+i+"' "+select_val+">"+i+"</option>";
		}
		$('#btnoprsn').html(npoption);
		
		var timeslotoption = '';
		if(bttimevalarr != '#$@$#') {
			var bttimevalarr1 = bttimevalarr.split('#$@$#');
			var timeArr = bttimevalarr1[0].split('$##$');
			var timeArrValue = bttimevalarr1[1].split('$##$');
			timeslotoption += "<label for='' class='jlbl_s'>Time<span class='ment'>*</span>";
			timeslotoption += "</label>";
			timeslotoption += "<select class='jslct hdn' id='bttime'>";
			timeslotoption += "<option value='Select'>Select</option>";
			
			for(var j = 0; j < timeArr.length; j++)
			{
				if(timeArr[j] != '' && timeArr[j] != 'undefined')
				{
					var tmArr = timeArr[j].split('(');
					var timeAvl = timeArrValue[j].split(' ');
					var ctime = timeAvl[0].split(':');
					if(bttype == 3) {
						var avilTime = convert12to24($('#'+btaid).text());
						var ctimeval = avilTime.split(':');
						var current_time = ctimeval[0];
						var current_min = ctimeval[1];
					}else{ 
						var currentTime = new Date();
						var current_time = currentTime.getHours();
						var current_min = currentTime.getMinutes();
					}
					var select_time = '';
					if(ctime[0] == current_time && ctime[1] == current_min){
						select_time = 'selected';
					}else{
						select_time = 	'';
					}
					//var sel = '';
					//alert(selTime);
					/*if(selTime == timeAvl[0])
					{
						select_time = 'selected' ;
					}
					else {
						select_time = '';
					}*/
					if(btresvn_time.trim() == timeAvl[0].trim())
					{	
						select_time = "selected=\"true\"";
					}
					timeslotoption += "<option value='"+timeAvl[0]+"' "+select_time+">"+tmArr[0]+"</option>";
				}
			}
			timeslotoption += "</select>";
			timeslotoption += "<span class=\"err dn\" id='battime'>Error Message</span>";
			$('#bdtimedd').html(timeslotoption);
		} else { 
			//$('#bdtimedd').html(''); 
			$('#btdate').datepicker('setDate', '+1d');								
			$('#btdate').datepicker('option', 'minDate', 1);
			if(nextDateFlag == 0) {
				batPopupHtml(bttype, docid, btaid, workingTrue);	
			}
			nextDateFlag++;
		}
		$('#changeover_slot').val(data.resultsdata[0].changeover_slot);
		$('#booking_capacity').val(data.resultsdata[0].booking_capacity);
		$('#slot').val(data.resultsdata[0].slot);
		
		if(bttype != 3) {
			if(btdatevalarr != '') {
				closedDate = '';
				var dateArr = btdatevalarr.split('$##$');
                                
				var wdflag = false;
				for(var j = 0; j < dateArr.length; j++)
				{
					if(dateArr[j] != '')
					{
						closedDate += dateArr[j]+',';
					}
					if(!wdflag && workingday != '' && bttimevalarr == '#$@$#')
					{
						$("#btdate").datepicker('setDate', workingday);
						$('#btdate').datepicker('option', 'minDate', 0);
						var workingTrue = 1;
						batPopupHtml(bttype, docid, btaid, workingTrue);
						wdflag = true;
					}
				}
				closedDate = closedDate.substring(0,closedDate.lastIndexOf(","));
                                $("#hdnbtDate").val(closedDate);
                                $("#btdate").datepicker({beforeShowDay: nonWorkingDates});
			} else { 
            			var workingTrue = 0;
				closedDate = '';
                                $("#hdnbtDate").val(closedDate);
                               
				$("#btdate").datepicker({beforeShowDay: nonWorkingDates}); 
				var btcnt = $("#bttime option").length;
				if(btcnt == 0)
				{
					$('#btdate').datepicker('setDate', '+1d');								
					$('#btdate').datepicker('option', 'minDate', 1);
					if(nextDateFlag == 0) {
                                            batPopupHtml(bttype, docid, btaid, workingTrue);
                                        }
                                        nextDateFlag++;
				}
				else
				{
					if($('#btdate').val() ==  '')
					{
						$('#btdate').datepicker('setDate', 'today');
					}								
					$('#btdate').datepicker('option', 'minDate', 0);
				}
			}
		}
	});
}

function bookAtable(bttype, docid, btaid, workingTrue,reference_number,modifiy)
{
	$("select.hdn").css("visibility","visible");
	
	if(bttype == 3)
	{
		closeDiv('batte');
		var docid = $('#compid').val();
	}
	if(docid != '')
	{
		batPopupHtml(bttype, docid, btaid, workingTrue)
		//openDiv('bat');	
	}
	else
	{
		var btcid = $('#btdocid').val();
		var btname = $('#bt_name').val();
		var btmobile = $('#bt_mobile').val();
		var btemail = $('#bt_email').val();
		var btdate = $("#btdate").val();
		var bcapacity = $("#booking_capacity").val();
		var slot = $("#slot").val();
		var modifiy = $("#modifiy").val();
		
		if(btaid != 'undefined' && $('#'+btaid).text() != '')
		{
			var bttime = $('#'+btaid).text();
		}
		else
		{
			var bttime = $("#bttime :selected").val();
		}
		var btnoprsn = $("#btnoprsn :selected").val();
		var btmin_time_rsvn = $("#btmin_time_rsvn").val();
		//var vcode = $('#btvcode').val();
		var vcode = $.trim($('#btvcode').val()+"-"+$('#btvcode2').val());
		
		if(btname == '' || btname == 'e.g Ravi Verma')
		{
			$('#batname').html("Please enter your name.");
			$('#batname').removeClass('dn');
			$('#bt_name').focus();
			return false; 
		}
		if((btname != '') && (!isValid(btname, 'name')))
		{
			$('#batname').html("Please enter a valid name.");
			$('#batname').removeClass('dn');
			$('#bt_name').focus();
			return false; 
		}
		if(btmobile == '' || btmobile == 'e.g 9867045061')
		{
			$('#batname').html('');
			$('#batname').addClass('dn');
			$('#batmobile').html("Please enter your Mobile Number.");
			$('#batmobile').removeClass('dn');
			$('#bt_mobile').focus();
			return false;
		}
		if(btmobile != '')
		{
			var alert_msg = mobile_validation(btmobile);
			if(alert_msg != "valid")
			{	
				$('#batname').html('');
				$('#batname').addClass('dn');
				$('#batmobile').html(alert_msg);
				$('#batmobile').removeClass('dn');
				$('#bt_mobile').focus();
				return false;
			}
		}
		if(btemail == 'e.g. abc@xyz.com')
		{
			btemail = '';
		}
		if(btemail != '' && btemail != 'undefined')
		{
			var atpos = btemail.indexOf("@");
			var dotpos = btemail.lastIndexOf(".");
			if (atpos<1 || dotpos<atpos+2 || dotpos+2>=btemail.length)
			{
				$('#batname').html('');
				$('#batname').addClass('dn');
				$('#batmobile').html('');
				$('#batmobile').addClass('dn');
				$('#batemail').html('Please enter your valid email address.');
				$('#batemail').removeClass('dn');
				$('#bt_email').focus();
				return false;
			}
		}
		if(bttime == 'Select')
		{
			$('#batname').html('');
			$('#batname').addClass('dn');
			$('#batmobile').html('');
			$('#batmobile').addClass('dn');
			$('#batemail').html('');
			$('#batemail').addClass('dn');
			$('#battime').html('Please select time.');
			$('#battime').removeClass('dn');
			$('#bttime').focus();
			return false;
		}
		if($("#btvcode").is(":visible") && vcode == "")
		{
			$('#resend_msg_bat').hide();
			$('#resend_msg_bat').html('');
			$('#btvcodeErr').show();
			$('#btvcodeErr').html('Please enter verification code.');
			$('#btvcode').val('');
			$('#btvcode').focus();
			return false;
		}
		
		if($('#btrefNum').val() != 'undefinded' && $("#btvcode").is(":visible"))
		{
			var ref_num = $('#btrefNum').val();
		}
		
		if($('#btrefNum1').val() != 'undefinded' && $.trim($('#btrefNum1').val()) !== '')
		{
			var ref_num = $('#btrefNum1').val();
		}
		
		if($('#btcid').val() != 'undefinded' && $.trim($('#btcid').val()) !== '')
		{
			btcid = $('#btcid').val() ;
		}
		if(modifiy == 1)
		{
			var ref_num = reference_number;
			$.ajax
			({
				url:WEBROOT+"functions/ajxbooktable.php",
				type: "post",
				data :{
					ref_num: ref_num,
					cancelDetails:1
				},  
				async : false,
				success:function(result)
				{
					if(result == 0)
					{
						$.getJSON(WEBROOT+"functions/ajxbooktable.php", {btcid:btcid,btname:btname,btmobile:btmobile,btdate:btdate,bttime:bttime,btnoprsn:btnoprsn,vcode:vcode,bttype:bttype,btmin_time_rsvn:btmin_time_rsvn,btemail:btemail,reference_number:ref_num,bcapacity:bcapacity,slot:slot,modifiy:modifiy}, function(data) 
						{ 
							$('.err').html('');
							$('.err').addClass('dn');
							var flag = data.resultsdata[0].flag;
							var errorcode = data.resultsdata[0].error_code;
							var errormsg = data.resultsdata[0].error_msg;
			
							if(flag == 8) //bad word
							{
								$('#batname').html('Please enter valid name');
								$('#batname').removeClass('dn');
							}
							else if(flag == 1) //vcode sent
							{
								$('#btrefNum').val(data.resultsdata[0].reference_number);
								$('#batrsvc').html('<a href="javascript:ratethisVerificationResend('+data.resultsdata[0].mobile+');">Click Here</a>');			
								$('#bat').css('display','none');
								openDiv('batvc');
							}
							else if(flag == 2) //vcode not sent
							{
								$('#bat').css('display','none');
								openDiv('baterr');
							}
							else if(flag == 3) //limit reached
							{	
								$('#bat').css('display','none');
								$('#batvc').css('display','none');
								openDiv('batmlr');
							}
							else if(flag == 4)
							{
								$('#resend_msg_bat').hide();
								$('#resend_msg_bat').html('');
								$('#btvcodeErr').show();
								$('#btvcodeErr').html('Please enter correct verification code.');
								//$('#btvcode').val('');
								//$('#btvcode').focus();
								return false;
							}

							else if(flag == 5) //success
							{
								//$('#bat').css('display','none');
								closeDiv('batvc');
								$('#batcfm').css('display','none');	
								if(errorcode == 0)
								{
									var ref_number = data.resultsdata[0].ref_number;
									/*var num_of_seats = data.resultsdata[0].num_of_seats;
									var area_name = data.resultsdata[0].area_name;
									var landline_display = data.resultsdata[0].landline_display;
									var booking_date = data.resultsdata[0].booking_date;
									var booking_time = data.resultsdata[0].booking_time;
									var revinfo = '';
									revinfo += '<strong>Location:</strong> '+area_name+'<br />';
									revinfo += '<strong>Date:</strong> '+booking_date+'<br />';
									revinfo += '<strong>Time:</strong> '+booking_time+'<br />';
									revinfo += '<strong>No Of People:</strong> '+num_of_seats+'<br />';
									revinfo += '<strong>Reservation ID:</strong> '+ref_number+'<br />';
									$('#revInfo').html(revinfo);
									$('#btcall').html(landline_display);
									$('#bt_caname').html("<span>"+data.resultsdata[0].company_name+"</span>");
									$('#battyurl').val(data.resultsdata[0].comp_url);
									$("#thankupopup, #thankupopup1").click(function() {
										window.location.href = data.resultsdata[0].comp_url;
									});
									$(document).keyup(function(e) {
										if (e.keyCode == 27) { window.location.href = data.resultsdata[0].comp_url; }   // esc key event
									});
									openDiv('bats');*/
									var now = new Date();
									var time = now.getTime();
									time += 3600 * 1000;
									now.setTime(time);
									document.cookie = 
										'tblId_'+MDOCIDJ+'=' + escape(ref_number) + 
										'; expires=' + now.toGMTString() + 
										'; path=/' +
										'; domain='+cookieondomain;
									window.location.href = baseurl+'/tblchkout/1';
								}
								else
								{
									closeDiv('batvc');
									$('#batcfm').css('display','none');
									$('#btbcdate_cnan1').html("<span>"+$('#btcompname').val()+"</span>&nbsp;("+$('#btareaname').val()+")");
									$('#apierrormsg').html('We are currently not able to receive any request for reservation.<br />Kindly try after some time.');
									openDiv('batapierr');
								}
							}
							else if(flag == 6) //error
							{
								//$('#bat').css('display','none');
								$('#batvc').css('display','none');
								$('#batcfm').css('display','none');				
								if(errormsg == 'booking not available')
								{
									$('#btbcdate_cnan').html("<span>"+data.resultsdata[0].cname+"</span>&nbsp;("+data.resultsdata[0].area+")");
									$('#bcdate').html(data.resultsdata[0].selectedDate.replace(/\-/g,"/"));
									if(data.resultsdata[0].company_number.length > 4)
									var compno = '<b>Restaurant No. - '+data.resultsdata[0].company_number+' </b>';
									$('#bcdateno').html(compno);
									openDiv('batbcdate');
								}
								else
								{
									$('#btbcdate_cnan1').html("<span>"+$('#btcompname').val()+"</span>&nbsp;("+$('#btareaname').val()+")");
									$('#apierrormsg').html('We are currently not able to receive any request for reservation.<br />Kindly try after some time.');
									//errormsg.charAt(0).toUpperCase() + errormsg.slice(1)
									openDiv('batapierr');
								}
							}
							else if(flag == 7) //timeslot
							{
								/*var before_slot = '';
								var after_slot = '';*/
								$('#compid').val(btcid);
								$('#tsna').html($("#bttime :selected").text());
								$('#dtna').html(btdate.replace(/\-/g,"/"));
								
								$('#batcfm_cname2').html($('#btcompname').val()+"&nbsp;<span class='whr'>("+$('#btareaname').val()+")</span>");
								var avilTS = '';
								
								var availInfo_arr = data.resultsdata[0].avail_slot.split('$$');
								for(var k=0; k < availInfo_arr.length; k++)
								{
									if(availInfo_arr[k] != 'undefined' || availInfo_arr[k] != '')
									{
										var availInfo_arr1 = availInfo_arr[k].split('|');
										avilTS += "<li><a href='javascript:void(0);' onclick='bookAtable(3,\"\",this.id,1);' id='avlblt"+k+"'>"+availInfo_arr1[0]+"</a></li>";
									}
								}
								
								$('#avil_time_slot').html(avilTS);
								openDiv('batte');
							}
							else if(flag == 9) //confirmation
							{
								$('#btcid').val(btcid);
								$('#btrefNum1').val(data.resultsdata[0].reference_number);
								var ref_number = data.resultsdata[0].reference_number;
								/*closeDiv('bat');
								closeDiv('batvc');
								$('#btcid').val(btcid);
								$('#btrefNum1').val(data.resultsdata[0].reference_number);
								$('#batcfm_cname').html("<span>"+$('#btcompname').val()+"</span>&nbsp;<span class='whr'>("+$('#btareaname').val()+")</span>");
								$('#btUName').html(data.resultsdata[0].btname);
								$('#btcfmdt').html(data.resultsdata[0].btdate);
								$('#btcfmnp').html(data.resultsdata[0].btnoprsn);
								$('#btcfmtm').html(data.resultsdata[0].bttime);
								$('#btcfmcn').html($('#btcompname').val()+"&nbsp;("+$('#btareaname').val()+")");
								$('#bat').css('display','none');
								$('#batvc').css('display','none');
								openDiv('batcfm');*/
								bookAtable('4', '','','',ref_number,0);
							}
							else if(flag == 10) //blacklisted
							{
								//closeDiv('bat');
								openDiv('blacklist');
							}
						});    
					}
				}
			});
			//alert(ref_num);
		}  
		else
		{
			$.getJSON(WEBROOT+"functions/ajxbooktable.php", {btcid:btcid,btname:btname,btmobile:btmobile,btdate:btdate,bttime:bttime,btnoprsn:btnoprsn,vcode:vcode,bttype:bttype,btmin_time_rsvn:btmin_time_rsvn,btemail:btemail,reference_number:ref_num,bcapacity:bcapacity,slot:slot,modifiy:modifiy}, function(data) 
			{ 
				
				$('.err').html('');
				$('.err').addClass('dn');
				var flag = data.resultsdata[0].flag;
				var errorcode = data.resultsdata[0].error_code;
				var errormsg = data.resultsdata[0].error_msg;
				
				if(flag == 8) //bad word
				{
					$('#batname').html('Please enter valid name');
					$('#batname').removeClass('dn');
				}
				else if(flag == 1) //vcode sent
				{
					$('#btrefNum').val(data.resultsdata[0].reference_number);
					$('#batrsvc').html('<a href="javascript:ratethisVerificationResend('+data.resultsdata[0].mobile+');">Click Here</a>');			
					$('#bat').css('display','none');
					openDiv('batvc');
				}
				else if(flag == 2) //vcode not sent
				{
					$('#bat').css('display','none');
					openDiv('baterr');
				}
				else if(flag == 3) //limit reached
				{	
					$('#bat').css('display','none');
					$('#batvc').css('display','none');
					openDiv('batmlr');
				}
				else if(flag == 4)
				{
					$('#resend_msg_bat').hide();
					$('#resend_msg_bat').html('');
					$('#btvcodeErr').show();
					$('#btvcodeErr').html('Please enter correct verification code.');
					//$('#btvcode').val('');
					//$('#btvcode').focus();
					return false;
				}

				else if(flag == 5) //success
				{
					//$('#bat').css('display','none');
					closeDiv('batvc');
					$('#batcfm').css('display','none');	
					if(errorcode == 0)
					{
						var ref_number = data.resultsdata[0].ref_number;
						/*var num_of_seats = data.resultsdata[0].num_of_seats;
						var area_name = data.resultsdata[0].area_name;
						var landline_display = data.resultsdata[0].landline_display;
						var booking_date = data.resultsdata[0].booking_date;
						var booking_time = data.resultsdata[0].booking_time;
						var revinfo = '';
						revinfo += '<strong>Location:</strong> '+area_name+'<br />';
						revinfo += '<strong>Date:</strong> '+booking_date+'<br />';
						revinfo += '<strong>Time:</strong> '+booking_time+'<br />';
						revinfo += '<strong>No Of People:</strong> '+num_of_seats+'<br />';
						revinfo += '<strong>Reservation ID:</strong> '+ref_number+'<br />';
						$('#revInfo').html(revinfo);
						$('#btcall').html(landline_display);
						$('#bt_caname').html("<span>"+data.resultsdata[0].company_name+"</span>");
						$('#battyurl').val(data.resultsdata[0].comp_url);
						$("#thankupopup, #thankupopup1").click(function() {
							window.location.href = data.resultsdata[0].comp_url;
						});
						$(document).keyup(function(e) {
							if (e.keyCode == 27) { window.location.href = data.resultsdata[0].comp_url; }   // esc key event
						});
						openDiv('bats');*/
						var now = new Date();
						var time = now.getTime();
						time += 3600 * 1000;
						now.setTime(time);
						document.cookie = 
							'tblId_'+MDOCIDJ+'=' + escape(ref_number) + 
							'; expires=' + now.toGMTString() + 
							'; path=/' +
							'; domain='+cookieondomain;
						window.location.href = baseurl+'/tblchkout/1';
					}
					else
					{
						closeDiv('batvc');
						$('#batcfm').css('display','none');
						$('#btbcdate_cnan1').html("<span>"+$('#btcompname').val()+"</span>&nbsp;("+$('#btareaname').val()+")");
						$('#apierrormsg').html('We are currently not able to receive any request for reservation.<br />Kindly try after some time.');
						openDiv('batapierr');
					}
				}
				else if(flag == 6) //error
				{
					//$('#bat').css('display','none');
					$('#batvc').css('display','none');
					$('#batcfm').css('display','none');				
					if(errormsg == 'booking not available')
					{
						$('#btbcdate_cnan').html("<span>"+data.resultsdata[0].cname+"</span>&nbsp;("+data.resultsdata[0].area+")");
						$('#bcdate').html(data.resultsdata[0].selectedDate.replace(/\-/g,"/"));
						if(data.resultsdata[0].company_number.length > 4)
						var compno = '<b>Restaurant No. - '+data.resultsdata[0].company_number+' </b>';
						$('#bcdateno').html(compno);
						openDiv('batbcdate');
					}
					else
					{
						$('#btbcdate_cnan1').html("<span>"+$('#btcompname').val()+"</span>&nbsp;("+$('#btareaname').val()+")");
						$('#apierrormsg').html('We are currently not able to receive any request for reservation.<br />Kindly try after some time.');
						//errormsg.charAt(0).toUpperCase() + errormsg.slice(1)
						openDiv('batapierr');
					}
				}
				else if(flag == 7) //timeslot
				{
					/*var before_slot = '';
					var after_slot = '';*/
					$('#compid').val(btcid);
					$('#tsna').html($("#bttime :selected").text());
					$('#dtna').html(btdate.replace(/\-/g,"/"));
					
					$('#batcfm_cname2').html($('#btcompname').val()+"&nbsp;<span class='whr'>("+$('#btareaname').val()+")</span>");
					var avilTS = '';
					
					var availInfo_arr = data.resultsdata[0].avail_slot.split('$$');
					for(var k=0; k < availInfo_arr.length; k++)
					{
						if(availInfo_arr[k] != 'undefined' || availInfo_arr[k] != '')
						{
							var availInfo_arr1 = availInfo_arr[k].split('|');
							avilTS += "<li><a href='javascript:void(0);' onclick='bookAtable(3,\"\",this.id,1);' id='avlblt"+k+"'>"+availInfo_arr1[0]+"</a></li>";
						}
					}
					
					$('#avil_time_slot').html(avilTS);
					openDiv('batte');
				}
				else if(flag == 9) //confirmation
				{
					$('#btcid').val(btcid);
					$('#btrefNum1').val(data.resultsdata[0].reference_number);
					var ref_number = data.resultsdata[0].reference_number;
					/*closeDiv('bat');
					closeDiv('batvc');
					$('#btcid').val(btcid);
					$('#btrefNum1').val(data.resultsdata[0].reference_number);
					$('#batcfm_cname').html("<span>"+$('#btcompname').val()+"</span>&nbsp;<span class='whr'>("+$('#btareaname').val()+")</span>");
					$('#btUName').html(data.resultsdata[0].btname);
					$('#btcfmdt').html(data.resultsdata[0].btdate);
					$('#btcfmnp').html(data.resultsdata[0].btnoprsn);
					$('#btcfmtm').html(data.resultsdata[0].bttime);
					$('#btcfmcn').html($('#btcompname').val()+"&nbsp;("+$('#btareaname').val()+")");
					$('#bat').css('display','none');
					$('#batvc').css('display','none');
					openDiv('batcfm');*/
					bookAtable('4', '','','',ref_number);
				}
				else if(flag == 10) //blacklisted
				{
					//closeDiv('bat');
					openDiv('blacklist');
				}
			});
			
		}  
	}
}

function mobile_validation(mobile_number)
{
	var first_digit = mobile_number.charAt(0);
	var number_length = mobile_number.length;
	if(!isValid(mobile_number, 'numeric'))
		return "Please enter valid mobile number.";
	if(mobile_number.indexOf("+91") != -1 || mobile_number.indexOf("0") == 0 || number_length != 10)
		return "Please enter valid mobile number.";
	if(first_digit != 9 && first_digit != 8 && first_digit != 7)
		return "Please enter a valid mobile number.";
	if(mobile_number == "9867045061")
		return "Please enter a valid mobile number.";
	return "valid";
}

function GetXmlHttpObject()
{
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		return new XMLHttpRequest();
	}
	if (window.ActiveXObject)
	{
		// code for IE6, IE5
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	return null;
}

function ratethisVerificationResend(mobile, modName)
{
  if(modName == undefined) {
	  modName = 'reviews';
  }		
  var mobile_req = new GetXmlHttpObject();
  if(mobile != '') {
	var mobile_no = mobile;
  } else {
	var mobile_no = getCookie('rev_mobile');
  }
  var errmsg = '';
  

  mobile_req.onreadystatechange = function ()
  {
		if(mobile_req.readyState == 4)
		{
		  if(mobile_req.responseText == 'SUCCESS')
		  {
			errmsg = 'Verification code sent successfully';
		  }
		  else if(mobile_req.responseText == 'FAILED')
		  {
			errmsg = 'Code sent failed! please try again';
		  }
		  else if(mobile_req.responseText == 'LIMIT_REACHED')
		  {
			errmsg = 'Daily sms limit reached';
		  }
		 
		  if($('#resend_msg_bat'))
		  {
			  $('#resend_msg_bat').show();
			  $('#resend_msg_bat').html(errmsg);
			  $('#btvcodeErr').hide();
			  $('#btvcodeErr').html('');
		  }
		  else
		  {
			$('#resend_msg').show();
			$('#resend_msg').html(errmsg);
		  }
		  return false;      
		}
    return false;
	};
	mobile_req.open("GET", WEBROOT+"functions/resend_mobile_verification_code.php?mobile="+mobile_no+"&module="+modName); //make connection
	mobile_req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=iso-8859-1"); // set Header
	mobile_req.send(null);
}

function nonWorkingDates(date){
	var day = date.getDay(), sun = 0, mon = 1, tue = 2, wed = 3, thu = 4, fri = 5, sat = 6;
	
        var tmpdt = '';
        if($("#hdnbtDate").val() != undefined){
             tmpdt = $("#hdnbtDate").val().split(",");
        }
       
        var closedDays = tmpdt; 
	
	if(closedDays.length > 0 && typeof(closedDays) != 'string')
	{
		for(var i = 0; i < (closedDays.length); i++) {
			if(closedDays[i][0] != '') {
				if (day == closedDays[i][0]) {
					return [false];
				}
			}
		}
	}
	return [true];
}

function nonWorkingDatesv(date){
	var day = date.getDay(), sun = 0, mon = 1, tue = 2, wed = 3, thu = 4, fri = 5, sat = 6;
	//var closedDays = [[mon], [tue]];
	var closedDays = closedDate; 
	if(closedDays.length > 0)
	{
		for(var i = 0; i < (closedDays.length); i++) {
			if(closedDays[i][0] != '') {
				if (day == closedDays[i][0]) {
					return [false];
				}
			}
		}
	}
	return [true];
}

/*Book A Table*/
$(document).ready(function()
{
	
	$("#btdate").click(function()
		{
			if ($('#ui-datepicker-div').css('display') == 'block') 
			{
				//$("select.hdn").css("visibility","hidden");
			}
		});
			
	$("#btdate").blur(function()
		{
			if ($('#ui-datepicker-div').css('display') == 'none') 
			{
			   $("select.hdn").css("visibility","visible");
			} 
		});
}); 

function convert12to24(timeStr)
{
    var meridian = timeStr.substr(timeStr.length-2).toLowerCase();
    var hours    = timeStr.substring(0, timeStr.indexOf(':'));
    var minutes  = timeStr.substring(timeStr.indexOf(':')+1, timeStr.indexOf(' '));
    if (meridian=='pm')
    {
		if(hours.substr(0,1) == 0) { 
			hours = hours.substr(1,1); 
		}
        hours = (hours=='12') ? '12' : parseInt(hours)+12 ;        
    }
    else if(hours.length<2)
    {
        hours = '0' + hours;
    }
    return hours+':'+minutes;
}

function getphotos(review_paid_id,pagename)
{  
	$.ajax({url:WEBROOT+"functions/sortbyphotosnew.php?contractid="+review_paid_id+"&cases=citycheck&pagename="+pagename,async:false, success:function(result){
		getphotos_html(result,pagename);		
	}});	
}

function getphotos_html(data,pagename)
{
	var dimenwh = (pagename == 'detail') ? 'width="69" height="51"' : '';
	var d = eval('(' + data + ')');
	var imagepart = 0;
	for(i=0;i<d.length;i++)
	{
		imagepart = i%4;
		if(typeof(d[i]['images']) != 'undefined' || typeof(d[i]['disp_pic']) != 'undefined' || typeof(d[i]['video']) != 'undefined')
		{
			/*Logo / Photo / Alphabet Logic*/
			if($("#shpimg_"+(paginationItemStartIndex+i)).attr('src') != 'null' && $("#shpimg_"+(paginationItemStartIndex+i)).attr('src')!= undefined)
			{
				if($('#shplogo_'+(paginationItemStartIndex+i)) && pagename =='result' && $("#shpimg_"+(paginationItemStartIndex+i)).attr('src').indexOf('clogobg2') != -1)
				{
					var log_html = '';
					var tmp_url = '';
					if (typeof(d[i]['images']) != 'undefined' || typeof(d[i]['disp_pic']) != 'undefined')
					{
						tmp_url = (typeof(d[i]['disp_pic']) != 'undefined' && d[i]['disp_pic']) ? d[i]['disp_pic'] : d[i]['images']['image_large'];
					
						if(imagepart == 1)
							tmp_url = tmp_url.replace('images.jdmagicbox.com','images1.jdmagicbox.com');
						if(imagepart == 2)
							tmp_url = tmp_url.replace('images.jdmagicbox.com','images2.jdmagicbox.com');
						if(imagepart == 3)
							tmp_url = tmp_url.replace('images.jdmagicbox.com','images3.jdmagicbox.com');
						
						$('#shplogo_'+(paginationItemStartIndex+i)).html('');
						$('#shplogo_'+(paginationItemStartIndex+i)).attr( "data-original", tmp_url );
						//$('#shplogo_'+(paginationItemStartIndex+i)).live( "click",function(){_ct('photos',(pagename =='result') ? 'lspg' :'dtpg');} );
						if(i < 5 ){
								firstrelphotos[i] =  tmp_url;
								$('#shplogo_'+(paginationItemStartIndex+i)).css({'background':'url(' + tmp_url + ') 50% 50% no-repeat', 'background-size':'cover'});
						}else{
								relphotos[i] =  tmp_url;
								$('#shplogo_'+(paginationItemStartIndex+i)).removeClass('lazy');
								$('#shplogo_'+(paginationItemStartIndex+i)).addClass('lazynew');
								$('#shplogo_'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
						}
						//$('#shplogo_'+(paginationItemStartIndex+i)).css({'background':'url(' + tmp_url + ') 50% 50% no-repeat', 'background-size':'cover'});
						$('#shplogo_'+(paginationItemStartIndex+i)).removeClass('nlogo');
					}
					else if(typeof(d[i]['video']) != 'undefined')
					{
							tmp_url = d[i]['video'];
							log_html += '<span class="vidlink"><span class="vicn"></span></span>';
							log_html += '<span class="vdlngth"></span>';

							$('#shplogo_'+(paginationItemStartIndex+i)).html(log_html);
							$('#shplogo_'+(paginationItemStartIndex+i)).attr( "data-original",tmp_url );
							//$('#shplogo_'+(paginationItemStartIndex+i)).live( "click",function(){_ct('compvideo',(pagename =='result') ? 'lspg' :'dtpg');} );
							if(i < 5 ){
								
								firstrelphotos[i] =  tmp_url;
								$('#shplogo_'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
							}else{
									relphotos[i] =  tmp_url;
									$('#shplogo_'+(paginationItemStartIndex+i)).removeClass('lazy');
									$('#shplogo_'+(paginationItemStartIndex+i)).addClass('lazynew');
									$('#shplogo_'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
							}
							//$('#shplogo_'+(paginationItemStartIndex+i)).css({'background':'url(' + tmp_url + ') 50% 50% no-repeat', 'background-size':'cover'});
							$('#shplogo_'+(paginationItemStartIndex+i)).addClass('clogo');
							$('#shplogo_'+(paginationItemStartIndex+i)).removeClass('nlogo');
					}
				}
			}
			else if($('#newphoto'+(paginationItemStartIndex+i)) && (pageName =='result' || pageName =='nssearch'))
			{
				var log_html = '';
				var tmp_url = '';
				if (typeof(d[i]['images']) != 'undefined' || typeof(d[i]['disp_pic']) != 'undefined')
				{
					tmp_url = (typeof(d[i]['disp_pic']) != 'undefined' && d[i]['disp_pic']) ? d[i]['disp_pic'] : d[i]['images']['image_large'];
				
					if(imagepart == 1)
						tmp_url = tmp_url.replace('images.jdmagicbox.com','images1.jdmagicbox.com');
					if(imagepart == 2)
						tmp_url = tmp_url.replace('images.jdmagicbox.com','images2.jdmagicbox.com');
					if(imagepart == 3)
						tmp_url = tmp_url.replace('images.jdmagicbox.com','images3.jdmagicbox.com');
					
					//log_html += '<img '+dimenwh+' src="'+tmp_url+'" id="chg_logo'+i+'" style="width:134px;">';
					//resize_img(tmp_url, 'chg_logo'+i, 'newphoto'+i, pagename);
					
					$('#newphoto'+(paginationItemStartIndex+i)).attr( "data-original", tmp_url );
					$('#newphoto'+(paginationItemStartIndex+i)).html('<span class="rghtimgarw" ></span>');
					$('#newphoto'+(paginationItemStartIndex+i)).attr( "data-original",tmp_url );
					$('#newphoto'+(paginationItemStartIndex+i)).live( "click",function(){_ct('photos','lspg');} );
					if(i < 5 ){
						firstrelphotos[i] =  tmp_url;
						$('#newphoto'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
					}else{
							relphotos[i] =  tmp_url;
							$('#newphoto'+(paginationItemStartIndex+i)).removeClass('lazy');
							$('#newphoto'+(paginationItemStartIndex+i)).addClass('lazynew');
							$('#newphoto'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
					}
					$('#newphoto'+(paginationItemStartIndex+i)).addClass('clogo');
					$('#newphoto'+(paginationItemStartIndex+i)).removeClass('nlogo');
				}
				else if(typeof(d[i]['video']) != 'undefined')
				{
						tmp_url = d[i]['video'];
						log_html += '<span class="vidlink"><span class="vicn"></span></span>';
						log_html += '<span class="vdlngth"></span>';

						$('#newphoto'+(paginationItemStartIndex+i)).html(log_html);
						$('#newphoto'+(paginationItemStartIndex+i)).attr( "data-original",tmp_url );
						$('#newphoto'+(paginationItemStartIndex+i)).live( "click",function(){_ct('compvideo','lspg');} );
						if(i < 5 ){
							firstrelphotos[i] =  tmp_url;
							$('#newphoto'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
						}else{
							relphotos[i] =  tmp_url;
							$('#newphoto'+(paginationItemStartIndex+i)).removeClass('lazy');
							$('#newphoto'+(paginationItemStartIndex+i)).addClass('lazynew');
							$('#newphoto'+(paginationItemStartIndex+i)).css({'background':'url("http://images.jdmagicbox.com/icontent/clogobg2.gif") 50% 50% no-repeat', 'background-size':'cover'});
						}
						//$('#newphoto'+(paginationItemStartIndex+i)).css({'background':'url(' + tmp_url + ') 50% 50% no-repeat', 'background-size':'cover'});
						$('#newphoto'+(paginationItemStartIndex+i)).addClass('clogo');
						$('#newphoto'+(paginationItemStartIndex+i)).removeClass('nlogo');
				}
			}
			else
			{
				var log_html = '';
				var tmp_url = '';

				var pre_img = '';

				if($('#cmp_logo'))
					pre_img = $('#cmp_logo').attr('src');

				if(pre_img != undefined && pre_img != '' && pre_img != null && pre_img.indexOf('preloader.gif') != -1)
				{
					if (typeof(d[i]['images']) != 'undefined' || typeof(d[i]['disp_pic']) != 'undefined')
					{
						tmp_url = (typeof(d[i]['disp_pic']) != 'undefined' && d[i]['disp_pic']) ? d[i]['disp_pic'] : d[i]['images']['image_large'];
						
						if(imagepart == 1)
							tmp_url = tmp_url.replace('images.jdmagicbox.com','images1.jdmagicbox.com');
						if(imagepart == 2)
							tmp_url = tmp_url.replace('images.jdmagicbox.com','images2.jdmagicbox.com');
						if(imagepart == 3)
							tmp_url = tmp_url.replace('images.jdmagicbox.com','images3.jdmagicbox.com');
						
						log_html += '<img '+dimenwh+' src="'+tmp_url+'" id="cmp_logo">';
						$('#chg_dtl_logo').html('<span class="rghtimgarw" ></span>');
						$('#chg_dtl_logo').css({'background':'url(' + tmp_url + ') 50% 50% no-repeat', 'background-size':'cover'});
						$('#chg_dtl_logo').css({'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+tmp_url+'", sizingMethod="scale")'});
						$('#chg_dtl_logo').css({'-ms-filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+tmp_url+'", sizingMethod="scale"'});
						$('#chg_dtl_logo').live( "click",function(){_ct('photos','dtpg');} );
					}
					else if(typeof(d[i]['video']) != 'undefined' && d[i]['video'])
					{
						tmp_url = d[i]['video'];
						log_html += '<span class="vdoplyicn"></span>';
						log_html += '<span class="vdlngth"></span>';
						$('#chg_dtl_logo').html(log_html);
						$('#chg_dtl_logo').css('background', 'url(' + tmp_url + ') 50% 50% no-repeat');
						$('#chg_dtl_logo').css('background-size', 'cover');
						$('#chg_dtl_logo').live( "click",function(){_ct('compvideo','dtpg');} );
					}
				}
			}
		}
	}
}

/* Sort by photos start */

function resize_img(image,imgid,imgwrap,pagename,frshop)
{
	var theImage 	= new Image();
	theImage.src 	= image;

	theImage.onload = function(){
		var imgwidth 	= theImage.width;
		var imgheight 	= theImage.height;
		
		if(pagename == 'result')
		{
			var containerwidth  =  178;
			var containerheight =  178;
		}
		else if(pagename == 'detail' && imgwrap == 'chg_dtl_logo')
		{
			var containerwidth  =  220;
			var containerheight =  210;
		}
		else if(pagename=='shopfront')
		{
			var containerwidth  =  60;
			var containerheight =  90;
		}
		else if(pagename=='shopfront_main')
		{
			var containerwidth  =  250;
			var containerheight =  250;
		}
		else
		{
			var containerwidth  =  100;
			var containerheight =  75;
		}
	
		if(imgwidth	> containerwidth){
			var newwidth = containerwidth;
			var ratio = imgwidth / containerwidth;
			var newheight = imgheight / ratio;
			if(newheight > containerheight){
				var newnewheight = containerheight;
				var newratio = newheight/containerheight;
				var newnewwidth =newwidth/newratio;
				theImage.width = newnewwidth;
				theImage.height= newnewheight;
			}
			else{
				theImage.width = newwidth;
				theImage.height= newheight;
			}
		}
		else if(imgheight > containerheight){
			var newheight = containerheight;
			var ratio = imgheight / containerheight;
			var newwidth = imgwidth / ratio;
			if(newwidth > containerwidth){
				var newnewwidth = containerwidth;
				var newratio = newwidth/containerwidth;
				var newnewheight =newheight/newratio;
				theImage.height = newnewheight;
				theImage.width= newnewwidth;
			}
			else{
				theImage.width = newwidth;
				theImage.height= newheight;
			}
		}
		
		if(pagename != 'shopfront_main' )
		{
		$('#'+imgid).css('width',theImage.width);
		$('#'+imgid).css('height',theImage.height);
		//$('.'+imgwrap).css('width',theImage.width);
		}

		var w = theImage.width/2;
		var h = theImage.height/2;
		
		if(pagename == 'shopfront_main' )
		{
			$('#'+imgid+' #wrap').css('width',theImage.width);
			$('#'+imgid+' #wrap').css('height',theImage.height);
			$('#'+imgid+' #wrap').css('margin-top','-'+h+'px');
			$('#'+imgid+' #wrap').css('margin-left','-'+w+'px');
			$('#'+imgid+' #wrap').css('left','50%');
			$('#'+imgid+' #wrap').css('top','50%');
			$('#'+imgid+' #wrap').css('position','absolute');
		}
		else if(imgwrap != 'chg_dtl_logo' || typeof frshop == 'undefined')
		{
				$('#'+imgid).css('margin-top','-'+h+'px');
				$('#'+imgid).css('margin-left','-'+w+'px');
				$('#'+imgid).css('left','50%');
				$('#'+imgid).css('top','50%');
				$('#'+imgid).css('position','absolute');
		}
	}	
}
 
/* Sort by photos end */

function toggleDropDown(divId, arrId, dwn, up)
{
    $(".show_dt").each(function( index ) {
        if($("."+index).attr('id') != divId) {
            $("."+index).hide();    
        }
    });
    $('#'+divId).slideToggle(300);    
}
function strstr (haystack, needle, bool) {
 
  var pos = 0;

  haystack += '';
  pos = haystack.indexOf(needle);
  if (pos == -1) {
    return false;
  } else {
    if (bool) {
      return haystack.substr(0, pos);
    } else {
      return haystack.slice(pos);
    }
  }
}

function checkBookTableOwner(docid)
{
    	var vbtmobile = getCookie('inLogMobile');
	var inClienUID = getCookie('inClienUID');
	if(vbtmobile != undefined && vbtmobile != '' && inClienUID != '' && inClienUID != undefined)
	{
		$.ajax({
			url: WEBROOT+"functions/ajxrsvndetails.php",
			type: "GET",
			dataType:"json",
			data : {
					'mobile':vbtmobile,
					'docid':docid,
					'type':'checkowner'
				   },
			success : function(result)
			{
				if(result == 1)
				{
					var now = new Date();
					var time = now.getTime();
						time += 3600 * 1000;
					now.setTime(time);
					document.cookie = 
						'vendorpop=' + escape(1) + 
						'; expires=' + now.toGMTString() + 
						'; path=/' +
						'; domain='+cookieondomain;
					window.location = WEBROOT+"Account/Table-Rsvn?vndr=1";
				}
				else
				{
					bookAtable('',docid);
				}
			}
		});
	}
	else
	{
            	bookAtable('1',docid);
	}
					
}

function resetAddressHeight() {	
	$('[id^="addr_"]').each(function() {
			cnt = $(this).attr("cnt");
			if (cnt!="" && cnt!='undefined' && ((parseInt(cnt)%2)==0)){				
				nextId = parseInt(cnt)+1;				
				if($('#addr_'+cnt).length && $('#addr_'+nextId).length){
					var ad1 = $('#addr_'+cnt).height();
					var ad2 = $('#addr_'+nextId).height();
					
					//alert(ad1+ " - "+ad2);
					if(ad1 > ad2){
						$('#addr_'+cnt).height(ad1);
						$('#addr_'+nextId).height(ad1);
					}
					else {
						$('#addr_'+cnt).height(ad2);
						$('#addr_'+nextId).height(ad2);
					}
				}
			}
			$('#addr_'+cnt+',#addr_'+nextId).parent('.address').css('visibility','visible');
		});    
}

function openNewOrder(url) 
{
	var now = new Date();
	var time = now.getTime();
		time += 3600 * 1000;
	now.setTime(time);
	document.cookie = 
		'vend=' + escape(1) + 
		'; expires=' + now.toGMTString() + 
		'; path=/' +
		'; domain='+cookieondomain;
	window.location = url;	
}

$(document).ready(function()
{
	var vend = getCookie('vend');
	var inClientUID = getCookie('inClienUID');
	if(vend == 1 && inClientUID != '')
	{
		startOrder();
		deleteCookie('vend','',-1);
	}
	$('a.content-link').click(function() {	
		var $this = $(this);
		var id = $this.attr('id');
		var tmp = id.split('_');
		var linkid = tmp[1];
		$('#content-' + tmp[1]).show();
		$('section.trmsrght').not($('#content-' + tmp[1])).hide();
		$this.addClass('jact');
		$('.trmslft ul li a').not($this).removeClass('jact');
		return false;
	});		
}); 
                  

 
function openTermOfUse(url) 
{
	var tuse = '<img src="'+url+'" />';
	$('#tuse').html(tuse);
	openDiv('termsuse');
  
}    

function showImageGlry(url,node){
	if(url=='' && baseurl!='undefined'){
		url = baseurl;
	}
	var img_url = $('#'+node).css('background-image');
	img_url = /^url\((['"]?)(.*)\1\)$/.exec(img_url);
    img_url = img_url ? img_url[2] : ""; // If matched, retrieve url, otherwise ""
	showImageGall(url,img_url);
}
function showImageGall(url,img_url){
	
	var currentPageUrl = "";
    if (typeof this.href === "undefined") {
        currentPageUrl = document.location.toString();
    }
    else {
        currentPageUrl = this.href.toString();
    }
	var now = new Date();
		var time = now.getTime();
		time += 3600 * 1000;
		now.setTime(time);
		document.cookie = 
			'gallery_img=' + escape(img_url) + 
			'; expires=' + now.toGMTString() + 
			'; path=/' +
			'; domain='+cookieondomain;
			
    currentPageUrl = currentPageUrl.replace(/\/laundrypickup\?t=1|\/laundrypickup\?t=2|\/laundrypickup\?t=3|\/courier\?t=(.)*$/, '');
    document.cookie = 
        'bkurl=' + escape($.trim(currentPageUrl)) + 
        '; expires=' + now.toGMTString() + 
        '; path=/' +
        '; domain='+cookieondomain;
        if(url.indexOf('pid=') != -1){
			document.location.href = url+'&tab=photogallery';
		}else{
			document.location.href = url+'/photogallery';	
		}
}

function redirToBookTbl(){
    
     var HREF = baseurl+'/bookatable';
     window.location.href = HREF;
    
}

function closeBgPop()
{
	if($('#jra').is(':visible'))
	{
		closeDiv('jra');
	}
	
	if($('#ri').is(':visible'))
	{
		closeDiv('ri');
	}

	if($('#jfb').is(':visible'))
	{
		closeDiv('jfb');
	}
	
	if($('#wsms').is(':visible'))
	{
		closeDiv('wsms');
	}
	
	if($('#jwd').is(':visible'))
	{
		closeDiv('jwd');
	}
	
	if($('#jvc').is(':visible'))
	{
		closeDiv('jvc');
	}
	
	if($('#slnk').is(':visible'))
	{
		closeDiv('slnk');
	}
	
	if($('#dwlpvc').is(':visible'))
	{
		closeDiv('dwlpvc');
	}
}

function openGall(divname,doc_id,node){
	//alert(doc_id);
	if (window.history && window.history.pushState) {
		window.history.pushState('forward', null, location.href);
		$(window).on('popstate', function() {
			if($('#phouter').length && document.getElementById('phouter').style.display == "block")
			{
				closeDiv(divname);
			}})
		;}
	openDiv(divname);
	if($.browser.msie && $.browser.version.substr(0, 1) < 7)
	{	window.scrollTo(0,0);	}

	$('#loader').removeClass('phloader');
	$('#loader').addClass('phloader');
	$('#loader').css({'height':$(window).height()});
	var galhtml = '';
	$.ajax({url:WEBROOT+"functions/getGallphotos.php?id="+doc_id,async:true, success:function(result){
		
		var img_url = $('#'+node).css('background-image');
		img_url = /^url\((['"]?)(.*)\1\)$/.exec(img_url);
		img_url = img_url ? img_url[2] : "";
		gallery_img = img_url;
		
		var d = eval('(' + result + ')');
		$('#cn_name').html(d.cn+', ');
		$('#cn_add').html(d.cn_add);
		var vid_wd = (d.photo_count>0)? '' :'wd';
		//$('#loader').removeClass('phloader');
		if(d.photo_count>0){
			
		galhtml +='<div class="es-carousal-new"><ul></ul></div>';
		galhtml +='<div id="rg-gallery" class="rg-gallery">';
					galhtml +='<div class="rg-thumbs">';
					galhtml +='<div class="es-carousel-wrapper">';
						
		if(d.video.showvideo){
			galhtml +='<span onclick="_ct(\'compvideo\',\'glpg\');" class="vidtmb"><a href="javascript:;" onClick="viewVidThumb();" ><img src="'+d.video.videothumb+'" height="75" /><span class="varow"></span></a></span>';
			}				
									
			galhtml +='<div class="es-carousel"><ul>';
			var j=0;
			for(var i=0; i< d.photo_count ; i++){					
			  galhtml +='<li>';
				galhtml +='<a href="#"><img src="'+d.photos[i].image_thumb+'" data-large="'+d.photos[i].image_org+'" alt="'+d.photos[i].image_name+'" data-description="'+d.photos[i].image_desc+'" /></a>';
				
					galhtml	+='<div class="dn" id="phdt_text_'+ ++j +'">';
					
						
					if(typeof(d.photos[i].upload_by) != 'undefined' && typeof(d.photos[i].upload_by) != null){ 
								var gall_uploaded_by = '';
								var username = '';
								
									if(typeof(d.username[d.photos[i].upload_by]) != 'undefined' && typeof(d.username[d.photos[i].upload_by]) != null){
										username = d.username[d.photos[i].upload_by];
									}
								var userimage = '';
									if(typeof(d.userimage[d.photos[i].upload_by]) != 'undefined' && typeof(d.userimage[d.photos[i].upload_by]) != null){
										userimage = d.userimage[d.photos[i].upload_by];
									}
								var salutation = '';
								
									if(typeof(d.salutation[d.photos[i].upload_by]) !== 'undefined' && typeof(d.salutation[d.photos[i].upload_by]) !== null){
										salutation = d.salutation[d.photos[i].upload_by];
										
										if(salutation.toLowerCase().indexOf('dr ') > 0 || salutation.toLowerCase().indexOf('dr. ') > 0 )
										{
											if( userimage=='profilepic/defaultpic.jpg' || userimage=='')
											{
												gall_uploaded_by = IMGDOMAIN+'doc.gif';
											}
											else
											{
												gall_uploaded_by = JDMAGICBOX+userimage;
											}
										}
										else if(salutation.toLowerCase().indexOf('ms ') >0 || salutation.toLowerCase().indexOf('ms. ') > 0 || salutation.toLowerCase().indexOf('mrs ') > 0 || salutation.toLowerCase().indexOf('mrs. ') >0 )
										{
											if(userimage=='profilepic/defaultpic.jpg' || userimage=='')
											{
												gall_uploaded_by = IMGDOMAIN+'she.gif';
											}
											else
											{
												gall_uploaded_by = JDMAGICBOX+userimage;
											}
										}
										else
										{
											if(userimage=='profilepic/defaultpic.jpg' || userimage=='')
											{
												gall_uploaded_by = IMGDOMAIN+'he.gif';
											}
											else
											{
												gall_uploaded_by = JDMAGICBOX+userimage;
											}
										}
									}
									
								
								//return false;
							
							if(gall_uploaded_by!='' && username !=''){	
							
							galhtml	 +='<span class="usrdt"><img width="64px" height="64px" alt="" src="'+gall_uploaded_by+'" /><span>Photo by<br />'+username+'</span></span>';	
							 } 
							} 
							 
						var image_name = d.photos[i].image_name;	
							image_name = (image_name != null)? image_name : '';
						var image_desc = d.photos[i].image_desc; 
							image_desc = (image_desc != null)? image_desc : '';	
							
					galhtml	  +='<span class="phhd">'+image_name+'</span>';
					galhtml	  +='<div class="phdescr">'+image_desc+'</div>';
					galhtml	  +='</div>';
					galhtml	  +='</li>';
				    } 
							galhtml	  +='</ul>';
							galhtml	  +='</div>';
						galhtml	  +='</div><!-- es-carousel-wrapper -->';
					galhtml	  +='</div><!-- rg-thumbs -->';
					
				galhtml	  +='</div><!-- rg-gallery -->';
				galhtml	  +='<div class="phdt" id="phdt">';
				galhtml	  +='</div><!-- phdt -->';
			}
				
				
			if(d.video.showvideo == 1){ 
				//galvideohtml	  +='<div class="vid_rt '+vid_wd+'">';
				galvideohtml ='';
				var video 	   = d.video.video;
					video = (video != null)? video : '';	
				var videothumb = d.video.videothumb;
					videothumb = (videothumb != null)? videothumb : '';	
				
				if(navigator.userAgent.indexOf("iPad") == -1 && navigator.userAgent.toLowerCase().indexOf("android") == -1)
				{
					galvideohtml	  +='<section class="jad">';
					galvideohtml	  +='<script language="JavaScript" type="text/javascript" src="'+WEBROOT +'tools/js/swfobject.js"></script><script language="JavaScript" type="text/javascript" src="'+WEBROOT +'tools/js/jwplayer.js"></script>';
						
					galvideohtml	  +='<div id="mediaspaces" style="margin-bottom:10px;"></div>';
					galvideohtml	  +='<script type="text/javascript">jwplayer("mediaspaces").setup({flashplayer: "'+WEBROOT+'player.swf",autostart: true,fullscreen: true,file: "'+video+'",height: 239,width: 280,image: "'+videothumb+'"});</script>';
					galvideohtml	  +='</section>';
				 }
				else{
					
				galvideohtml	 +='<section class="jad"><video id="my_video_1" class="video-js vjs-default-skin" width="282" height="220" poster="'+videothumb+'"  controls autoplay preload ><source src="'+d.video.videoarr.tgp+'" type="video/3gp" /><source src="'+d.video.videoarr.mp4+'" type="video/mp4" /><source src="'+d.video.videoarr.wmv+'" type="video/wmv" /><source src="'+d.video.videoarr.ogg+'" type="video/ogg" /><source src="'+d.video.videoarr.flv+'" type="video/flv" /></video></section><!-- jad -->';

				} 
				//galvideohtml	  +='</div>';
			 } 
		
		if(d.photo_count==0){
			galhtml +='<div class="vid_rt wd">'+galvideohtml+'</div>';
		}
		$('#gall_container').html(galhtml);
		
		
		$('#addPhotoJs').html('</script><script type="text/javascript" src="'+WEBROOT+'tools/js/ph_elastislide.js"></script><script type="text/javascript" src="'+WEBROOT+'tools/js/ph_gallery.js"></script>');
		
	
	}});
	
}

function goToId(id){
	if(document.getElementById(id)){
		$('html,body').animate({scrollTop:($("#"+id).offset().top)},'slow',function(){
		});
	}
}

function loadrelphotos(){
  $("a.lazynew").each(function(){	
	var self = this;
    var $self = $(self);
    var settings = {
			effect : "fadeIn",
			effect_speed : 2000
        };
    
    self.loaded = false;
	var original = $self.attr("data-original");
	
    if ($.inArray(original,relphotos) > -1) {
		$self.css("background-image", "url('" + original + "')");
		$self[settings.effect](settings.effect_speed);
		
		$self.css("background-image", "url('" + original + "')");
		self.loaded = true;
	}
	
	});
}

function loadfirstrelphotos(){
  $("a.lazy").each(function(){	
	var self = this;
    var $self = $(self);
    var settings = {
			effect : "fadeIn",
			effect_speed : 2000
        };
    
    self.loaded = false;
	var original = $self.attr("data-original");
	
    if ($.inArray(original,firstrelphotos) > -1) {
		$self.css("background-image", "url('" + original + "')");
		$self[settings.effect](settings.effect_speed);
			
		$self.css("background-image", "url('" + original + "')");
		self.loaded = true;
	}
	
	});
	
	setTimeout(function(){ loadrelphotos(); },500);
}

function option_select(id)
{	
	var arrMenu = [ "trans", "frnd", "usrprof" ];
	$.each( arrMenu, function( key, value ) {
	 if ((value == id) && (!$('#'+id+'_submu').is(':visible'))) {
			$('#'+id+' .pls').removeClass("pls").addClass("mins");
			$('#'+id+'_submu').removeClass("dn").addClass("dt");
		}
		else {
			$('#'+value+' .mins').removeClass("mins").addClass("pls");
			$('#'+value+'_submu').removeClass("dt").addClass("dn");
		}
	});
}


$(document).ready(function() {
	if(touchy == false){
	addtitle();
	if(onloadFn == 'Result' && $('.rupee').length)
	{
		$('.rupee').hover(function() {})}
	}
});
 
function showAnchorTitle(element, text) {
	if($('#anchorTitle').length)
		$('#anchorTitle').remove();
	
	$('body').append('<div id="anchorTitle" class="anchorTitle"></div>');
	var offset = element.offset();

	$('#anchorTitle')
	.css({
		'top'  : (offset.top + element.outerHeight() + 4) + 'px',
		'left' : offset.left + 'px'
	})
	.html(text)
	.show();
}

function hideAnchorTitle() {
	$('#anchorTitle').remove();
}

function banner_click(detail_id,banner_id,catid,city,banner_owner)
{
	var now = new Date();
	var cur_time = now.getTime();
	$.ajax({url:WEBROOT+"functions/banner_click.php?banner_id="+banner_id+"&detail_id="+detail_id+"&catid="+catid+"&city="+city+"&banner_owner="+banner_owner+"&date="+cur_time ,async:false, success:function(result)	
	{
	}});
}

function submitResetPassword() {
	if(validateForm("oldPassword","Old password must be filled out")==true) 
    {
        if (validateForm("newPassword","New password must be filled out") == true) 
        {
            if(validateFormCompare("newPassword","confirmPassword","Password is not matched")==true) 
            {
                if (resetPassword('changepass')==true) return true;							
            }
        }
    }

    return false;
}

function resetPassword(page) {
	$.post(WEBROOT+"functions/changepassword_log.php", {old_pass:$("#oldPassword").val(),new_pass:$("#newPassword").val(),
	confirm_new:$("#confirmPassword").val(),page:page
	}, function(data) {
		var result = data.split('###');
        $("#profmsg1").html(result[0]);
		if(result[1] == 1){
			closeDiv('resetPassword');
			openDiv('resetPasswordSuccess');
		}
	});
}

function validateFormCompare(id,id1,msg)
{
    var x=ed(id).value;
    var y=ed(id1).value;
    if (x==null || x=="")
    {
          ed(id+"Err").innerHTML = msg;
		  es(id+"Err").display = "block";
          ed(id).focus();
          return false;
    }
    if (y==null || y=="")
    {
          ed(id1+"Err").innerHTML = msg;
		  es(id1+"Err").display = "block";
          ed(id1).focus();
          return false;
    }
     if (y!=x)
    {
        ed(id1+"Err").innerHTML = msg;
		es(id1+"Err").display = "block";
         ed(id1).focus();
        return false;
    }
    ed(id+"Err").innerHTML = "";
    ed(id1+"Err").innerHTML = "";
    return true;
}

function shiftFocusToNextTextBox(currentId, nextFieldId) {
	if(touchy == false)
	{
		if($('#' + currentId).val().length >= $('#' + nextFieldId).attr('maxlength')){
			$('#' + nextFieldId).focus();
		}
	}
}
function batte(){
    
    openDiv('vbkdetails');
    
}

function add_favorites(docid,area,cmpnm,favflag)
{
	if(favflag && favflag == 1)
	{
		alert(ucwords(cmpnm)+" is already present in your favorite list.");
		return;
	}
	var cn		=	(cmpnm) ? cmpnm : $("#cn").val();
	$.ajax({
		   url:WEBROOT+"favorites.php", 
		   type: "get",
		   data :{
			  docid: docid,cases: 'addfav',area: area,what: cn, onloadFn : onloadFn, blacklist : blacklist
		   },
		   async:false, 
		   success:function(res){
			if(cmpnm)
			{
				if(res.indexOf('is already present in your favorite list') != -1)
				{
					alert(res);
				}
				else
				{
					$('html,body').animate({
						scrollTop: $(".jw").offset().top
					},'slow');
					if($('.nofvad').length)
					{
						$('.jdlc').html('<section class="favlst"><ul><li class="fav_category ltstfav"><span class="favrw" ><span class="fav_ct_name">Recently Added</span></span></li>'+res+"</ul></section>");
						addtitle();
					}
					else
					{
						if($('.ltstfav'))
						{
							$('li.ltstfav').after(res);
							if($('.ltstfav').hasClass('dn'))
							{
								$('.ltstfav').removeClass('dn');
							}
						}
						addtitle();
					}
					$('#addedfav').delay(2000).fadeOut("slow");
					document.getElementById('fvinp').value = '';
					$('#fvinp').focus();
				}
			}
			else
			{
				if(res.indexOf('is already present in your favorite list') != -1)
				{
					alert(res);
				}
				$('#fvcontent').html('<span class="fvlnk" ><span class="fvico"></span><em>Added to favorites</em></span>');
			}
		   }
	   });
	
}
function upd_delfav(docid,caseud,fvid)
{
	$.ajax({
		   url:WEBROOT+"favorites.php", 
		   type: "get",
		   data :{
			  docid: docid,cases: caseud, blacklist : blacklist
		   },
		   async:false, 
		   success:function(res){
			if(onloadFn == 'detailsPage')
			{
				$('#fvcontent').html('<span class="fvlnk" ><span class="fvico"></span><em>Added to favorites</em></span>');
			}
			else
			{
				if(caseud == 'deact')
				{
					$('#fvcomp'+fvid).html('<span class="favrmvt">Removed from the list <span class="sep">|</span> <a href="javascript:;" onclick="upd_delfav(\''+docid+'\',\'act\',\''+fvid+'\');">Undo</a></span>');
					$('#fvcp'+fvid).addClass('strk');
				}
				else if(caseud == 'act')
				{
					$('#fvcomp'+fvid).html('<a class="favrmvt" href="javascript:;" onclick="upd_delfav(\''+docid+'\',\'deact\',\''+fvid+'\');">Remove</a>');
					$('#fvcp'+fvid).removeClass('strk');

				}
				else if(caseud == 'edited')
				{
					if($('.nofvad').length)
					{
						$('.jdlc').html('<section class="favlst"><ul>'+res+"</ul></section>");
					}
					else
					{
						$('.jdlc .favlst ul').prepend(res);
					}
					$('#addedfav').delay(2000).fadeOut("slow");
					document.getElementById('fvinp').value = '';
					$('#fvinp').focus();
				}
			}
		   }
	   });
}
function addremoveclass(arcase,arclass,artoclass)
{
	if(arcase == 'add')
	{
		$('.'+arclass).addClass(artoclass);
	}
	else if(arcase == 'remove')
	{
		$('.'+arclass).removeClass(artoclass);
		if(arclass == 'fsrch_wrp')
		{
			$("#fvinp").val('Search for anything, anywhere in India');
			$('#fvinp').addClass('grey');
		}
	}
	
}

function getfav_comp()
{
	$.getJSON(WEBROOT+"ajxmain.php", {city: $('#city').val(),cases: 'suggestion', fav : 1 }, function(data) {
				if (data == null || $("#fvinp").is(":focus")) return false;
				
				$("#fvinp").val(data.results[0].category);
				$('#fvinp').addClass('grey');
			});
}

function favscroll() {
   if(!favajax && favnext > 0 && getScrollTop() + $(window).height() >= document.body.scrollHeight - 500)
   {
	$('.ldmore').removeClass('dn');
	favajax = true;
		$.ajax({
		   url:WEBROOT+"favorites.php", 
		   type: "get",
		   data :{
			  cases: 'showfav' , page : favnext, blacklist : blacklist
		   },
		   async:false, 
		   success:function(res){
				var favresult = eval('(' + res + ')');
				if(favresult.html && favresult.html != '')
				{
					$('.ldmore').addClass('dn');
					$('.jdlc .favlst ul').append(favresult.html);
					addtitle();
					
					favnext = favresult.nextpage;
					if(favresult.nextpage && favresult.nextpage != '')
					{
						$('.ldmore').removeClass('dn');
					}
					favajax = false;
				}else if(favresult.html == '')
				{
					$('.ldmore').addClass('dn');
				}
		   }
	   });
   }	
}
function ipad_fscroll() {
	//alert($('.btmoffset').offset().top);
    if($(window).scrollTop() >= $('.btmoffset').offset().top - $(window).innerHeight() + 50)
	{
	  $('#frlstoutr').removeClass('ipdfooter');
	}
	else
	{
		$('#frlstoutr').addClass('ipdfooter');
	}
}


function filtercroll() {
   if(!filajax && filnext > 0 && getScrollTop() + $(window).height() >= document.body.scrollHeight - 500)
   {
	$('.ldmore').removeClass('dn');
	var filterstringarr = filterstring.split('##');
	filajax = true;
		$.ajax({
		   url:WEBROOT+"functions/filters.php", 
		   type: "get",
		   data :{
			  city : filterstringarr[0] , vid : filterstringarr[1], search : filterstringarr[2], nid : filterstringarr[3], catid : filterstringarr[4], fpage : filnext
		   },
		   async:false, 
		   success:function(res){
				var filresult = eval('(' + res + ')');
				if(filresult.html && filresult.html != '')
				{
					
					if($('#srchpagination').length)
						$('#srchpagination').addClass('dn');
					
					$('.ldmore').addClass('dn');
					$('.appendfilter').append(filresult.html);
					addtitle();					
					filnext = filresult.nextpage;
					if(filresult.nextpage && filresult.nextpage != '')
					{
						$('.ldmore').removeClass('dn');
					}
					filajax = false;
				}
		   }
	   });
   }	
}

function removefav(page)
{
	favpajax = true;
	$.ajax({
		   url:WEBROOT+"favorites.php", 
		   type: "get",
		   data :{
			  cases: 'removefav', page : page, blacklist : blacklist
		   },
		   async:false, 
		   success:function(res){
				var favresult = eval('(' + res + ')');
				nextpfav=favresult.nextpage;
				if(favresult.html && favresult.html != '')
				{
					if(page == 1){
						$('.favrmv .favlst ul').html(favresult.html);
					}
					else {
						$('.favrmv .favlst ul').append(favresult.html);
					}
					if(nextpfav > 0)
					{
						favpajax = false;
					}
				}
		   }
	   });
}

String.prototype.ucwords = function() {
    str = this.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function($1){
            return $1.toUpperCase();
        });
}

function switch_profile(val)
{ 
    
    if(typeof($('#isreg').val()) !='undefined' && $('#isreg').val() == 1 && val == 1)
    {
        $("#clid").val('');
         document.cookie = 
        'clid=0'+ 
        '; expires=Thu, 01 Jan 1970 00:00:01 GMT'+ 
        '; path=/' +
        '; domain='+cookieondomain;
    }
    
    
	if($.browser.msie)
	{
		$('#swtchprof').css('filter','alpha(opacity=50)');
	}
	
	$('#swtchprof').fadeIn('slow').fadeOut('slow',function(){
		$.ajax({
				url		: WEBROOT+"ajxmain.php",
				async	: false,
				type	: "get",
				data	: {cases : 'profile', usrflw : val},
				success : function(result){
					if(onloadFn == 'Newcms')
					{
						window.location.href = WEBROOT+'Account';
					}
					else
					{
                                           // Books vendor module change start
                                        if(getCookie('ln')=="7718826920" || getCookie('ln')=="9892486991")
                                            window.location.href = WEBROOT+'Account';
                                        else
                                            // Books vendor module change end
						window.location.reload(true);
					}
				}
		});
	});
}

function notify_profile_switch()
{
	var prof_ck = parseInt(getCookie('vendor_as_user'));
	var rurl = window.url;
	
	/*To show popup, when switched to user from login.justdial.com (Restaurant profile)*/
	if(rurl.indexOf('?') != -1)
	{
	  if(rurl.substr(rurl.indexOf('?')+1,rurl.length) == 'vendprof=1')
	  {
		 prof_ck = 1;
	  }
	}
	
	if(prof_ck === 1 || prof_ck === 0)
	{
		var pmsg = (prof_ck === 1) ? 'You are now logged in as <b>User</b>' : 'You are now logged in as <b>Vendor</b>';
		
		$('#swtchntfy .jGrowl-message').html(pmsg);
		$('#swtchntfy').fadeIn('slow').fadeOut(3000);
		
		document.cookie = "vendor_as_user=; expires=" + new Date(0).toUTCString() + "; path=/; domain=" + cookieondomain;
	}

}

function closentfy() 
{
    if($('#swtchntfy').is(':visible') == true)
	{
		$('#swtchntfy').hide();
    }
}

function touchScroll(id){
	if(isTouchDevice()){ //if touch events exist...
		var el=document.getElementById(id);
		var scrollStartPos=0;

		document.getElementById(id).addEventListener("touchstart", function(event) {
			scrollStartPos=this.scrollTop+event.touches[0].pageY;
			//event.preventDefault();
		},false);

		document.getElementById(id).addEventListener("touchmove", function(event) {
			this.scrollTop=scrollStartPos-event.touches[0].pageY;
			if(id == 'scrollarea' || id == 'bksCat')
			{
				event.preventDefault();
			}		
					
		},false);
	}
}
function isTouchDevice(){
	try{
		document.createEvent("TouchEvent");
		return true;
	}catch(e){
		return false;
	}
}

function validateMinLength(id,min)
{
	var val = $.trim($('#'+id).val());
	
	if(val.length < min)
		return false;
	else
		return true;
}

function ucwords (str) {
return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
return $1.toUpperCase();
});
}

/*new site*/

function hk_pop()
{
	if($("#navicn").hasClass('act'))
	{
		$("#navicn").removeClass('act');
		$(".menu_outer").addClass('dn');
	}
	else
	{
		if($(".menu_outer ul").length)
		{
			$(".menu_outer").toggleClass("dn");
			$("#navicn").toggleClass('act');
		}
		else
		{
			disp_hotkeys();
		}
		
		if(onloadFn == 'Index' || onloadFn == 'National Search')
		{
			_ct('hkpop','hmpg','');
		}
		else
		{
			_ct('hkpop','','');
		}
		
	}
}

function lg_pop(lidnt)
{
	if($("#acc_opt").hasClass('dn'))
	{
		$("#acc_opt").removeClass('dn');
		$('.ac_count').addClass('dn');
		_ct('acc',lidnt);
	}
	else
	{
		$("#acc_opt").addClass('dn');
		if(getCookie('frnototal') && getCookie('frnototal') > 0)
			$('.ac_count').removeClass('dn');
	}
}

function disp_hotkeys()
{
	var c = (onloadFn == 'National Search') ? 'National Search' : $("#city").val().trim();
	var where = '';
	if($('#where').length)
	{
		var whr = encodeURIComponent($("#where").val().trim());
		if (whr.substr(0,4)=='e.g.') {
			where = getCookie('sarea') ? getCookie('sarea') : '';
		} else {
			if(whr)
				where = whr;
			else if(getCookie('inweb_area'))
				where = getCookie('inweb_area');
			else if(getCookie('sarea'))
				where = getCookie('sarea');
			else
				where = '';
		}
	}
	var p = 'psc';
	var table = 'b2c';
	var url = "autosuggest.php?cases=popular&strtlmt=&city="+c+"&table="+table+"&where="+where+"&scity="+getCookie('scity');
	$.get(WEBROOT+url, {}, function(data) {
		
		if(data != '')
		{
			change = 1;
			var d = eval('(' + data + ')');
			var i = 0;
			var hktots = d.total;
			var hkcols = Math.ceil(d.total/5);
			var hkcnt = 0;

			/* Hot Keys Data */
			var html = '';
			for(i=0; i<3; i++)
			{
				var inhkc = d.results[i].length ;
				
				for(j=0; j < inhkc; j++)
				{
					if(d.results[i][j]['vid'] != 903)
					{
						var divht = (hkcnt)/hkcols;
						if(hkcnt%hkcols == 0)
							html += (divht%2 != 0 && hkcnt > 1) ? '<ul class="bgclr">' : '<ul>';
						
						var c = p + '_' + d.results[i][j]['vdname'];
						var assoc = d.results[i][j]['assoc'];
						var targetblk = '';
						/*if(assoc == 3) { targetblk = "target='_blank'";}*/ 
						html += '<li>';
							html += '<a href="'+d.results[i][j]['href']+'" onclick="_ct(\'' + c + '\',\'hmpg\');" '+targetblk+' title="'+d.results[i][j]['vdname'].trim()+' in '+$('#city').val()+'">';
								html += '<span class="'+d.results[i][j]['vicon']+'_s"></span><span class="htknm">'+d.results[i][j]['vdname']+'</span></a>';
						html += '</li>';
						hkcnt++;
						if(hkcnt%hkcols == 0 || hkcnt == hktots)html += '</ul>';
					}
				}
			}
			$(".menu_outer").html(html);
			$(".menu_outer").toggleClass("dn");
			$("#navicn").toggleClass('act');
		}
});
}

function friends_notify()
{
	var agec = '';
	var d = new Date();
	if(getCookie('frnotdt'))
	{
		var difference = d.getTime() - getCookie('frnotdt');
		var minutesDifference = Math.floor(difference/1000/60);
		if(minutesDifference < 15)
		{
			if(getCookie('frnototal') && getCookie('frnototal') > 0)
			{
				$(".ac_count").text(getCookie('frnototal'));
				$(".ac_count").removeClass('dn');
				$(".ac_countfr").text(getCookie('frnototal'));
				$(".ac_countfr").removeClass('dn');
				return false;
			}
			else
			{
				return false;
			}
		}
		else
		{
			agec = parseInt(getCookie('frnotdt') / 1000,10);
		}
	}
	var expDate = new Date();
	var offset = 1;
	expDate.setYear(expDate.getFullYear() + offset);
	document.cookie = 'frnotdt='+d.getTime()+'; expires=' + expDate.toGMTString() + ';path=/;domain='+cookieondomain+';' + ';';
	$.get(WEBROOT+"functions/companyreviews.php", {"mobile":getCookie('ln'),"age":agec}, function(data) {
		var d = eval('(' + data + ')');
		if(d.total > 0)
		{
			$(".ac_count").text(d.total);
			$(".ac_count").removeClass('dn');
			$(".ac_countfr").text(d.total);
			$(".ac_countfr").removeClass('dn');
			document.cookie = 'frnototal='+d.total+'; expires=' + expDate.toGMTString() + ';path=/;domain='+cookieondomain+';' + ';';
		}
	});
}

function getcartcount(vl)
{
	if(vl != '' && typeof(vl) != 'undefined')
	{	
		if(vl > 0)
		{
			$(".crt_count").text(vl);
			$(".crt_count").removeClass('dn');
		}
	}
	else
	{
		$.get(WEBROOT+"functions/cartcount.php", {"user_mobile":getCookie('ln')}, function(data) {
			var d = eval('(' + data + ')');
			if(d.total > 0)
			{
				$(".crt_count").text(d.total);
				$(".crt_count").removeClass('dn');
			}
		});
	}
}

function addtitle()
{
	$('a[title]').each(function() {

		var a = $(this);
		
		if(onloadFn != 'Index' && onloadFn != 'National Search'){
		a.hover(
			function() {
				showAnchorTitle(a, a.data('title'));
				a.attr("title", "");
			},
			function() {
				hideAnchorTitle();
				a.attr('title',  a.data('title'));
			}
		)
		.data('title', a.attr('title'));
		}
	});
}

/*added condition for fixing bug (ipad air)  */

/* window.document.addEventListener('orientationchange', function() {
	  var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
	  var viewportmeta = document.querySelector('meta[name="viewport"]');
	  if (iOS && viewportmeta) {
		if (viewportmeta.content.match(/width=device-width/)) {
		  viewportmeta.content = viewportmeta.content.replace(/width=[^,]+/, 'width=1');
		}
		viewportmeta.content = viewportmeta.content.replace(/width=[^,]+/, 'width=' + window.innerWidth);
	  }
	  //If you want to hide the address bar on orientation change, uncomment the next line
	 window.scrollTo(0, 0);
	}, false);
*/


function cancelHistoryAppt(wht, fld)
{
	var timestmp = new Date().getTime();
	var date = new Date();
	date.setYear(date.getFullYear() + 1);
	var apprefnum = '';
	var spltres = '';
	$("#histdocerrmsg").html("");

	if(wht == 'popup') {
		if(fld != '' && fld != 'null' && fld != null && fld != 'undefined' && typeof fld != 'undefined' && fld != undefined) {
			document.cookie = 'rfnum='+fld+';'+date+';path=/;domain='+cookieondomain;
			ischeckCancelAppt(fld);
		} else {
			$("#histdocerrmsg").html("Booking ID not found to cancel appointment");
			openDiv('histdocerr');
		}
	} else if(wht == 'cancel') {
		apprefnum = trim(getCookie('rfnum'));

		if(apprefnum != '' && apprefnum != null && apprefnum != 'null' && apprefnum != undefined && apprefnum != 'undefined' && typeof apprefnum != 'undefined') {
			$.ajax({
				url: WEBROOT + 'doc.php',
				async: false,
				type: 'POST',
				data: {
					action: 'histcancelappt',
					hist_ref_num: apprefnum,
					timestamp: timestmp
				},
				success: function(res) {
					if(res.indexOf('|@|') != -1) {
						spltres = res.split("|@|");
						if(spltres[0] == 1) {
							$("#histdocerrmsg").html("Appointment cancelled successfully");
							closeDiv('cnfcncl');
							openDiv('histdocerr');
						} else {
							if(spltres[1] === 'ACTION') {
								$("#histdocerrmsg").html("Action parameter missing");
							} else if(spltres[1] === 'DEFAULT') {
								$("#histdocerrmsg").html("Default action not allowed");
							} else if(spltres[1] == '' || spltres[1] == 'null' || spltres[1] == null || spltres[1] == 'undefined' || spltres[1] == undefined || typeof spltres[1] == 'undefined') {
								$("#histdocerrmsg").html("There was some problem due to which appointment cannot be cancelled. Try again later!");
							} else {
								$("#histdocerrmsg").html(spltres[1]);
							}

							closeDiv('cnfcncl');
							openDiv('histdocerr');
						}
					}
				}
			});
		} else {
			$("#histdocerrmsg").html("Booking ID not found to cancel appointment");
			closeDiv('cnfcncl');
			openDiv('histdocerr');
		}
	}
}

function ischeckCancelAppt(apptid)
{
	var tstamp = new Date().getTime();
	$.post(WEBROOT+"doc.php",{action:'cancelPolicy', appid: apptid, timestamp: tstamp}, function(data) {
		if(data == '' || data == null || data == 'null' || data == undefined || typeof data == 'undefined') {
			$("#histdocerrmsg").html("There was some problem.\nPlease try again!");
			openDiv('histdocerr');
		} else {
			var splt_dt = data.split('|@|');

			if(splt_dt[0] == 0) {
				openDiv('cnfcncl');
			} else {
				if(splt_dt[1] == '' || splt_dt[1] == 'null' || splt_dt[1] == null || splt_dt[1] == 'undefined' || splt_dt[1] == undefined || typeof splt_dt[1] == 'undefined') {
					$("#histdocerrmsg").html("There was some problem.\nPlease try again!");
					openDiv('histdocerr');
				} else if(splt_dt[1] == 'NOT_CANCEL') {
					$("#histdocerrmsg").html("Your cancellation time has been elapsed");
					openDiv('histdocerr');
				} else {
					$("#histdocerrmsg").html(splt_dt[1]);
					openDiv('histdocerr');
				}
			}
		}
	});
}

function closeHistErrPopup()
{
	var date = new Date();
	date.setYear(date.getFullYear() - 1);

	document.cookie = 'rfnum=;'+date+';path=/;domain='+cookieondomain;
	window.location = baseurl;
}

function checkKeyEvents()
{
	$(document).keydown(function(event) {
		var date = new Date();
		date.setYear(date.getFullYear() - 1);

        var isvidochiscncl = $('#cnfcncl').is(':visible');
        var isvidochiserr = $('#histdocerr').is(':visible');

        if((isvidochiscncl || isvidochiserr) && event.keyCode == 27) {
			document.cookie = 'rfnum=;'+date+';path=/;domain='+cookieondomain;
            window.location = baseurl;
        }
    });

    $(document).mousedown(function(event) {
        var isvidochiscncl = $('#cnfcncl').is(':visible');
        var isvidochiserr = $('#histdocerr').is(':visible');
        var date = new Date();
		date.setYear(date.getFullYear() - 1);

        if(isvidochiscncl || isvidochiserr) {
            if(event.target.offsetParent != null) {
                if((isvidochiscncl && event.target.offsetParent.id != 'cnfcncl') || (isvidochiserr && event.target.offsetParent.id != 'histdocerr')) {
                    var btnevent = event.which || event.button;

                    if((isvidochiscncl || isvidochiserr) && btnevent == 1) {
                        document.cookie = 'rfnum=;'+date+';path=/;domain='+cookieondomain;
                        window.location = baseurl;
                    }
                } else {
                    if(event.target.id == 'cnfcnclcls' || event.target.id == 'hisdocerrcls') {
                        document.cookie = 'rfnum=;'+date+';path=/;domain='+cookieondomain;
                        window.location = baseurl;
                    }
                }
            } else {
                document.cookie = 'rfnum=;'+date+';path=/;domain='+cookieondomain;
                window.location = baseurl;
            }
        }
    });
}


function gotoBookNew(nurl, rfnum, dcid)
{
	var notRfnum = (rfnum === null || rfnum === '' || rfnum === 'null' || rfnum === 'undefined' || rfnum === undefined || typeof rfnum === 'undefined') ? true : false;
	var notDcid = (dcid === null || dcid === '' || dcid === 'null' || dcid === 'undefined' || dcid === undefined || typeof dcid === 'undefined') ? true : false;

	var date = new Date();
	date.setYear(date.getFullYear() + 1);

	if(!notRfnum && !notDcid) {
		document.cookie = 'fromHist=1;'+date+';path=/;domain='+cookieondomain;
		document.cookie = 'apprefnumber='+rfnum+';'+date+';path=/;domain='+cookieondomain;
		document.cookie = 'mdyapp='+2+';'+date+';path=/;domain='+cookieondomain;
		document.cookie = 'doctid='+dcid+';'+date+';path=/;domain='+cookieondomain;
		window.location.href = nurl;
	} else {
		if(!notDcid) {
			document.cookie = 'doctid='+dcid+';'+date+';path=/;domain='+cookieondomain;
		}
		window.location.href = nurl;
	}
}

function getTestimonials()
{
	var name = 'pgtestimonials';
	var c_value = '';
	document.cookie = escape(name) + "=" + escape(c_value) + ";  path=/";
	window.location.href = CMSDOMAIN+"justdial-testimonials";
}

function replace_whatout()
{
	if(onloadFn != 'detailsPage' && onloadFn != 'Index' && org_onloadFn != 'National Search'  && $("#what").val() != '' && $("#where") && $('#where').val() != '' && $('#where').val().substr(0,4) != 'e.g.' && strstr($("#what").val().toLowerCase(),$('#where').val().toLowerCase()))
	{
		$("#what").val($("#what").val().replace((($('#where').val().substr(0,3).toLowerCase() == "at ") ? '' : ' Near ')+$('#where').val(),''));
	}
}

function aautodisp()
{
	$('#arBox').removeClass('dn');
	$('.detarea').addClass('dn');
	$('#where').focus();
}

function replace_whatin()
{
	if(onloadFn != 'detailsPage' && onloadFn != 'Index' && org_onloadFn != 'National Search' && avoidneararea != 1 && onloadFn != 'Index' && $("#what").val() != '' && $("#where") && $('#where').val() != '' && $('#where').val().substr(0,4) != 'e.g.' && !strstr($("#what").val().toLowerCase(),$('#where').val().toLowerCase()))
	{
		var actwhat = $("#what").val()+(($('#where').val().substr(0,3).toLowerCase() == "at ") ? '' : ' Near ')+$('#where').val();
		if($("#what").val() == iwhat)
			$("#what").val(actwhat);
	}
}

/*Shopfront faq*/
$(".mnDetails").find('.mn_ans:last').addClass('rst');
$(".mnLink").click(function() {
	$(this).next(".mnDetails").slideToggle();
	$(this).find(".rit_plus").toggleClass("rit_min");
});

function showSearchCardFriendsRatings()
{
	if(getCookie('ln') != '' && (onloadFn == 'Result' || onloadFn == 'detailsPage' || onloadFn == 'NSsearch' || onloadFn == 'National Search') && getCookie('attn_user') != 'logout')
	{
		$.get(WEBROOT+"ajxmain.php", {docids: $("#review_paid_id").val(),cases: 'srchfratings',city: $('#city').val()}, function(data) {
			if(data)
			{
				review_rating_lp(data);
			}
		});
	}
}


function synccity()
{
	document.cookie = 'inweb_area=;expires=0; path=/; domain=' + cookieondomain;
	if(document.cookie.indexOf("sarea") != -1){
		document.cookie = 'sarea=;expires=0; path=/; domain=' + cookieondomain;
	}
	fn_Banner();
	document.cookie = 'inweb_city='+getcity+'; '+date+';path=/; domain=' + cookieondomain;
	document.cookie = 'scity='+getcity+'; '+date+'; path=/; domain=' + cookieondomain;		   
}

// this code should only be included for search result listing page
if(typeof(pageName) != 'undefined' && (pageName == 'result' || pageName == 'nssearch') && lazyLoadingEnabled)
{
	var nationalSearch = (pageName == 'nssearch') ? 1 : 0;
	
	$(function () {
		//var searchTerm = (nationalSearch == 1) ? $('#what').val() : $('#searchterm').val();
		var searchTerm = (nationalSearch == 1) ? nSearchTerm : $('#searchterm').val();
		
		// if ajax call in progress or not
		var paginationAjaxStatus = 0;
		
		$(window).scroll(function () {
			var scrollerReachedEnd = false;
			
			// if jdgurantee shopfront result page
			if(jdGuarantee)
			{
				scrollerReachedEnd = ($(window).scrollTop() > $('section.vendorList:first').height() - 800);
			}
			else
			{
				scrollerReachedEnd = ($(window).scrollTop() > $('section.rslwrp:first').height() - 800);
			}
			
			if(paginationPageNum < paginationLastPageNum && paginationAjaxStatus == 0 && scrollerReachedEnd)
			{
				// increment this variable to send in ajax call to get next page 
				paginationPageNum++;
				
				// change this status code to 1 to indicate one ajax call is in progress
				paginationAjaxStatus = 1;
				
				// remove pagination links
				if(!$('#srchpagination').hasClass('dn'))
				{
					setTimeout(function () { $('#srchpagination').addClass('dn'); }, 3000);
				}
				
				// show loader
				$('.ldmore:first').removeClass('dn');
				
				// send ajax call to get markup for next page
				$.ajax({
					url: WEBROOT + "functions/ajxsearch.php",
					data: {
						"national_search": nationalSearch,
						"act": "pagination",
						"city": $('#city').val(),
						"search": searchTerm,
						"where": $('#where').val(),
						"catid": $('#catid').val(),
						"psearch": $('#psearch').val(),
						"prid": $('#prid').val(),
						"page": paginationPageNum
					},
					dataType: "json",
					success: function (response) {
						// hide loader
						$('.ldmore:first').addClass('dn');
						
						// if there is no error at server side
						if(response.error == 0)
						{
							// renew variable to store latest value after ajax call
							paginationItemStartIndex = response.itemStartIndex;
							paginationLastPageNum = response.lastPageNum;
							
							// set paid doc ids value for latest page
							$('#review_paid_id').val(response.paidDocIds);
							
							// if jdgurantee shopfront result page
							if(jdGuarantee)
							{
								$('.vendorList:first').append(response.markup);
							}
							else
							{
								$('.rslwrp:first').append(response.markup);
								// to load images of newly loaded cards (defined in common_org.js)
								getphotos(response.paidDocIds, pageName);
								loadfirstrelphotos();
								showSearchCardFriendsRatings();
							}
						}
						else
						{
							console.log(response.msg);
						}
						
						// change this status code to 0 to indicate no ajax call is in progress
						paginationAjaxStatus = 0;
					}
				});
			}
		});
	});
}

function getPincodeCity(pincode)
{
	if(pincode.length == 6 && PinCode != pincode)
	{
		$.ajax({
		type: "GET",
		url: WEBROOT+"ajxmain.php",
		data: {
			pincode:pincode,
			cases:'pincodecity'
			},
		dataType: "json",
		success: function(rslts){
				if(rslts.result.city != '')
				{
					if($('#edtAddr').is(':visible'))
					{
						$('#ptxtCity').val(rslts.result.city);
						$('#ptxtArea').val(rslts.result.areaname);
						$('#ptxtAreaId').val(rslts.result.area_id);
					}
					else
					{
						$('#txtCity').val(rslts.result.city);
						$('#txtArea').val(rslts.result.areaname);
						$('#txtAreaId').val(rslts.result.area_id);
						document.getElementById('txtCity').style.color = "#424242";
					}
					PinCode = pincode;
				}
			}
		});		
	}	
}

function setsescookie(docid,vfdisp)
{
	var ftdarr = {};
	ftdarr[docid] = vfdisp;
	var ftdarr1 = array2json(ftdarr);
	setCookiebest('vfdisp',ftdarr1);
}

function clearPincode()
{
	$('#txtPin').val('');
	$('#ptxtPin').val('');
}

function array2json(arr) {
    var parts = [];
    var is_list = (Object.prototype.toString.apply(arr) === '[object Array]');

    for(var key in arr) {
    	var value = arr[key];
        if(typeof value == "object") { //Custom handling for arrays
            if(is_list) parts.push(array2json(value)); /* :RECURSION: */
            else parts[key] = array2json(value); /* :RECURSION: */
        } else {
            var str = "";
            if(!is_list) str = '"' + key + '":';

            //Custom handling for multiple data types
            if(typeof value == "number") str += value; //Numbers
            else if(value === false) str += 'false'; //The booleans
            else if(value === true) str += 'true';
            else str += '"' + value + '"'; //All other things
            // :TODO: Is there any more datatype we should be in the lookout for? (Functions?)

            parts.push(str);
        }
    }
    var json = parts.join(",");
    
    if(is_list) return '[' + json + ']';//Return numerical JSON
    return '{' + json + '}';//Return associative JSON
}

function disparea()
{
	var html = '';
	if(document.cookie.indexOf("sarea") != -1)
	{
		html += '<span class="blmap"></span><span class="entarea"> <a href="javascript:;" onclick="aautodisp();">Enter Area</a></span><span class="sepr">|</span><span class="entarea"> <a href="javascript:;" onclick="getLocation();">Use My Location</a></span>';
	}
	else
	{
		html += '<span class="blmap"></span><span class="locdetc">Location not detected</span> <span class="sepr">|</span> <span class="entarea"> <a href="javascript:;" onclick="aautodisp();">Enter Area</a></span>';
	}
	return html;
}
function clear_area()
{
	document.cookie = 'sarea=;expires=0; path=/; domain=' + cookieondomain;
	document.cookie = 'inweb_area=;expires=0; path=/; domain=' + cookieondomain;
	$('.detarea').html('<span class="blmap"></span><span class="entarea"> <a href="javascript:;" onclick="aautodisp();">Enter Area</a></span><span class="sepr">|</span><span class="entarea"> <a href="javascript:;" onclick="getLocation();">Use My Location</a></span>');
	$("#where").val('');
	$('.locdetc').text('');
	fn_Banner();
}

if(typeof(pageName) != 'undefined' && pageName == 'my_account'  && lazyLoadingEnabled && (verticalName == 'bookacs' || verticalName == 'bookwps'))
{
	$(function () {
		var paginationAjaxStatus = 0;
		$(window).scroll(function () {
			var scrollerReachedEnd = ($(window).scrollTop() > $('section.acmid_content:first').height() - 800);
			
			if(paginationPageNum < paginationLastPageNum && paginationAjaxStatus == 0 && scrollerReachedEnd)
			{
				paginationPageNum++;
				
				paginationAjaxStatus = 1;
				
				if(!$('#srchpagination').hasClass('dn'))
				{
					setTimeout(function () { $('#srchpagination').addClass('dn'); }, 300);
				}
				// show loader
				$('.ldmore:first').removeClass('dn');
				
				$.ajax({
					url: WEBROOT + "service_historyll.php",
					data: {
						"page": paginationPageNum,
						"selOption": verticalName
					},
					dataType: "json",
					success: function (response) {
						// hide loader
						$('.ldmore:first').addClass('dn');
						
						// if there is no error at server side
						if(response.error == 0)
						{
							$('.acmid_content:first').append(response.markup);
						}
						
						// change this status code to 0 to indicate no ajax call is in progress
						paginationAjaxStatus = 0;
					}
				});
			}
		});
	});
}
if(typeof(pageName) != 'undefined' && pageName == 'my_account' && lazyLoadingEnabled && verticalName == 'mealsontrains')
{
	$(function () {
		var paginationAjaxStatus = 0;
		$(window).scroll(function () {
			var scrollerReachedEnd = ($(window).scrollTop() > $('section.acmid_content:first').height() - 800);
			
			if(paginationPageNum < paginationLastPageNum && paginationAjaxStatus == 0 && scrollerReachedEnd)
			{
				paginationPageNum++;
				
				paginationAjaxStatus = 1;
				
				if(!$('#srchpagination').hasClass('dn'))
				{
					setTimeout(function () { $('#srchpagination').addClass('dn'); }, 300);
				}
				// show loader
				$('.ldmore:first').removeClass('dn');
				
				$.ajax({
					url: WEBROOT + "service_history.php",
					data: {
						"page": paginationPageNum,
						"selOption": verticalName
					},
					dataType: "json",
					success: function (response) {
						var html = '';
						var tname = [];
						$.each(response, function(index, item) {
							var trainname="";
							if(item.train_detail!=""){
								tname = item.train_detail.split("/");
								trainname = tname[1].replace(/\+/g, ' ');
							}
							html += '<section class="fdr_box"><span class="fhd"><span style="width:100%;float:left;"><span style="float:left;margin:0 10px;width:46%;">'
									+'<span style="width:18%;float:left;font-weight:bold;">Train :</span>'
									+'<span style="width:82%;float:left;font-weight:bold;">'+trainname+'</span></span>'
									+'<span style="border-left:2px solid #000000;float:left;padding:0 15px;width:46%;"><b>Station :</b><b>'+item.station_name+'</b></span> </span></span>'
									+'<div class="fdt"><span><b>Order Date:</b> '+item.order_date+'</span> | <span><b>Delivery Date & Time:</b>'
									+item.delivery_date+'</span> | '+item.station_arrival_time+
									' |  <span><b>Travel khana Order ID:</b> '+item.travelkhana_order_number+'</span> | <span><b>Order ID:</b>'+item.order_id+
									'</span> | <span><b>Restaurant Name:</b> '+item.outlet_name+'</span></div>'
									+'<table class="odrdt" border="0" cellspacing="0" cellpadding="0">';
									var ditem={};
									if($.trim(item.items)!=""){
										ditem = JSON.parse(item.items);
									}
									var cnt = 1;
									if($.isEmptyObject(ditem)){
										html += '<tr><td>Item is Empty.</td></tr>';
									}
									else{	
										$.each(ditem, function(ind, val) { 
											html +='<tr><td class="block1">'+cnt+'.&nbsp;&nbsp;'+val.ItemName+'</td>'
												    +'<td class="block2">Qty: '+val.Quantity+'</td>';
												if(cnt==1){
												html += '<td class="block3" rowspan="2">Rs. '+item.payable_amount+'</td><td style="text-align:right;">';
													if((item.status1 == 1 ) || (item.status1 == 5)){
														html += '<a id="travelkhana_cancel" class="gray" onclick="openDiv(\'travelkhana_popup\')"  href="javascript:void(0);" style="display:block">Cancel Order</a>'
													}
													else if(item.status1 == 2)
													{ 
														html +='<label class="ord-canl">Order Cancelled</label>';
													} else if(item.status1 == 4 )
													{ 
														html += '<label>Order Failed</label>';
													} else if(item.status1== 6)
													{ 
													   html += '<label>Order Delivered</label>';
													}
												html +='</td>';
												}
										   html += '</tr>';
											cnt++;
										});	
									}
							html += '</table> </section>';		
							//now you can access properties using dot notation
						});
	
						// hide loader
						$('.ldmore:first').addClass('dn');
						
						// if there is no error at server side
						
							$('.acmid_content:first').append(html);
						
						
						// change this status code to 0 to indicate no ajax call is in progress
						paginationAjaxStatus = 0;
					}
				});
			}
		});
	});
}

if(onloadFn=='Index' || onloadFn == "National Search")
{
		if (touchy)
		{
			$('input').focus(function(){
				$('.ipdfooter').addClass('keybrd');
			})
			
			$('input').focusout(function(){	
				$('.ipdfooter,.frlstoutr').removeClass('keybrd');
			})	
		}		
}


function startTimer(duration, display, mtype) 
{
	var timer = duration, minutes, seconds;
	intervalID = setInterval(function () {
		minutes = parseInt(timer / 60, 10)
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		
		if(minutes != 0)
		{
			display.text(minutes);
			 mtype.text('minutes');
		}
		else
		{
			display.text(seconds);
			mtype.text('seconds');
		}	

		if (--timer < 0) {
			timerFlag = true;
			clearInterval(intervalID);
			clearInterval(orderIntervalID);
		   //timer = duration;
		}
	}, 1000);	
}


function reSendVerification(bid,orderId,mobile,emailId,src)
{
	$.post(WEBROOT+"functions/sendverification.php",{
		mob:$.trim(mobile),
		orderId:orderId,
		emailId: $.trim(emailId),
		src:src,
		dataType : "json"
	}, function(res){
		if(res)
		{
			if(res['code'] == 1 && res['islimit'] == true  && res['msg'] == 'REACHED_DAILY_SMS_LIMIT')
			{
				//$("#verror").html('You have reached your daily sms limit');
				//document.getElementById("verror").style.display = 'block';
				openDiv('verfylimit');
			}
			else if(res['code'] == 0 && res['islimit'] == false  && res['sent'] == true)
			{	
				clearInterval(orderIntervalID);
				clearInterval(intervalID);
				timerFlag = false;
				var fiveMinutes = res['displaytimer'];
				display = $('#time');
				mtype = $('#disptime');
				startTimer(fiveMinutes, display, mtype);
				getStatus();
				$("#verror").html('');
				document.getElementById("verror").style.display = 'none';
				$('#smsvcodelft').val('');
				$('#smsvcodergt').val('');
			}	
		}		  
	});	
}
