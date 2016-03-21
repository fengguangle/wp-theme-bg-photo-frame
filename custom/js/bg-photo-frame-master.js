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
	bgSlide.bgPhotoFrame({
		width : '100%',
		gradationColor: bgGradationColor,
		autoTimer:4000,
		photoFrame:true,
		contents : '#site-wrapper',
		shuffle : shuffle
		
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
	
	function resize(){
		if($('#site-wrapper').height() < $(window).height()){
			$('#site-wrapper').height($(window).height());
		}
	}
	
	resize();
	
	
	/*=======================================================================
　　Custmizer
	=======================================================================*/
	
	
	
	
	
	
})(jQuery);


