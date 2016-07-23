$(document).ready(function() {
	if ($('#aphn').length){
		if($("#aphn").val().substr(0,4)!="e.g ")
			$("#aphn").css('color','#424242');
		else
			$("#aphn").css('color','#BDBDBD');
	}
	
	if ($('#aem').length){	
		if($("#aem").val().substr(0,5)!="e.g. ")
			$("#aem").css('color','#424242');
		else
			$("#aem").css('color','#BDBDBD');
	}
		
	if($("#thumbpost").is(':visible'))
	{	
		$("#thumbpre").hide();
		$("#thumbsAndroid").show();
		$(".thumbnails").Carousel({
			btnNext: ".next",
			btnPrev: ".prev",
			circular: false,
			scroll:1,
			speed: 1000
		});
		$("#arrow1").show();
		$("#arrow2").show();
		
	}
	
	if(onloadFn == 'android_application'){
		loadAndroidReviewsData('jdapp');
	}
	
	if(onloadFn == 'iphone_application'){
		loadAndroidReviewsData('IOS');
	}
        if(onloadFn == 'windows_application'){
            loadAndroidReviewsData('WIN');
        }
        
});

function popupjdonmobileSMS()
{
	$("#jdvrfyp").show();
	$("#btnsend").show();
	if($('#jdmn').val() == "")
		ed("jdmn").value = "";
	if($('#jdmm').val() == "")   
		ed("jdmm").value = "";
	$('#jdmn').removeAttr("disabled");
	$('#jdmm').removeAttr("disabled");
	$("#jdverify").hide();
    ed("jdmnErr").innerHTML = "";   
    ed("jdmmErr").innerHTML = "";    
    ed("vcodesndlnklft2").value = ""; 
	ed("vcodesndlnkrt2").value = "";
    ed("mvcErr").innerHTML = "";
    openDiv('slnk');
}

