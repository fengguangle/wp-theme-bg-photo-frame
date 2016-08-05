/*=======================================================================
Image Auto change(Swipe)
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var swipe = [];
var swipeSpeed = 2000;
var swipeAnmation = false;
var currentSwipeNum = 0;
var nextSwipeNum = 0;
var swipeSpeedLimit = 5;
var swipeSpeedTimerSpan = 100;
	
	
swipe.transitionSwipe = function(num, direction){
	if(!swipeAnmation){
		currentSwipeNum = parseInt(current);
	}
	swipeLoopStop();
	swipeLoop(num,direction);
};

function swipeLoop(num,direction){
	var margin;
	var swipeEasing = easing;
	var speed = swipeSpeed;
	var brake  = 1;
	var currentMargin = removeUnit(wrapper.css('marginLeft'));
	var _nextSwipeNum;
	var wrapperMargin;
	
	speed = setSpeed(num, direction);
	setSwipePosition(num,direction);
	setSwipeImage(num, direction);
	
	
	wrapper.animate({
		marginLeft : 0
		},
		speed,
		swipeEasing, 
		function(){
			swipeEnd(num, direction);
		}
	);
	swipeAnmation = true;
}


function setSwipePosition(num,direction){
	var margin = 0;
	var wrapMargin = removeUnit(wrapper.css('marginLeft'));
	if(direction == 'current'){
		margin = removeUnit(wrapper.css('marginLeft'));
	}else if(direction == 'next'){
		margin = $(window).width() + wrapMargin;
	}else if(direction == 'prev'){
		margin = -$(window).width() + wrapMargin;
	}
	
	wrapper.css({
		marginLeft : margin + 'px'
	});
}


function setSwipeImage(num, direction){
	var img = element.find('li').eq(num);
	command('setSwipeImage',num);
	img.css({
		display : 'block',
		marginLeft : 0
	});
	
	
	
	element.find('li:not(:eq('+ num + '))').css({
		display : 'none'
	});
	
}



function setSpeed(num, direction){
	var speed =0;
	var brake = 1;
	var margin = removeUnit(wrapper.css('marginLeft'));
	
	if(margin >= 0){
		speed = ($(window).width() - margin) * brake;
	}else{
		speed = ($(window).width() + margin) * brake;
	}
	return speed;
}





function swipeEnd(num, direction){
	swipeLoopStop();
	command('swipeEnd');
}

function swipeLoopStop(){
	wrapper.stop(true,false);
	swipeAnmation = false;
	
}


/*=======================================================================
Swipe Interaction
=======================================================================*/

var swipeActive;
var swipeActiveStart;
var swipeActiveCurrent;
var swipeStartMargin;
var swipeDistance;
var swipeSpeed;
var swipeSpeedStart;
var swipeSpeedCurrent;
var swipeSpeedTimer = [];

if(device == 'pc'){
	maskElement.mousedown(function(e){
		swipeDown(e.pageX);
	});
	$(window).mousemove(function(e){
		swipeMove(e.pageX);
	});
	$(window).mouseup(function(e){
		swipeUp(e.pageX);
	});
}else{
	maskElement.bind('touchstart' , function(){
		swipeDown(event.changedTouches[0].pageX);
	});
	$(window).bind('touchmove' , function(){
		swipeMove(event.changedTouches[0].pageX);
	});
	$(window).bind('touchend' , function(){
		swipeUp(event.changedTouches[0].pageX);
	});
}

function swipeDown(_x){
	if(currentMode == 'photoframe'){
		swipeLoopStop();
		swipeActive = true;
		swipeDistance = 0;
		swipeSpeed = 0;
		
		setSwipePosition(current,'current');
		setSwipeImage(current,'current');
		
		swipeActiveStart = _x;
		swipeSpeedStart = _x;
		swipeStartMargin = removeUnit(wrapper.css('marginLeft'));
		
		swipeSpeedTimer.push(setInterval(function(){
			setSwipeSpeed();
		},swipeSpeedTimerSpan));
		
		command('swipeDown');
	}
}

function setSwipeSpeed(){
	swipeSpeed = swipeSpeedStart - swipeSpeedCurrent;
	swipeSpeedStart = swipeSpeedCurrent;
}

function swipeMove(_x){
	if(swipeActive){
		swipeLoopStop();
		swipeDistance = _x - swipeActiveStart;
		swipeSpeedCurrent = _x;
		var margin =  swipeStartMargin + swipeDistance;
		wrapper.css({
			marginLeft : margin + 'px'
		});
	}
}

function swipeUp(_x){
	if(swipeActive){
		swipeLoopStop();
		for(var i=0; i < swipeSpeedTimer.length; i++){
			clearInterval(swipeSpeedTimer[i]);
		}
		swipeSpeedTimer.length = 0;
	
		var direction = 'current';
		var wrapperMargin = removeUnit(wrapper.css('marginLeft'));
		
		swipeSpeed = swipeSpeedStart - _x;
		

		if(swipeSpeed > swipeSpeedLimit || swipeSpeed < -swipeSpeedLimit){
			if(swipeSpeed > 0){
				direction = 'next';
			}else{
				direction = 'prev';
			}
		}else{
			if(wrapperMargin > $(window).width() / 2 || wrapperMargin < -$(window).width() / 2){
				if(wrapperMargin < 0){
					direction = 'next';	
				}else{
					direction = 'prev';	
				}
			}
		}

		if(direction){
			command('imgChange', direction); 
		}
		
		command('swipeUp');
		swipeDistance = 0;
	}
	
	
	swipeActive = false;
}
