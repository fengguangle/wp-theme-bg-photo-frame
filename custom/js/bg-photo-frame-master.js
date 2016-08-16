// JavaScript Document

var bgSlide;
var bgGradationColor;
(function($){
	
	/*Slider
	-----------------------------------------------*/
	var maskColor = 255;
	if(themeColor == 'dark'){
		maskColor = 0;
	}
	
	bgSlide = $('#header-image ul');
	bgSlide.bgPhotoFrame({
		width : '100%',
		gradationColor: bgGradationColor,
		autoTimer:4000,
		interfaceTimer:false,
		photoFrame:true,
		contents : '#site-wrapper',
		shuffle : shuffle,
		maskColor : maskColor,
		maskOpacity : imageOpacity,
		controls : '.bg-photo-frame-controls'
	});
	
	
	

	/*Navigation
	-----------------------------------------------*/
	var subnavTop = $('.nav li').height();
	$('.nav li > ul').css({
		top : subnavTop + 'px'
	})
	$('.nav li > ul ul').css({
		top : '-1px'
	})

	/*Background
	-----------------------------------------------*/
	
	$('#primary-inner,.navbar-nav li,.widget').css({
		background : 'rgba('+maskColor+','+maskColor+','+maskColor+',' + contentsOpacity + ')'
	})
	
	
	/*Resize
	-----------------------------------------------*/
	$(window).resize(function(){
		resize()
	})
	
	function resize(){
		if($('#site-wrapper').height() < $(window).height()){
			$('#site-wrapper').height($(window).height());
		}
	}
	
	resize();

	
	
})(jQuery);