function submitJDOnMobileVerificaiton()
{
   ed("jdmnErr").innerHTML = "";   
   ed("jdmnErr").innerHTML = "";
    if(validateForm("jdmn","Name must be filled out")==true) { 
		if(validateName("jdmn","Please Enter Valid Name")==true) { 
			if(validateSMSMobile("jdmm","Mobile must be filled out")==true) { 
				$.post(WEBROOT+"functions/send_sms.php", {name:$("#jdmn").val(),mobile:$("#jdmm").val(),type:1}, function(data) {
					
					if(data == 2)
					{
						$('#lmtxt').html('');	
						closeDiv("slnk");
						openDiv("dwlpfll");	
						return false;
					}
					
					if (data.indexOf("#2")!= -1)
					{
						var tmp = data;
						tmp = tmp.replace(/#2/g,"");
						$("#smss").html(tmp);
						openDiv("lks");
						return false;

					}
					else
					{
						$("#btnsend").hide();
						$('#jdmn').attr("disabled", true);
						$('#jdmm').attr("disabled", true);
						$("#jdvrfyp").hide();
						$("#jdverify").fadeIn('slow');
						if($('#vcodesndlnklft2'))
						{
							$('#vcodesndlnklft2').focus();
						}
					}
				});
            return false;
			}
		}
    }
}

function submitJDOnMobileSMS()
{
    ed("mvcErr").innerHTML = "";
	var vcodelft = $('#vcodesndlnklft2').val();
	var vcodert = $('#vcodesndlnkrt2').val();
	var vcode = vcodelft+'-'+vcodert;
    
	if(vcode == "-")
    {
		$("#mvcErr").show();
        ed("mvcErr").innerHTML = "Please enter verification code.";
		$("#vcodesndlnklft2").focus();
        return false;
	}
    $.post(WEBROOT+"functions/send_sms.php", {name:$("#jdmn").val(),mobile:$("#jdmm").val(),type:2,captcha_txt:vcode}, function(data) {
        if (data=="ver_err")
        {
            $("#mvcErr").show();
            ed("mvcErr").innerHTML = "Wrong verification code.Please try again!";
			$("#vcodesndlnklft2").val('');
			$("#vcodesndlnkrt2").val('');
			$("#vcodesndlnklft2").focus();
			
            return false;
        }
        else
        {
			$("#mvcErr").hide();
			ed("mvcErr").innerHTML = "";
			data	=	data.replace("#2","");
			$("#smss").html(data.replace("1",""));
			openDiv("lks");
			return false;

        }
    });

}

function submitJDOnMobileSMSContest()
{
    ed("jdverifycodeErr").innerHTML = "";
    $.post(WEBROOT+"contest/send_sms.php", {mobile:$("#ConMob").val(),type:2,captcha_txt:$("#jdverifycode").val()}, function(data) {
        if (data=="ver_err")
        {
            ed("jdverifycodeErr").innerHTML = "Wrong verification code.Please try again!";
            return false;
        }
     });
}

function popupclosejdonmobilSMS()
{
    $('#jdmn').val("");
    $('#jdmm').val("");
    $('#jdmn').removeAttr("disabled");
    $('#jdmm').removeAttr("disabled");
    //div_close("jdsms");
    //div_close("jdverify");
    $('.jerr').hide();	
    $("#btnsend").show();
}
function validateSMSMobile(id,msg)
{
    var x = ed(id).value;
	if(x == "")
	{
		ed(id+"Err").innerHTML = "Please enter mobile number";
		$("#"+id+"Err").show();
		ed(id).focus();
		return false; 
	}
	if(isNaN(x)|| x.indexOf(" ")!=-1)
	{
		ed(id+"Err").innerHTML = "Please enter numeric value";
		$("#"+id+"Err").show();
		ed(id).focus();
		return false; 
	}
	var alphaExp = /^[0-9]+$/;
	if(!x.match(alphaExp))
	{
		ed(id+"Err").innerHTML = "Please enter valid mobile number";
		$("#"+id+"Err").show();
		ed(id).focus();
		return false; 
	}
	if(x.length != 10)
	{
		ed(id+"Err").innerHTML = "Please enter valid 10 digit mobile number";
		$("#"+id+"Err").show();
		ed(id).focus();
		return false; 
	}
	$fchar = x.charAt(0);	
	if($fchar != 7 && $fchar != 8 && $fchar != 9)
	{
		ed(id+"Err").innerHTML = "Please enter valid 10 digit mobile number";
		$("#"+id+"Err").show();
		ed(id).focus();
		return false; 
	}
	$("#"+id+"Err").hide();
	ed(id+"Err").innerHTML = "";
	return true;
}

function mAppDwnld()
{
	openDiv('dwlp');
}


function clear_android_eg(eg_type,id,event,flag) {

	if(event=="onfocus") {
		if(document.getElementById(id).value=="e.g 9867045061" || document.getElementById(id).value=="e.g. abc@xyz.com") {
			document.getElementById(id).value = "";
			document.getElementById(id).style.color = "#000000";
		}
		if(touchy && flag == 1)
		{
			$('.div_outer').addClass('pos_rel');
		}
	}
	if(event == "onblur") {
		if(document.getElementById(id).value=="") {
			if(id == "aem" || id == "anmail" || id == "iem" || id == "wem") {
					document.getElementById(id).value = "e.g. abc@xyz.com";
			}
			if(id == "aphn" || id == "anphone" || id == "iphn" || id == "winphn" || id == "jdmm") {
				document.getElementById(id).value = "e.g 9867045061";
			}
			
			document.getElementById(id).style.color = "#BDBDBD";
		}
		if(touchy && flag == 1)
		{
			$('.div_outer').removeClass('pos_rel');
		}
	}
}

function logAndroidAppMobile(type, popupFlag)
{
	var sndflg = 0;
	$("#aemsg").hide();
	$("#aemsg").html("");
	var phn	=	$("#aphn").val();
	var em	=	$("#aem").val();
	//var vc	=	$("#avc").val();
	if(popupFlag == 1) {
		var vcodelft = $("#vcodelftdw").val();
		var vcodert = $("#vcodertdw").val();
	} else {
		var vcodelft = $("#vcodelft").val();
		var vcodert = $("#vcodert").val();
	}
	var vcode = vcodelft+'-'+vcodert;
	var applink	= $("#applink").val();
		var appPage = (onloadFn != '' && (onloadFn == 'jd_on_mobile' || onloadFn == 'Result' || onloadFn == 'NSsearch' || onloadFn == 'Result')) ? 'jdmpage' : '';
	//var vc1	=	$("#avc1").val();
	if(touchy)
	{
		$('.div_outer').removeClass('pos_rel');
	}
		//if(phn.search("e.g") == 0 && em.search("e.g") == 0 )
		if(phn.search("e.g") == 0)
		{
		sndflg = 1;
		//$(".jerr").show();
		$(".jmerr").show();
		$("#aemsg").html("Please enter a valid mobile number");
		return false;
		}
		//if(phn == "" && em == "")
		if(phn == "")
		{
		sndflg = 1;
		//$(".jerr").show();
		$(".jmerr").show();
		//$("#aemsg").html("Enter phone number or Email id");
		$("#aemsg").html("Please enter a valid mobile number");
		return false;
		}
		if(phn != "" && phn.search("e.g") != 0 )
		{
		if(!validateMobileAndroid("aphn"))
		{
			sndflg = 1;
			//$(".jerr").show();
			$(".jmerr").show();
			$("#aemsg").html("Please enter a valid mobile number"); 
			return false;
		}
		
		$fchar = phn.charAt(0);	
		if($fchar != 7 && $fchar != 8 && $fchar != 9)
		{
			sndflg = 1;
			//$(".jerr").show();
			$(".jmerr").show();
			$("#aemsg").html("Please enter a valid mobile number"); 
			return false;
		}
		var alphaExp = /^[0-9]+$/;
		if(!phn.match(alphaExp))
		{
			sndflg = 1;
			//$(".jerr").show();
			$(".jmerr").show();
			$("#aemsg").html("Please enter a valid mobile number"); 
			return false;
		}
		}
			
		if(em != "" && em.search("e.g") != 0 )
		{
			
			if(!isValid(em,"email"))
			{
				sndflg = 1;
				$(".jerr").show();
				$("#aemsg").html("Enter valid Email Id"); 
				return false;
			}
		}
		
		if(vcode == "-" && $("#dwlpvc").is(":visible"))
		{
			sndflg = 1;
			$(".jerr").show();
			$("#vcodelft").focus();
			$("#avcErr").html("Please enter verification code"); 
			return false;
		}
	
	if(sndflg == 0)
	{
		//$(".jerr").hide();
		$(".jmerr").hide();
		
		$.get(WEBROOT+"functions/ajxandroid.php", {phn:phn,em:em,vcode:vcode,type:type,applink:applink,'apppage' : appPage},function(data) {
			if(data == 1)
			{
				if(popupFlag == 1) {
					$('.txt_outer').css('display', 'none');
					$('#cont3').css('display', 'block');
					$('#cont3Msg').html('Thank you for your information. SMS Sent.');
				} else {
					if(applink == 'android')
						$('#sutxt').html('Android Application');
					else
						$('#sutxt').html('JD Mobile Application');
					
					//closeDiv("dwlp");	
					closeDiv("dwlpvc");
					openDiv("dwlpsu");	
				}
				setTimeout("window.location.reload(true);",3000);
			}
			else if(data == 0)
			{
				if(popupFlag == 1) {
					$('.txt_outer').css('display', 'none');
					//$('#dwlpvcevent').attr('onclick', 'return logAndroidAppMobile(2, 1);');
					$('#cont2').css('display', 'block');
				} else {
					$('#avc').val('');
					$('#dwlpvcevent').attr('onclick', 'return logAndroidAppMobile(2);');
					closeDiv("dwlp");
					openDiv("dwlpvc");
				}
			}
			else if(data == 4)
			{
				$("#vcodelft").val('');
				$("#vcodert").val('');
				$(".jerr").show();
				$("#vcodelft").focus();
				$("#avcErr").html("Please enter correct verification code"); 
				if(popupFlag == 1) {
					$('.txt_outer').css('display', 'none');
					$('#cont2').css('display', 'block');
				} else {
					closeDiv("dwlp");
				}
			}
			else if(data == 2)
			{
				if(popupFlag == 1) {
					$('.txt_outer').css('display', 'none');
					$('#cont3').css('display', 'block');
					$('#cont3Msg').html('You have reached your maximum limit of attempts for the day.Please try again later.');
					setTimeout("window.location.reload(true);",3000);
				} else {
					if(applink == 'android')
						$('#sutxt').html('Android Application');
					else
						$('#sutxt').html('JD Mobile Application');
					
					closeDiv("dwlp");	
					openDiv("dwlpfll");
				}
			}
			else if(data == 3)
			{
				if(popupFlag == 1) {
					$('.txt_outer').css('display', 'none');
					$('#cont3').css('display', 'block');
					$('#cont3Msg').html('Could not send SMS/Email.Please try again later.');
					setTimeout("window.location.reload(true);",3000);
				} else {
					if(applink == 'android')
						$('#sutxt').html('Android Application');
					else
						$('#sutxt').html('JD Mobile Application');
						
					closeDiv("dwlp");
					closeDiv("dwlpvc");
					openDiv("dwlpfl");
				}
			}
		});
	}
}

function logiPhoneAppMobile(type)
{
	var sndflg = 0;
	$("#iemsg").hide();
	$("#iemsg").html("");
	var phn	=	$("#iphn").val();
	var em	=	$("#iem").val();
	//var vc	=	$("#avc").val();
	var vcodelft = $("#vcodelft").val();
	var vcodert = $("#vcodert").val();
	var vcode = vcodelft+'-'+vcodert;

	//var vc1	=	$("#avc1").val();
	
		if(phn.search("e.g") == 0 && em.search("e.g") == 0 )
		{
			sndflg = 1;
			$(".jerr").show();
			$("#iemsg").html("Enter phone number or Email id");
			return false;
		}
		if(phn == "" && em == "")
		{
			sndflg = 1;
			$(".jerr").show();
			$("#iemsg").html("Enter phone number or Email id");
			return false;
		}
		if(phn!="" && phn.search("e.g") != 0 )
		{
			if(!validateMobileAndroid("iphn"))
			{
				
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Mobile Number"); 
				return false;
			}
			
			$fchar = phn.charAt(0);	
			if($fchar != 7 && $fchar != 8 && $fchar != 9)
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Mobile Number"); 
				return false;
			}
			var alphaExp = /^[0-9]+$/;
			if(!phn.match(alphaExp))
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Mobile Number"); 
				return false;
			}
		}
			
		if(em != "" && em.search("e.g") != 0 )
		{
			
			if(!isValid(em,"email"))
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Email Id"); 
				return false;
			}
		}
		
		if(vcode == "-" && $("#dwlpvc").is(":visible"))
		{
			sndflg = 1;
			$(".jerr").show();
			$('#vcodelft').focus();
			$("#avcErr").html("Please enter verification code"); 
			return false;
		}
	
	if(sndflg == 0)
	{
		$(".jerr").hide();
		
		$.get(WEBROOT+"functions/ajxandroid.php", {phn:phn,em:em,vcode:vcode,type:type,applink:'iphone'},function(data) {
			if(data == 1)
			{
				$('#sutxt').html('iPhone Application');
				openDiv("dwlpsu");
				setTimeout("window.location.reload(true);",3000);
			}
			else if(data == 0)
			{
				$('#avc').val('');
				$('#dwlpvcevent').attr('onclick', 'return logiPhoneAppMobile(2);');
				openDiv("dwlpvc");
			}
			else if(data == 4)
			{
				$('#vcodelft').val('');
				$('#vcodert').val('');
				$('#vcodelft').focus();
				$(".jerr").show();
				$("#avcErr").html("Please enter correct verification code."); 
			}
			else if(data == 2)
			{
				$('#lmtxt').html('iPhone Application');
				openDiv("dwlpfll");
			}
			else if(data == 3)
			{
				$('#fltxt').html('iPhone Application');
				openDiv("dwlpfl");
			}
		});
	}
}

