// JavaScript Document

var bgSlide;
var bgGradationColor;
(function($){
	
	/*=======================================================================
　　Header Images
	=======================================================================*/
	/*Slider
	-----------------------------------------------*/
	bgSlide = $('#header-image ul');
	bgSlide.easySlideshowFade({
		width : '100%',
		gradationColor: bgGradationColor,
		autoTimer:4000
		
	});

　　/*Flip
	-----------------------------------------------*/		
	var flip = $('.flip');
	
	flip.click(function(){
		flipImage();
	})
	
	function flipImage(){
		$('#site-wrapper').fadeToggle(1000);
		bgSlide.easySlideshowFade.toggleGradation();
	}	


	//Resize
	$(window).resize(function(){
		resize()
	})
	resize();
	
	
	function resize(){
		var height = 0.94;
		/*
		if($('body').hasClass('admin-bar')){
			height = 0.86;
		}
		$('#site-wrapper').height($(window).height() * height);
		*/
	}
	
	resize();
	
	
	/*=======================================================================
　　Custmizer
	=======================================================================*/
	
	
	
	
	
	
})(jQuery);


