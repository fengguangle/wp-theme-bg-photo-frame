/*=======================================================================
Image Transition(Fade)
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var fade = [];
	
	
fade.transitionFade = function(num){
	//各画像の表示・非表示
	var length = element.find('li').length;
	
	for(var i=0; i < length; i++){
		//i番目のリスト要素を取得
		var li = element.find('li').eq(i);
		li.stop(true,false);
		
		if(num == i){		//クリックされたボタンの順番と同一なら画像をフェードで表示
			li.css({
				marginLeft:0	
			});
			if(num != current){
				if(li.css('display') == 'none'){
					li.fadeIn(setting.fadeSpeed,function(){
						transitionFadeEnd();
					});
				}else{
					li.fadeTo(setting.fadeSpeed, 1.0, function(){
						transitionFadeEnd();
					});
				}
				
				resizeImages(i);
			}
		}else{//そうでなければフェードで非表示
			li.fadeOut(setting.fadeSpeed);
		}
	}
	transitionFadeEnd();
};


	
	

function transitionFadeStop(){
	var length = element.find('li').length;
	for(var i=0; i < length; i++){
		var li = element.find('li').eq(i);
		li.stop(false,true);
	}
}

function transitionFadeEnd(){
	command('transitionEnd');
}