function logWindowsPhoneApp(type)
{
	var sndflg = 0;
	$("#iemsg").hide();
	$("#iemsg").html("");
	var phn	=	$("#winphn").val();
	var em	=	$("#wem").val();
	//var vc	=	$("#avc").val();
	var vcodelft = $("#vcodelft").val();
	var vcodert = $("#vcodert").val();
	var vcode = vcodelft+'-'+vcodert;
	//var vc1	=	$("#avc1").val();
	
		if(phn.search("e.g") == 0 && em.search("e.g") == 0 )
		{
			sndflg = 1;
			$(".jerr").show();
			$("#iemsg").html("Enter phone number or Email id");
			return false;
		}
		if(phn == "" && em == "")
		{
			sndflg = 1;
			$(".jerr").show();
			$("#iemsg").html("Enter phone number or Email id");
			return false;
		}
		if(phn!="" && phn.search("e.g") != 0 )
		{
			if(!validateMobileAndroid("winphn"))
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Mobile Number"); 
				return false;
			}
			
			$fchar = phn.charAt(0);	
			if($fchar != 7 && $fchar != 8 && $fchar != 9)
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Mobile Number"); 
				return false;
			}
			var alphaExp = /^[0-9]+$/;
			if(!phn.match(alphaExp))
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Mobile Number"); 
				return false;
			}
		}
			
		if(em != "" && em.search("e.g") != 0 )
		{
			
			if(!isValid(em,"email"))
			{
				sndflg = 1;
				$(".jerr").show();
				$("#iemsg").html("Enter valid Email Id"); 
				return false;
			}
		}
		
		if(vcode == "-" && $("#dwlpvc").is(":visible"))
		{
			sndflg = 1;
			$(".jerr").show();
			$("#vcodelft").focus()
			$("#avcErr").html("Please enter verification code"); 
			return false;
		}
	
	if(sndflg == 0)
	{
		$(".jerr").hide();
		
		$.get(WEBROOT+"functions/ajxandroid.php", {phn:phn,em:em,vcode:vcode,type:type,applink:'windows'},function(data) {
			if(data == 1)
			{
				$('#sutxt').html('Windows Application');
				openDiv("dwlpsu");
				setTimeout("window.location.reload(true);",3000);
			}
			else if(data == 0)
			{
				$('#avc').val('');
				$('#dwlpvcevent').attr('onclick', 'return logWindowsPhoneApp(2);');
				openDiv("dwlpvc");
			}
			else if(data == 4)
			{
				$('#vcodelft').val('');
				$('#vcodert').val('');
				$(".jerr").show();
				$("#vcodelft").focus()
				$("#avcErr").html("Please enter correct verification code"); 
			}
			else if(data == 2)
			{
				$('#lmtxt').html('Windows Application');
				openDiv("dwlpfll");
			}
			else if(data == 3)
			{
				$('#fltxt').html('Windows Application');
				openDiv("dwlpfl");
			}
		});
	}
}


