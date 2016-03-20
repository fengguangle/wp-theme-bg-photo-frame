/*
 * jQuery Easy Slide Show Fade v1.0.0
 * Copyright 2015 Digistry
 * Contributing Author: Takeshi Kashihara
 */

(function($){
	$.fn.easySlideshowFade = function( setting ){
		
		/*init
		----------------------------------------------------------------------*/
		//params
		var defaluts = {
			suffle:false				//シャッフルの有無
			,width:'100%'				//画像の幅
			,height:'auto'				//画像の高さ
			,minHeight:'none'			//画像の最大の高さ
			,maxHeight:'none'			//画像の最大の高さ
			,autoChange:true			//画像の自動切り替え
			,autoTimer:4000				//画像の自動切り替えのタイマー
			,fadeSpeed:1000				//画像の自動切り替えのタイマー
			,shuffle:true				//シャッフル
			,gradationColor : '0,0,0'	//グラデーションカラー
			,callbackBefore:null
			,callbackAfter:null
			,callbackChange:null
			
		};

		//extend params
		setting = $.extend( defaluts, setting );
			if(this.length){
				
			
			//element
			var element = this;
			
			//Wrapper
			var wrapper = '<div id="images-wrapper"></div>';
			var gradationTop = '<div id="images-top"></div>';
			var gradationBottom = '<div id="images-bottom"></div>';
	
			//parent element
			var parent = element.parent();
	
			//number of images
			var num = element.find('li').length;
			
			//information of images
			var imgInfo = [];
	
			//current image
			var current = 0;
	
			//timer
			var timer;
	
			
			var loaded = false;
			
			/* call back before run
			----------------------------------------------------------------------*/
			if(setting.callbackBefore){
				window[setting.callbackBefore].apply()
			}
			if(element.find('li').length){
				/*add element
				----------------------------------------------------------------------*/
				
				element.wrap("<div id='images-wrapper'></div>")
				wrapper = $('#images-wrapper');
				
				
				
				
				
				/* setting css
				----------------------------------------------------------------------*/
				//ul element
				element.css({
					margin:'0px'						//余白をなくす
					,padding:'0px'
				})
				wrapper.css({
					opacity:'1.0'
				})
				
				if(setting.height != 'auto'){
					element.css({
						height:setting.height + 'px'	//高さをパラメータの値に指定
					})
				}
		
				//list element
				element.find('li').css({
					position:'absolute'					//ポジションを絶対値に指定して画像を重ねて表示
					,listStyle:'none'					//リストスタイルを無しに指定
					,display : 'none'
					,overflow : 'hidden'
				})
				
				element.find('img').css({
					maxWidth:'none'					//画像の幅をパラメータの値に指定
				})
		
				//image alement
				if(setting.width == '100%'){
					element.find('li').css({
						width:'100%'					//画像の幅をパラメータの値に指定
					})
					element.find('img').css({
						width:'100%'					//画像の幅をパラメータの値に指定
					})
				}else if(setting.width != 'auto'){
					element.find('img').css({
						width:setting.width + 'px'		//画像の幅をパラメータの値に指定
					})
				}
				
				
		
		
		
		
				/*シャッフル
				----------------------------------------------------------------------*/
				if(setting.shuffle){
					var shuffleElement = element.html().split("</li>")
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
					imgInfo.push({loaded:false, src:src, width:0, height:0, retio:0, source:null})
				}
				
		
				
				
				/*=======================================================================
				/*画面のリサイズ
				=======================================================================*/
				/* リサイズイベント
				----------------------------------------------------------------------*/
				//イベントの割り当て
				function setResizeEvent(){
					$(window).resize(function(){
						for(var i = 0;i < element.find('li').length;i++){
							resizeImages(i);
						}
					})
					for(var i = 0;i < element.find('li').length;i++){
						resizeImages(i);
					}	
				}
				
				
				
				/* 画像のリサイズ
				----------------------------------------------------------------------*/
				function resizeImages(_num){
					var windowWidth= $(window).width()
					var windowHeight= $(window).height();
					var windowRatio = windowWidth / windowHeight;
	
					var baseWidth;
					var baseHeight;
					var _li = element.find('li').eq(_num)
					var _img;
					
					if(_li.css('display') == 'block'){
						
						
						if(_num in imgInfo){
							_img = _li.find('img');
							var imgRatio = imgInfo[_num]['ratio'];
							var imgWidth;
							var imgHeight;
							var marginTop;
							var marginLeft;
							//console.log(windowRatio)
							//console.log(imgRatio)
							if(windowRatio > imgRatio){
								imgWidth = windowWidth;
								imgHeight = parseInt(windowWidth / imgRatio);
								marginTop =  -(imgHeight - windowHeight)/2
								marginLeft = 0
							}else{
								//console.log(imgInfo[_num]['height'] / imgInfo[_num]['width'])
								imgWidth = parseInt(windowHeight / (imgInfo[_num]['height'] / imgInfo[_num]['width']));
								//console.log(imgWidth)
								imgHeight = windowHeight;
								marginTop = 0
								marginLeft = -(imgWidth - windowWidth)/2;
							}
				
							_img.width(imgWidth);
							_img.height(imgHeight);
				
							_img.css({
								marginTop:marginTop + 'px'
								,marginLeft:marginLeft + 'px'
							})
						}
						
					}
				}
		
				
				/*=======================================================================
				/*読み込み
				=======================================================================*/		
				
				/*　読み込み完了イベントの割り当て
				----------------------------------------------------------------------*/
				
				for(var i = 0; i < element.find('img').length; i++){
					 var _img = this.find('img').eq(i);
					 _img.bind("load", function(){
						 var index = element.find('img').index(this);
						 imgInfo[index]['loaded'] = true;
						 setImageSize(index); //画像サイズを取得
						 
						 
						 checkLoadComplete()  //画像が全て読み込まれたかチェック
					 }) 
				 }	 
						
				/*元画像のサイズを取得
				----------------------------------------------------------------------*/
				function setImageSize(_index){
					var img = element.find('img').eq(_index);
					var _src= _img.attr('src');
					var source = $('<img>');
					source.attr('src',_src + "?" + new Date().getTime());
					source.attr('alt', _index);
					source.load(function(){
						var num = $(this).attr('alt');
						imgInfo[num]['source'] = source
						//onLoad(num);
						var _size = getImageTrueSize(imgInfo[num]['source']);
						_size['ratio']  = _size['width'] / _size['height'];
						imgInfo[_index]['width'] = _size['width'];
						imgInfo[_index]['height'] = _size['height'];
						imgInfo[_index]['ratio'] = _size['ratio'];
						imgInfo[_index]['loaded'] = true;
						
						checkLoadComplete(); //読み込み完了のチェック
						if(_index == 0){ //最初の画像が読み込み完了したら動作スタート
							LoadFirstImageComplete();
							
						 }
						 
					})
				}
		
				function getImageTrueSize(image){
					var size = []
					if(image.prop('naturalWidth')){
						size['width'] = image.prop('naturalWidth')
						size['height'] = image.prop('naturalHeight')
					}else{
						var img = new Image();
						img.src = image.attr('src');
						size['width'] = img.width
						size['height'] = img.height;
					}
					return size;
			
				}
				
				/*　読み込み完了チェック
				----------------------------------------------------------------------*/
				
				 function checkLoadComplete(){
					 var allLoaded = true;
					 for(var i = 0; i < imgInfo.length; i++){
						 if(!imgInfo[i]['loaded']){
							 allLoaded = false;
							 break;
						 }
					 }
					 
					 if(allLoaded){
						 loaded = true;
						 LoadComplete()
					 }
					 
				 }
				 
				/*　最初に表示させる画像の読み込み完了
				----------------------------------------------------------------------*/
				 function LoadFirstImageComplete(){
					 start();
				 }
				 
				/*　全ての画像の読み込み完了
				----------------------------------------------------------------------*/
				 function LoadComplete(){
					 
				 }
				 
				/*=======================================================================
				動作スタート
				=======================================================================*/
				function start(){
					showFirstImage();
					setResizeEvent();
						
					//最初のタイマーイベントを設定
					setTimerEvent();
					if(setting.callbackAfter){
						window[setting.callbackAfter].apply()
					}
				}
				
				/*1番目以外の画像を非表示にする
				----------------------------------------------------------------------*/
				function showFirstImage(){
					for(var i=0; i < num; i++){
						//i番目のリスト要素を取得
						var li = element.find('li').eq(i);
						//最初の画像以外は非表示に設定
						if(i == 0){
							//resizeImages(i);
							li.css({
								opacity:0,
								display : 'block'
							})
							
							li.fadeTo(setting.fadeSpeed, 1);
							
						}else{
							li.hide();
						}
					}
					element.show();
				}
				
				/*=======================================================================
			　　画像の自動切り替え
				=======================================================================*/
				function setTimerEvent(){
					if(setting.autoChange && element.find('li').length > 1){
						timer = setTimeout(function() {timerChange()},setting.autoTimer)
					}
				}
				
				function timerChange(){
					//次に表示させる画像を設定する
					var newNum
					if(current >= num - 1){		//一番最後の画像を表示させている場合は最初に戻る
						newNum = 0;
					}else{						//それ以外は次の画像を指定する。
						newNum = current + 1;
					}
					current = newNum	//現在表示させている画像を代入
		
					//各画像の表示・非表示
					for(var i=0; i < num; i++){
						//i番目のリスト要素を取得
						var li = element.find('li').eq(i);
						if(newNum == i){		//クリックされたボタンの順番と同一なら画像をフェードで表示
							li.css({
								opacity:0,
								display : 'block'
							})
							li.fadeTo(setting.fadeSpeed, 1);
							
							//li.fadeIn(setting.fadeSpeed, function(){$(this).css('display', 'block')});
							resizeImages(i);
						}else{					//そうでなければフェードで非表示
							li.fadeOut(setting.fadeSpeed);
						}
		
						//buttonColorChange(i)
					}
		
		
					//再度タイマーイベントを設定。
					//ボタンがクリックされたら自動切り替えをストップする場合には
					//ボタンがクリックされいた場合は設定しない。
					if(setting.stopWhenClicked){
						if(!clicked){	//ボタンをクリックしていなかったらタイマーイベントを再度設定
							timer = setTimeout(function() {timerChange()},setting.autoTimer)
						}
					}else{
						timer = setTimeout(function() {timerChange()},setting.autoTimer)
					}
					if(setting.callbackChange){
						window[setting.callbackChange].apply(this, [current])
					}
				}
			}
		}
		
		/*=======================================================================
	　　グラデーションの表示・非表示
		=======================================================================*/
		$.fn.easySlideshowFade.toggleGradation = function() {
			console.log("toggleGradation")
			
		};
		$.fn.easySlideshowFade.showGradation = function() {
			console.log("showGradation")
		};
		
		$.fn.easySlideshowFade.showGradation = function() {
			console.log("hideGradation")
		};
			
	}
})(jQuery);
