/*=======================================================================
/* init
=======================================================================*/
				
			

/* call back before run
----------------------------------------------------------------------*/
if(setting.callbackBefore){
	window[setting.callbackBefore].apply();
}

if(element.find('li').length){
	
	
	/*add element
	----------------------------------------------------------------------*/
	
	element.wrap("<div id='bg-photo-frame-images-wrapper'></div>");
	wrapper = $('#bg-photo-frame-images-wrapper');
	
	if(setting.controls !=''){
		controls = $(setting.controls);
	}else{
		$('body').prepend("<div id='bg-photo-frame-controls'></div>");
		controls = $('#bg-photo-frame-controls');
	}
	
	
	/* setting css
	----------------------------------------------------------------------*/
	//ul element
	element.css({
		margin:'0px',					//余白をなくす
		padding:'0px',
	});
	wrapper.css({
		opacity:'1.0'
	});
	
	if(setting.height != 'auto'){
		element.css({
			height:setting.height + 'px'	//高さをパラメータの値に指定
		});
	}

	//list element
	element.find('li').css({
		position:'absolute',				//ポジションを絶対値に指定して画像を重ねて表示
		listStyle:'none',					//リストスタイルを無しに指定
		display : 'none',
		overflow : 'hidden'
	});
	
	element.find('img').css({
		maxWidth:'none'					//画像の幅をパラメータの値に指定
	});

	//image alement
	if(setting.width == '100%'){
		element.find('li').css({
			width:'100%'					//画像の幅をパラメータの値に指定
		});
		element.find('img').css({
			width:'100%'					//画像の幅をパラメータの値に指定
		});
	}else if(setting.width != 'auto'){
		element.find('img').css({
			width:setting.width + 'px'		//画像の幅をパラメータの値に指定
		});
	}
	
	




	/*シャッフル
	----------------------------------------------------------------------*/
	if(setting.shuffle){
		var shuffleElement = element.html().split("</li>");
		shuffleElement.splice(shuffleElement.length-1);

		for (var i = shuffleElement.length-1;i>=0;i--) {
			var r = Math.floor(i*Math.random());
			var tmp = shuffleElement[i];
			shuffleElement[i] = shuffleElement[r];
			shuffleElement[r] = tmp;
		}

		element.empty();

		for(var i=0;i<shuffleElement.length;i++){
			element.append(shuffleElement[i]);
		}

	}

	/*画像の情報を初期化
	----------------------------------------------------------------------*/
	for(var i = 0;i < element.find('img').length;i++){
		var img = element.find('img').eq(i);
		var src = img.attr('src');
		imgInfo.push({loaded:false, src:src, width:0, height:0, retio:0, source:null});
	}
	

	