function validateMobileAndroid(id)
{
    var x = ed(id).value;
     if(isNaN(x)|| x.indexOf(" ")!=-1){
             return false; }
	if (x.length != 10 ){
       	   return false;
	}
	if(x[0] == 0){
		return false;
	}
	return true;
}

function loadAndroidReviewsData(appId)
{
	//var appId = 'jdapp';
	var currenttime = new Date();
	var time = currenttime.getTime();
	if($('#rvw').length)
	{	
		$.get(WEBROOT+"functions/app_reviews_initial.php?t="+time, {appId: appId}, function(data) {
		
		var d = eval('(' + data + ')');
		//alert(d.message);
		//$('#apphdrate').html(reviewhdHtml(d));
		$('#rvw').html(reviewHtml(d));
		$('.jcrv aside a').corner("top 5px");
		});
	}
}
function reviewhdHtml(d)
{
	var html ='';
	if(d.totRatings.total>0){
		
		html += '<span id="dtlstar"><span class="cstars">';		
			if(d.totRatings.stars)
				{
					var i;
					var len = d.star.length;
					for(i=0; i<len; i++)
					{
						html += '<span class="s'+d.star[i]+'"></span>';
					}
				}
		html +='</span></span>';						
		html +='<span class="cstars"><span class="votes">'+d.totRatings.total+'</span><span class="rtext"> Ratings</span></span>';
		}
	return html;		
}

function reviewHtml(d)
{
	var html = '';
	
	html += reviewTabHtml(d);
	
	if(d.totRatings.total > 0)
	{
		html += graphHtml(d);		
		html += allRatingsHtml(d);
		html += friendRatingsHtml(d);
		html += myRatingsHtml(d);
	}
	else
	{
		html += '<section class="btxt">Be first to rate.</section><section id="bftr" class="jpop"><section class="jpbg">';
			//html += '<span>actly there are no reviews posted for this listing.</span>';
						
				html += '<a class="jbtn" onclick="'+_ct('bftr','dtpg')+'" href="'+baseurl+'/writereview">Rate This</a>';

		html += '</section></section>';
	}
	return html;
}

function reviewTabHtml(d)
{
	var html = '';
	var tabwidth = '700px';
	
	if(d.appId=='jdapp'){
		html += '<h2>Reviews for JD Android App</h2>';
	}
        else if(d.appId == 'WIN'){
            html += '<h2>Reviews for JD Windows App</h2>';
        }
        else{
		html += '<h2>Reviews for JD iPhone App</h2>';
		}
	
        
	if(d.totRatings.total > 0)
	{

		var tr = (d.totRatings.total > 0)		? '('+d.totRatings.total+')'		: '(0)';
		var fr = (d.totfriendreviews.total > 0) ? '('+d.totfriendreviews.total+')'	: '';
		var mr = (d.totmyratings.total > 0)		? '('+d.totmyratings.total+')'		: '';

		html += '<aside>';
			html += '<a onclick="change_tab(\'ratings\');" class="'+d.selectratings+'" id="tabratings">All Ratings '+tr+'</a>';
			html += '<a onclick="change_tab(\'fratings\');setRedirect(1);" class="'+d.selectfratings+'" id="tabfratings">Friends Ratings '+fr+'</a>';
			html += '<a onclick="change_tab(\'mratings\');setRedirect(1);" class="'+d.selectmratings+' nm" id="tabmratings">My Ratings '+mr+'</a>';
		html += '</aside>';
	}
	else
	{				
		html = '<a id="tabratings" class="'+d.selectratings+'" style="width:'+tabwidth+';">All Ratings</a>';
	}
	return html;
}

