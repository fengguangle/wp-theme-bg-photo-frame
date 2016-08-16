/*=======================================================================
Image Thumbnails
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var thumbPage;
var thumbBtn;

var thumbPrefix = prefix + '-thumb';
var thumbPageClass = thumbPrefix + '-thumbs';
var thumbBtnClass = thumbPrefix + '-btn';
var thumbTime = 500;

/* Init
----------------------------------------------------------------------*/

function initThumbs(){
	
	
	//ボタン
	controls.append('<a id="' + thumbBtnClass + '" class="'+ prefix +'-btn" href="#"><span class="glyphicon glyphicon-th" aria-hidden="true"></span><span class="screen-reader-text">Open Image Thumbnails List</span></a>');
	thumbBtn = $('#' + thumbBtnClass);
	
	//ページ
	controls.append('<div id="'+ thumbPageClass + '"><div id="' + thumbPageClass + '-inner" class="clearfix"><ul></ul></div></div>');
	thumbPage = $('#'+ thumbPageClass + ' ul');
	
	
	
	//サムネール
	for(var i = 0;i < element.find('li').length;i++){
		var alt = element.find('li').eq(i).find('img').attr('alt')
		var thumb = '<li class="' + thumbPrefix + '" id="' + prefix + '-thumb-' + i + '"><a href="#' + i + '"><span class="screen-reader-text">'+ alt +'</span></a></li>';
		thumbPage.append(thumb);
	}
	
	//Event
	if(device == 'pc'){
		thumbBtn.click(function() {
			toggleThumbBtn();
			return false;
		});
	}else{
		thumbBtn.bind('touchstart', function(event) {
			toggleThumbBtn();
			event.preventDefault();
		});
	}
	
	
	$('#' + thumbPageClass).bind('click' , function() {
		closeThumbs();
		return false;
	});
	
}




function attachThumbImage(num,src){
	var thumb = thumbPage.find('li').eq(num).find('a');
	var thumbImg = new Image();
	thumbImg.src = src;
	//元画像のサイズを取得
	imgWidth = imgInfo[num]['width'];
	imgHeight = imgInfo[num]['height'];
	imgRatio = imgInfo[num]['ratio'];
	
	//サムネールのサイズを取得
	thumbSize = thumbPage.find('li').width();
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	

	
	var fixWidth;
	var fixHeight;
	var fixMarginTop = 0;
	var fixMarginLeft = 0;
	var drawPositonX = 0;
	var drawPositonY = 0;

	if(imgRatio > 1){ //横長の場合
		fixHeight = thumbSize;
		fixWidth = thumbSize * imgRatio;
		drawPositonX = (thumbSize - (thumbSize * imgRatio)) / 2;
	}else{　//縦長の場合
		fixWidth = thumbSize;
		fixHeight = imgHeight * (thumbSize / fixWidth);
		drawPositonY = (thumbSize - (thumbSize / imgRatio)) / 2;
	}

	ctx.drawImage(thumbImg, drawPositonX, drawPositonY, fixWidth , fixHeight );
	thumb.append(canvas);
	
	
	thumb.click(function() {
		ThumbClick(thumb);
		return false;
	});
	
}

/* Resize
----------------------------------------------------------------------*/


function resizeThumbs(){
	var innerWidth = $(window).width();
	var innerHeight = $(window).height();
	var innerPaddingHorizontal = $(window).width() * 0.02;
	
	$('#' + thumbPageClass + '-inner').css({
		width : innerWidth + 'px',
		//height : innerHeight + 'px',
		padding : innerPaddingHorizontal + 'px ' + innerPaddingHorizontal +'px',
	});
	
	
	//サムネールのサイズを取得
	var thumbSize = thumbPage.find('li').width();
	var thumbMargin = removeUnit(thumbPage.find('li').css('margin'));
	
	var ulMargin =  (
			$('#' + thumbPageClass + ' ul').width() 
			- (thumbSize + thumbMargin * 2) * parseInt($('#' + thumbPageClass + ' ul').width() 
			/ (thumbMargin * 2 + thumbSize))
		) / 2;
	
	$('#' + thumbPageClass + ' ul').css({
		marginLeft : ulMargin + 'px'
	});
}






/* Button
----------------------------------------------------------------------*/
//Show
function showThumbBtn(){
	thumbBtn.stop(false,true);
	thumbBtn.fadeIn(fadeTime);
}

//Hide
function hideThumbBtn(){
	thumbBtn.stop(false,true);
	thumbBtn.fadeOut(fadeTime);
}

//サムネールボタンの開閉
function toggleThumbBtn(){
	thumbBtn.toggleClass('active');
	toggleThumbs();
}


/* Event of Thumbs
----------------------------------------------------------------------*/
function toggleThumbs(){
	thumbAnimationStop();
	if(thumbBtn.hasClass('active')){
		openThumbs();
	}else{
		closeThumbs();
	}
}

function thumbAnimationStop(){
	$('#' + thumbPageClass).stop(false,true);
}

function openThumbs(){
	$('#' + thumbPageClass).show();
	$('#' + thumbPageClass).animate({
		width:'100%',
		height:'100%'
	},thumbTime,easing);
}


function closeThumbs(){
	$('#' + thumbPageClass).animate({
		width:'0%',
		height:'0%'
	},thumbTime,easing,function(){
		$('#' + thumbPageClass).hide();
	});
	thumbBtn.removeClass('active');
}



/* Thumbnails
----------------------------------------------------------------------*/
//Event
function ThumbClick(thumb){
	var num = thumb.attr('href').replace('#', '');
	command('imgChange',num);
	closeThumbs();
}


/* Run
----------------------------------------------------------------------*/
if(setting.photoFrame){
	initThumbs();
	$(window).resize(function(){
		resizeThumbs();
	});
	resizeThumbs();
}


