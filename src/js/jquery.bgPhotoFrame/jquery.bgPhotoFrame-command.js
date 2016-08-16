/*=======================================================================
  Command function
=======================================================================*/
// Params
var commandProcess=[];
var interface = false;

function command(sentence,val){
	commandProcess[sentence](val);
}

commandProcess.loaded = function(){
	transition.showFirstImage();
	resize.setResizeEvent();
		
	//最初のタイマーイベントを設定
	
	timer.setTimer();
	
	if(setting.callbackAfter){
		window[setting.callbackAfter].apply();
	}
}

commandProcess.modeChange = function(){
	if(btnEnable){
		btnEnable = false;
		mode.modeChange();
		if(currentMode == 'photoframe'){
			mask.hideMask();
		}else if(currentMode == 'background'){
			hideInterface();
			disableTimerInterface();
		}
		timer.disableTimer();
	}
};

commandProcess.modeChangeEnd = function(){
	if(currentMode == 'photoframe'){
		showInterface();
		enableTimerInterface();
	}else if('background'){
		timerOn();
		mask.showMask();
	}
	timer.setTimer();
	btnEnable = true;
};



commandProcess.imgChange = function(val){
	timer.disableTimer();
	var newNum = change.getChangeNum(val);
	
	dammy.removeDammy();
	if(val == 'next' || val == 'prev' || val == 'current'){
		dammy.setDammy(newNum,val);
		transition.transition(newNum,'swipe', val);
	}else{
		transition.transition(newNum,'fade');
	}
	previous = current;
	current = newNum;
	removeTimerInterface();
	setTimerInterface();
};



commandProcess.setSwipeImage = function(val){
	resizeImages(val,false,true);
};

commandProcess.setDammy = function(val){
	resizeImages(val,false,true);
};

commandProcess.swipeDown = function(){
	dammy.removeDammy();
	dammy.setDammy(current,'current');
	timer.disableTimer();
	removeTimerInterface();
	setTimerInterface();
};

commandProcess.swipeUp = function(){
	timer.setTimer();
};

commandProcess.swipeEnd = function(){
	dammy.removeDammy();
};

commandProcess.transitionEnd = function(){
	timer.setTimer();
};

commandProcess.timerChange = function(){
	var newNum = change.getChangeNum('next');
	transition.transition(newNum, 'fade');
	current = newNum;
};





/*Show/Hide Interface
----------------------------------------------------------------------*/
var interfaceTimer = [];
function showInterface(){
		showNav();
		showThumbBtn();
		showTimer();
		interface = true;
}

function hideInterface(){
		hideNav();
		hideThumbBtn();
		hideTimer();
		interface = false;
}

function toggleInterface(){
	if(interface){
		hideInterface();
	}else{
		showInterface();
	}
}

function enableTimerInterface(){
	if(setting.interfaceTimer){
		maskElement.bind('click', function(){
			if(currentMode == 'photoframe'){
				showInterface();
				removeTimerInterface();
				setTimerInterface();
			}
		});
		setTimerInterface();
	}
	
}
function setTimerInterface(){
	if(setting.interfaceTimer){
		interfaceTimer.push(setTimeout(function() {
			hideInterface();
		},setting.autoTimer));
	}
}


function disableTimerInterface(){
	maskElement.unbind('click');
	removeTimerInterface();
	
}

function removeTimerInterface(){
	for(var i=0; i < interfaceTimer.length; i++){
		clearTimeout(interfaceTimer[i]);
	}
	interfaceTimer.length = 0;
}