function allRatingsHtml(d)
{
	var html = '';
	html += '<section id="allratings" class="jurat" style="'+d.showratings+'">';
	var i;
	var rcnt = d.ratings.length;
	
	for(i=0; i<rcnt; i++)
	{
		html += '<dt class="jurev">';
			html += '<dl class="jrevi"><img width="64px" height="64px" src="'+d.ratings[i].login_image+'" alt="" /></dl>';
			html += '<span class="jrev">';
				html += '<span class="jurn">';
					html += '<span class="rName">'+d.ratings[i].reviewer_name+'</span>';
					html += '<dl class="stars_m">';

						var p;
						var len = d.ratings[i].star.length;
						for(p=0; p<len; p++)
						{
							html += '<span class="ms'+d.ratings[i].star[p]+'"></span>';
						}
					html += '</dl></span>';

					html += '<span id="jcme">';
					if(d.ratings[i].reviewer_email && d.ratings[i].reviewer_phone)
					{
						if(d.ratings[i].reviewer_email.indexOf('justdial.com') < 0)
						{
							html += '<span>'+d.ratings[i].reviewer_email;
							html += '&nbsp;|&nbsp;';
						}
						else
							html += '<span>';

						html += d.ratings[i].reviewer_phone+'</span>';
					}
					else if(d.ratings[i].reviewer_email && d.ratings[i].reviewer_email.indexOf('justdial.com') < 0)
					{
						html += '<span>'+d.ratings[i].reviewer_email+'</span>';
					}
					else if(d.ratings[i].reviewer_phone)
					{
						html += '<span>'+d.ratings[i].reviewer_phone+'</span>';
					}
					html += '<span class="dtyr">'+d.ratings[i].Cur_Date +'</span>';
					html += '</span>';
			
				if(d.ratings[i].final_opinion)
				{					
					html += '<p>'+d.ratings[i].final_opinion+'</p>';
				}
			html += '</span>';
		html += '</dt>';
	}
	html += ratingPaginationHtml(d,'rating');
	html += '</section>';
	return html;
}

function ratingPaginationHtml(d, t)
{
	var html = '';

	var lastpage = '';
	var page = '';
	var lpm1 = '';
	var fn = '';
	var totrev = '';

	if(t == 'myrating')
	{
		totrev = d.totrates;
		lastpage = d.mlastpage;
		page = d.pagert;
		lpm1 = d.mlpm1;
		fn = 'appmratings';
	}
	else if(t == 'friendrating')
	{
		totrev = d.totfriendreviews.total;
		lastpage = d.flastpage;
		page = d.pagert;
		lpm1 = d.flpm1;
		fn = 'appfratings';
	}
	else
	{
		totrev = d.totrates;
		lastpage = d.lastpage;
		page = d.page;
		lpm1 = d.lpm1;
		fn = 'appratings';
	}
		
	if (typeof (d.company_name) == 'undefined') { 
		d.company_name = '';
	}

	if(lastpage > 1)
	{
		var c;
		html += "<div class='jpag'>";
		prev = page - 1;
		//previous button
		if(page > 1)
		{
			html += '<a href="#rvw" onclick="'+fn+'('+prev+','+totrev+',\''+d.appId+'\');"><span>&lsaquo;&lsaquo;</span> Prev</a>';
		}
		else
		{
			html += '<span class="dis"><span>&lsaquo;&lsaquo;</span> Prev</span>';
		}

		//pages	
		if(lastpage < 7 + (d.adjacents * 2))	//not enough pages to bother breaking it up
		{
			for(c=1; c<=lastpage; c++)
			{
				if(c == page)
				{
					html += '<span class="act">'+c+'</span>';
				}
				else
				{
					html += '<a href="#rvw" onclick="'+fn+'('+c+','+totrev+',\''+d.appId+'\');">'+c+'</a>';
				}
			}
		}
		else if(lastpage > 5 + (d.adjacents * 2))	//enough pages to hide some
		{
			//close to beginning; only hide later pages
			if(page < 1 + (d.adjacents * 2))
			{
				
				for(c=1; c<4 + (d.adjacents * 2); c++)
				{
					if(c == page)
					{
						html += '<span class="act">'+c+'</span>';
					}
					else
					{
						html += '<a href="#rvw" onclick="'+fn+'('+c+','+totrev+',\''+d.appId+'\');">'+c+'</a>';
					}
				}
				html += '...';
				html += '<a href="#rvw" onclick="'+fn+'('+lpm1+','+totrev+',\''+d.appId+'\');">'+lpm1+'</a>';
				html += '<a href="#rvw" onclick="'+fn+'('+lastpage+','+totrev+',\''+d.appId+'\');">'+lastpage+'</a>';		
			}
			//in middle; hide some front and some back
			else if(lastpage - (d.adjacents * 2) > page && page > (d.adjacents * 2))
			{
				html += '<a href="#rvw" onclick="'+fn+'(1,'+totrev+',\''+d.appId+'\');">1</a>';
				html += '<a href="#rvw" onclick="'+fn+'(2,'+totrev+',\''+d.appId+'\');">2</a>';
				html += '...';
				
				for(c = page - d.adjacents; c <= page + d.adjacents; c++)
				{
					if(c == page)
					{
						html += '<span class="act">'+c+'</span>';
					}
					else
					{
						html += '<a href="#rvw" onclick="'+fn+'('+c+','+totrev+',\''+d.appId+'\');">'+c+'</a>';
					}
				}
				html += '...';
				html += '<a href="#rvw" onclick="'+fn+'('+lpm1+','+totrev+',\''+d.appId+'\');">'+lpm1+'</a>';
				html += '<a href="#rvw" onclick="'+fn+'('+lastpage+','+totrev+',\''+d.appId+'\');">'+lastpage+'</a>';
			}
			//close to end; only hide early pages
			else
			{
				html += '<a href="#rvw" onclick="'+fn+'(1,'+totrev+',\''+d.appId+'\');">1</a>';
				html += '<a href="#rvw" onclick="'+fn+'(2,'+totrev+',\''+d.appId+'\');">2</a>';
				html += '...';
				
				for(c = lastpage - (2 + (d.adjacents * 2)); c <= lastpage; c++)
				{
					if(c == page)
					{
						html += '<span class="act">'+c+'</span>';
					}
					else
					{
						html += '<a href="#rvw" onclick="'+fn+'('+c+','+totrev+',\''+d.appId+'\');">'+c+'</a>';
					}
				}
			}
		}

		var next = page + 1;
		if(page < c - 1)
		{
			html += '<a href="#rvw" onclick="'+fn+'('+next+','+totrev+',\''+d.appId+'\');">Next <span>&rsaquo;&rsaquo;</span></a>';
		}
		else
		{
			html += '<span class="dis">Next <span>&rsaquo;&rsaquo;</span></span>';
		}
		html += '</div>';
		//html += '<div class="clearfix"></div>';
	}
	return html;
}


