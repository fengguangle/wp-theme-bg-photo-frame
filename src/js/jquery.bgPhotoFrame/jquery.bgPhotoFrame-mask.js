/*=======================================================================
/* Mask
=======================================================================*/

/* Params
----------------------------------------------------------------------*/
var mask = [];
var maskElement;

/* Init
----------------------------------------------------------------------*/
function initMask(){
	wrapper.after("<div id='images-mask'></div>");
	maskElement = $('#images-mask');
	
	//CSS
	
	maskElement.css({
		background : 'rgba(' + setting.maskColor + ',' + setting.maskColor + ',' + setting.maskColor+ ',' +setting.maskOpacity + ')'
	});
}

/* commands
----------------------------------------------------------------------*/
mask.showMask =  function(){
	maskElement.stop(true,false).fadeTo(fadeTime , 1.0);
};

mask.hideMask =  function(){
	maskElement.stop(true,false).fadeTo(fadeTime, 0.0);
};

/* Resize
----------------------------------------------------------------------*/
function resizeMask(){
	maskElement.css({
		width:$(window).width() + 'px',
		height:$(window).height() + 'px'
	});
}



/* Run
----------------------------------------------------------------------*/

initMask();

//Attach event
$(window).resize(function(){
	resizeMask();
});
resizeMask();