/*=======================================================================
  Mode
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var contentFadeTime = 500;
var currentMode = 'background';
var mode = [];	
	
/* Commands
----------------------------------------------------------------------*/
mode.modeChange = function(){
	
	stopModeChangeAnimation();
	if(currentMode == 'background'){
		photoFrameMode();
	}else if(currentMode == 'photoframe'){
		backgroundMode();
	}
};

/* functions
----------------------------------------------------------------------*/
	
//Photoframe
function photoFrameMode(){
	currentMode = "photoframe";
	hideContents();
}

//Background
function backgroundMode(){
	currentMode = "background";
	modeChangeAnimation(mode);
}



/*Contents animation
----------------------------------------------------------------------*/
//Show
function showContents(){
	$(setting.contents).fadeIn(contentFadeTime,function(){
		contentsAnimationEnd();
	});
}

//Hide
function hideContents(){
	$(setting.contents).fadeOut(contentFadeTime,function(){
		contentsAnimationEnd();
	});
}

function stopContentsAnimation(){
	$(setting.contents).stop(false,true);
}


//Animation end.
function contentsAnimationEnd(){
	//Run resize if mode has photoframe.
	if(currentMode == "photoframe"){
		modeChangeAnimation();
	}else if(currentMode == "background"){
		command('modeChangeEnd');
	}
}


/* Change Animation
----------------------------------------------------------------------*/
function modeChangeAnimation(mode){
	var currentImage = element.find('li').eq(current).find('img');
	resizeImages(current,true, true,'EndModeChangeAnimation');	
}

function EndModeChangeAnimation(){
	if(currentMode == "photoframe"){

	}else if(currentMode == "background"){
		showContents();
	}
	changeToggleBtnIcon();
	command('modeChangeEnd');
}

function stopModeChangeAnimation(){
	stopContentsAnimation();
}
	