function friendRatingsHtml(d)
{	
	var html = '';
	html += '<section id="allfratings" class="jurat" style="'+d.showfratings+';">';
	
	if(d.totfriendreviews.total > 0)
	{
		var i;
		var rcnt = d.fratings.length;
		for(i=0; i<rcnt; i++)
		{
			html += '<dt class="jurev">';
				html += '<dl class="jrevi"><img width="64px" height="64px" src="'+d.fratings[i].login_image+'" alt="" /></dl>';
				html += '<span class="jrev">';
					html += '<span class="jurn">';
						html += '<span class="rName">'+d.fratings[i].reviewer_name+'</span>';
						html += '<dl class="stars_m">';

							var p;
							var len = d.fratings[i].star.length;
							var countStar=0;
							for(p=0; p<len; p++)
							{
								html += '<span class="ms'+d.fratings[i].star[p]+'"></span>';
								if(d.fratings[i].star[p]==10)
								{
									countStar++;
								}
							}
							
						html += '</dl></span>';
						html += '<span id="jcme">';
						
						if(d.fratings[i].reviewer_email && d.fratings[i].reviewer_phone)
						{
							if(d.fratings[i].reviewer_email.indexOf('justdial.com') < 0)
							{
								html += '<span>'+d.fratings[i].reviewer_email;
								html += '&nbsp;|&nbsp;';
							}
							else
							{
								html += '<span>';
							}

							html += d.fratings[i].reviewer_phone+'</span>';
						}
						else if(d.fratings[i].reviewer_email && d.fratings[i].reviewer_email.indexOf('justdial.com') < 0)
						{
							html += '<span>'+d.fratings[i].reviewer_email+'</span>';
						}
						else if(d.fratings[i].reviewer_phone)
						{
							html += '<span>'+d.fratings[i].reviewer_phone+'</span>';
						}
						
					html += '<span class="dtyr">'+d.fratings[i].Cur_Date +'</span>';
					html += '</span>';

					//Image Uploaded by User start				
					html += '<div class="bttmbrd"></div>';
					html += '<span class="grayPointer"></span>';

					var img_len = 0; //d.ratings[i].image_cation.length;
					if(img_len > 0)
					{
						html += '<div id="review_thumb_img_div">';
							var c;
							for(c=0; c<img_len; c++)
							{
								html += '<div>';
									html += '<span><img class="review_thumb" id="'+i+c+'" onmouseout="hidelargeimg(this.id);" onmouseover="showlargeimg(this.id);" src="'+d.ratings[i].image_cation[c].thumb_img+'" alt="" /></span>';

									html += '<div style="display:none;" id="pic'+i+c+'" onmouseout="hidelargeimg('+i+c+');" onmouseover="showlargeimg('+i+c+');" class="big_th" name="pic16"><img style="border: 5px solid #B9B9B9;"src="'+d.ratings[i].image_cation[c].big_img+'" /><span class="imgdic"></span></div>';
								html += '</div>';
							}
						html += '</div>';
					}
					//Image Uploaded by User End
					var comments     = new Array();
						comments[1]  = "Poor";
						comments[2]  = "Average";
						comments[3]  = "Good";
						comments[4]  = "Very Good";
						comments[5]  = "Excellent";
					var comments_old = new Array("poor","average","good","very good","excellent","below average","above average");
					var finalOpinion = d.fratings[i].final_opinion;
					if(jQuery.inArray(d.fratings[i].final_opinion, comments_old) > -1)
					{	
						finalOpinion = comments[countStar];	
					}
					
					if(d.fratings[i].final_opinion)
					{	
						html += '<p>'+finalOpinion+'</p>';
					}
					
			html += '</span>';

			html += '</dt>';

		}
		html += ratingPaginationHtml(d,'friendrating');
	}
	else
	{ 
		if(!d.message)
		{
			html += '<section id="bftr" class="jpop"><section class="jpbg">';
					html += '<p><b>Login</b> to view your friends ratings</p>';
					html += '<a class="jbtn" href="javascript:void(0);" onclick="fn_loginStart();">Login</a>';
			html += '</section></section>';
		}
		else
		{	
			if(d.message=='tag')
			{
				html += '<section id="bftr" class="jpop"><section class="jpbg">';
					html += '<p><span class="alert"></span> <b>Sorry '+getCookie('inLogName')+'</b> You don\'t have any tagged friends<br/> you must tag friends to view their ratings.</p>';
					html += '<a class="jbtn" href="'+WEBROOT+'Account/Friend-Ratings/Tag-More-Friends">Tag Your Friends</a>';
				html += '</section></section>';
			}
			else if(d.message == 'privacy')
			{
				html += '<section id="bftr" class="jpop"><section class="jpbg">';
				html += '<p>Cannot view <b>Friends Ratings</b> due to Privacy Settings.</p>';
				html += '</section></section>';
			}
			else
			{
				html += '<section id="bftr" class="jpop"><section class="jpbg">';
					if(d.appId == "jdapp")
					{
						html += '<p>None of your friends have rated the application. <b>Tag more friends</b> to find if they have rated the Justdial Android app.</p>';
					}
                                        else if(d.appId == 'WIN'){
                                            html += '<p>None of your friends have rated the application. <b>Tag more friends</b> to find if they have rated the Justdial Windows app.</p>';
                                        }
					else
					{
						html += '<p>None of your friends have rated the application. <b>Tag more friends</b> to find if they have rated the Justdial iPhone app.</p>';
					}
					html += '<a rel="nofollow" class="jbtn" href="'+WEBROOT+'Account/Friend-Ratings/Tag-More-Friends">Tag Friends</a>';
				html += '</section></section>';
			}
		}
	}

	html += '</section>';

	return html;
}

