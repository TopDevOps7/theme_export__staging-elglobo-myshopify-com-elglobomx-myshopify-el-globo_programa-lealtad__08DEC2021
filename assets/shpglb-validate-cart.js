/*var boton='<li class="nav-bar__item"><a href="/pages/sucursales" class="nav-bar__link link" data-type="menuitem"'
+'style="padding:2px 10px;background:#ffffff;border:solid 1px #ccc;border-radius: 2px;font-size:0;line-height:10px;"><span style="'
   +' display: block;font-size: 18px;margin-top: 3px;">'+sessionStorage.getItem('suc_name')+'</span><br><span style=" font-size: 12px;'
+'">Cambiar de sucursal</span></a></li>';*/
if(sessionStorage.getItem('suc_name')){
$('#active-sucursal').html(sessionStorage.getItem('suc_name'));
  $('#active-sucursal-movil').html(sessionStorage.getItem('suc_name'));
  $('.active-suc-link').html('Cambiar sucursal');
}else{
$('.active-suc-link').html('Elegir sucursal');
  $('#active-sucursal').html('--');
  $('#active-sucursal-movil').html('--');
}
/*$('.mobile-menu__nav').append(boton);*/



$(document).ready(function() {
    //getHeight();
   

});
$( window ).resize(function() {
 //getHeight();
});

/*
function getHeight(){

	
	var screen=$( window ).height();
 var foot=(7.38*screen)/100;
    $(".first-view").css('height',screen-foot+'px');
    $(".suc-footer").css('height',foot+'px');
    $(".suc-footer-logos").css('line-height',foot+'px');

} */
var site_url="https://staging-elglobo.myshopify.com/";
 
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + ";domain=staging-elglobo.myshopify.com; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=;domain=staging-elglobo.myshopify.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

var cook=getCookie('suc');
console.log('cook',cook);
	
  function setSucCookie(sucdata){
    var cookie_value =  JSON.stringify({
           "selected_suc" : sucdata['selected_suc'],
           "selected_suc_name" : sucdata['selected_suc_name'],
           "selected_suc_dir" : sucdata['selected_suc_dir'],
"selected_suc_horario" : sucdata['selected_suc_horario'],
"selected_suc_tel" : sucdata['selected_suc_tel'],
"selected_suc_lat" : sucdata['selected_suc_lat'],
"selected_suc_lon" : sucdata['selected_suc_lon']
           });
     	
   	 
      eraseCookie('suc');
      setCookie('suc',cookie_value,30);     
    
  }