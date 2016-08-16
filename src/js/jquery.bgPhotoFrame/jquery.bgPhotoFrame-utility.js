/*=======================================================================
Utility
=======================================================================*/
/* Detect Device
----------------------------------------------------------------------*/
function userAgent(){
  var a;
  var ua = navigator.userAgent;

  if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("iPod") > -1) a = "ios";
  else if(ua.indexOf("Android") > -1) a = "android";
  else a = "pc";
  return a;
}

/* Remove Unit
----------------------------------------------------------------------*/
function removeUnit(val){
	return parseInt(val.replace(/([a-z]+)/,''));
}