function myRatingsHtml(d)
{
	var html = '';
	html += '<section id="allmratings" class="jurat" style="'+d.showmratings+';">';
	
	if(d.totmyratings.total > 0)
	{
		var i;
		var rcnt = d.mratings.length;
		for(i=0; i<rcnt; i++)
		{
			html += '<dt class="jurev">';
				html += '<dl class="jrevi"><img width="64px" height="64px" src="'+d.mratings[i].login_image+'" alt="" /></dl>';
				html += '<span class="jrev">';
					html += '<span class="jurn">';
						html += '<span class="rName">'+d.mratings[i].reviewer_name+'</span>';
						html += '<dl class="stars_m">';

							var p;
							var len = d.mratings[i].star.length;
							for(p=0; p<len; p++)
							{
								html += '<span class="ms'+d.mratings[i].star[p]+'"></span>';
							}
						html += '</dl></span>';
						
						html += '<span id="jcme">';
						if(d.mratings[i].reviewer_email && d.mratings[i].reviewer_phone)
						{
							if(d.mratings[i].reviewer_email.indexOf('justdial.com') < 0)
							{
								html += '<span>'+d.mratings[i].reviewer_email;
								html += '&nbsp;|&nbsp;';
							}
							else
							{
								html += '<span>';
							}
							html += d.mratings[i].reviewer_phone+'</span>';
						}
						else if(d.mratings[i].reviewer_email && d.mratings[i].reviewer_email.indexOf('justdial.com') < 0)
						{
							html += '<span>'+d.mratings[i].reviewer_email+'</span>';
						}
						else if(d.mratings[i].reviewer_phone)
						{
							html += '<span>'+d.mratings[i].reviewer_phone+'</span>';
						}

						html += '<span class="dtyr">'+d.mratings[i].Cur_Date +'</span>';
					html += '</span>';
						
					if(d.mratings[i].final_opinion)
					{
						html += '<p>'+d.mratings[i].final_opinion+'</p>';
					}
					
				html += '</span>';
			html += '</dt>';
		}
		html += ratingPaginationHtml(d,'myrating');
	}
	else
	{
		if(!d.mymessage)
		{
			html += '<section id="bftr" class="jpop"><section class="jpbg">';
					html += '<p><b>Login</b> to view your ratings</p>';
					html += '<a class="jbtn" href="javascript:void(0);" onclick="fn_loginStart();">Login</a>';
			html += '</section></section>';
		}
		else
		{
			html += '<section id="bftr" class="jpop"><section class="jpbg">';
				
					if(d.appId == "jdapp")
					{
						html += '<p><b>Hi '+getCookie('inLogName')+'</b>, Kindly visit the Justdial Android App to rate and tell us, are we doing good?</p>';
					}
                                        else if(d.appId == 'WIN'){
                                            html += '<p><b>Hi '+getCookie('inLogName')+'</b>, Kindly visit the Justdial Windows App to rate and tell us, are we doing good?</p>';
                                        }
					else
					{
						html += '<p><b>Hi '+getCookie('inLogName')+'</b>, Kindly visit the Justdial iPhone App to rate and tell us, are we doing good?</p>';
					}
					//html += '<a rel="nofollow" onclick="'+_ct('ratethis','dtpg')+'" class="jbtn" href="'+window.location+'/writereview">Write Review</a>';
				
			html += '</section></section>';
		}
	}
	html += '</section>';

	return html;
}

function graphHtml(d)
{
	var html = '';
	html += userGraphHtml(d);
	html += friendGraphHtml(d);
	html += myGraphHtml(d);
	return html;
}

function userGraphHtml(d)
{
	var html = '';

	html += '<section id="user_graph_div"  class="jug" style="'+d.graph+'">';

	if(d.overallrating)
	{
		html += '<section class="jgb">';
			html += '<span class="jgt">Overall Ratings ('+d.totRatings.total+')</span>';
			html += '<dt class="stars_m">';
			
				if(d.showstars)
				{
					var i;
					var len = d.star.length;
					for(i=0; i<len; i++)
					{
						html += '<span class="ms'+d.star[i]+'"></span>';
					}
				}
			html += '</dt>';
			html += '<dt class="rating_chart"><img alt="Bar Chart" src="'+d.overallrating+'" /></dt>';
			
		html += '</section>';
	}
	if(d.overtimerating)
	{

		html += '<section class="jrot">';
			html += '<span class="jgt">Ratings Over Time</span>';
			html += '<dt class="rating_chart"><img alt="Line Chart" src="'+d.overtimerating+'" /></dt>';
		html += '</section>';
	}
	html += '</section>';

	return html;
}

