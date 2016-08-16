/*=======================================================================
　　Toggle
=======================================================================*/

// params
var toggleBtnId = prefix + '-toggle';
var iconClassPhotoFrame = 'glyphicon-picture';
var iconClassBlog = 'glyphicon-list-alt';

var toggleButtonSrc = '<a href="#" id="' + toggleBtnId + '" class="'+ prefix +'-btn"　name="Switch Mode"><span class="glyphicon glyphicon-picture" aria-hidden="true"></span><span class="screen-reader-text">Swich to Photoframe Mode</span></a>';
var toggleButton;


/* init
----------------------------------------------------------------------*/

function initToggle(){
	
	controls.append(toggleButtonSrc);
	toggleButton = $('#' + toggleBtnId);
	
	if(device == 'pc'){
		toggleButton.click(function() {
			command('modeChange');
			return false;
		});
	}else{
		toggleButton.bind('touchstart', function(event) {
			command('modeChange');
			event.preventDefault();
		});
	}
}


/* Icon Change
----------------------------------------------------------------------*/
function changeToggleBtnIcon(){
	$('#'+toggleBtnId).find('span').removeClass(iconClassPhotoFrame);
	$('#'+toggleBtnId).find('span').removeClass(iconClassBlog);
	if(currentMode == 'background'){
		$('#'+toggleBtnId).find('span.glyphicon').addClass(iconClassPhotoFrame);
		$('#'+toggleBtnId).find('span.screen-reader-text').html('Swich to Photoframe Mode');
	}else if(currentMode == 'photoframe'){
		$('#'+toggleBtnId).find('span.glyphicon').addClass(iconClassBlog);
		$('#'+toggleBtnId).find('span.screen-reader-text').html('Swich to Background Mode');
	}
	
}

if(setting.photoFrame ){
	initToggle();
}