function friendGraphHtml(d)
{
	var html = '';
	
	html += '<section id="friend_graph_div" class="jug" style="'+d.fgraph+'">';

	if(d.foverallrating)
	{
		html += '<section class="jgb">';
			html += '<span class="jgt">Friends Overall Ratings ('+d.totfriendreviews.total+')</span>';
			html += '<dt class="stars_m">';

				var i;
				var len = d.fstar.length;
				for(i=0; i<len; i++)
				{
					html += '<span class="ms'+d.fstar[i]+'"></span>';
				}
			html += '</dt>';
			html += '<dt class="rating_chart"><img alt="Bar Chart" src="'+d.foverallrating+'" /></dt>';
		html += '</section>';
	}
	
	if(d.fovertimerating)
	{
		html += '<section class="jrot">';
			html += '<span class="jgt">Friends Ratings Over Time ('+d.fovertimetotal.total+')</span>';
			html += '<dt class="stars_m">';
			
				var i;
				var len = d.fovertimestar.length;
				for(i=0; i<len; i++)
				{
					html += '<span class="ms'+d.fovertimestar[i]+'"></span>';
				}
			html += '</dt>';
			
			html += '<dt class="rating_chart"><img alt="Line Chart" src="'+d.fovertimerating+'" /></dt>';
		html += '</section>';
	}
	html += '</section>';

	return html;
}

function myGraphHtml(d)
{
	var html = '';
	
	html += '<section id="my_graph_div" class="jug" style="'+d.mgraph+'">';

	if(d.moverallrating)
	{
		html += '<section class="jgb">';
			html += '<span class="jgt">My Overall Ratings ('+d.totmyratings.total+')</span>';
			html += '<dt class="stars_m">';

				var i;
				var len = d.mstar.length;
				for(i=0; i<len; i++)
				{
					html += '<span class="ms'+d.mstar[i]+'"></span>';
				}
			html += '</dt>';
			html += '<dt class="rating_chart"><img alt="Bar Chart" src="'+d.moverallrating+'" /></dt>';
		html += '</section>';
	}
	if(d.movertimerating)
	{
		html += '<section class="jrot">';
			
			html += '<span class="jgt">My Ratings Over Time</span>';
			html += '<dt class="rating_chart"><img alt="Line Chart" src="'+d.movertimerating+'" /></dt>';
		html += '</section>';
	}
	html += '</section>';

	return html;
}

function change_tab(divid)
{
	document.cookie = 'appshowpage='+divid+'; '+date+'; path=/; domain=' + cookieondomain;

	var tabs = new Array('ratings', 'fratings', 'mratings');
	for(var i=0;i<tabs.length;i++)
	{
		if(divid == 'fratings')
		{
			var ln = getCookie('ln');
			if(!ln || attn_user == 'logout')
			{
				fn_loginStart();
			}
			document.getElementById('user_graph_div').style.display = 'none';
			document.getElementById('my_graph_div').style.display = 'none';
			
			if(document.getElementById('friend_graph_div').innerHTML == '')
			{
				document.getElementById('friend_graph_div').style.display = 'none';
			}
			else
			{
				document.getElementById('friend_graph_div').style.display = 'block';
			}
		}
		else if(divid == 'mratings')
		{
			var ln = getCookie('ln');
			if(!ln)
			{

				//openDiv('login_div','');
				fn_loginStart();
			}
			document.getElementById('user_graph_div').style.display = 'none';
			document.getElementById('friend_graph_div').style.display = 'none';

			if(document.getElementById('my_graph_div').innerHTML == '')
			{
				document.getElementById('my_graph_div').style.display = 'none';
			}
			else
			{
				document.getElementById('my_graph_div').style.display = 'block';
			}
		}
		else
		{
			document.getElementById('friend_graph_div').style.display = 'none';
			document.getElementById('my_graph_div').style.display = 'none';

			if(document.getElementById('user_graph_div').innerHTML == '')
			{
				document.getElementById('user_graph_div').style.display = 'none';
			}
			else
			{
				document.getElementById('user_graph_div').style.display = 'block';
			}
		}

		if(divid == tabs[i])
		{
			var cls = (tabs[i] == 'mratings') ? ' jsel nm' : 'jsel';
			document.getElementById('tab'+divid).className = cls;
			if(document.getElementById('all'+divid))
				document.getElementById('all'+divid).style.display = 'block';
		}
		else
		{
			var cls = (tabs[i] == 'mratings') ? 'nm' : '';

			if(document.getElementById('tab'+tabs[i]))
				document.getElementById('tab'+tabs[i]).className = cls;
			if(document.getElementById('all'+tabs[i]))
				document.getElementById('all'+tabs[i]).style.display = 'none';
		}
	}
	
	if(document.getElementById('usrRev')) {
		if(document.getElementById('usrRev').style.display == 'none' && document.getElementById('usrRev').innerHTML != ''){ 
			document.getElementById('usrRev').style.display = 'block';
		}
	}
}

function appratings(pgno,total,appId)
{ 
	document.cookie = 'apprtpage='+pgno+'; '+date+'; path=/; domain=' + cookieondomain;
	
	$.get(WEBROOT+"functions/appratingsbypage.php", {cases: 'allreviews',pgno: pgno,total: total,appId:appId}, function(data) {
		$("#allratings").html(data);
	});
}

function appfratings(pgno,total,appId)
{	
	document.cookie = 'appfrpage='+pgno+'; '+date+'; path=/; domain=' + cookieondomain;
	
	$.get(WEBROOT+"functions/appratingsbypage.php", {cases: 'allfreviews',pagert: pgno,total: total,appId: appId }, function(data) {
		$("#allfratings").html(data);
	});
}

function appmratings(pgno,total,appId)
{
	document.cookie = 'appmrpage='+pgno+'; '+date+'; path=/; domain=' + cookieondomain;
	
	$.get(WEBROOT+"functions/appratingsbypage.php", {cases: 'allmreviews',pagert: pgno,total: total,appId: appId }, function(data) {
		//$('#rvw').unblock();
		$("#allmratings").html(data);
	});
}

$(function() {
	$('.showhide').click(function() {
		$(".slidediv").slideToggle();
		$(".upar").toggleClass('dwar');
	});
});

$(function() {
	$( "#accordion .bar").click(function(){		
		$(".details").not($($(this).parent()).find(".details")).slideUp();
		$($(this).parent()).find(".details").slideToggle();
	});
});


