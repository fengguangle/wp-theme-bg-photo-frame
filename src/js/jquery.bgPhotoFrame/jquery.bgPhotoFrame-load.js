/*=======================================================================
/* Load
=======================================================================*/		

/*　読み込み完了イベントの割り当て
----------------------------------------------------------------------*/

for(var i = 0; i < element.find('img').length; i++){
	
	var img = this.find('img').eq(i);
	var imgSrc = img.attr('src');
	var loadImg = $(new Image());
	loadImg.attr('id',i);
	loadImg.bind('load', function(){
		var index = $(this).attr('id');
		var src = $(this).attr('src');
		imgInfo[index]['loaded'] = true;
		setImageSize(index); //画像サイズを取得
		attachThumbImage(index,src); //サムネール画像の作成
		checkLoadComplete();  //画像が全て読み込まれたかチェック
	});
	loadImg.attr('src',imgSrc);
 }	 
		
/*元画像のサイズを取得
----------------------------------------------------------------------*/
function setImageSize(_index){
	var img = element.find('img').eq(_index);
	var _src= img.attr('src');
	var _size = getImageTrueSize(img);
	_size['ratio']  = _size['width'] / _size['height'];
	
	imgInfo[_index]['width'] = _size['width'];
	imgInfo[_index]['height'] = _size['height'];
	imgInfo[_index]['ratio'] = _size['ratio'];
	imgInfo[_index]['loaded'] = true;
	
	checkLoadComplete(_index); //読み込み完了のチェック
}

function getImageTrueSize(image){
	var size = [];
	if(image.prop('naturalWidth')){
		size['width'] = image.prop('naturalWidth');
		size['height'] = image.prop('naturalHeight');
	}else{
		var img = new Image();
		img.src = image.attr('src');
		size['width'] = img.width;
		size['height'] = img.height;
	}
	return size;

}

/*　読み込み完了チェック
----------------------------------------------------------------------*/

 function checkLoadComplete(index){
	 
	 var allLoaded = true;
	 if(index == 0){ //最初の画像が読み込み完了したら動作スタート
		LoadFirstImageComplete();
	 }else{
		 for(var i = 0; i < imgInfo.length; i++){
			 if(!imgInfo[i]['loaded']){
				 allLoaded = false;
				 break;
			 }
		 }
	 }
	 
	 if(allLoaded){
		 loaded = true;
		 LoadComplete();
	 }
	 
 }
 
/*　最初に表示させる画像の読み込み完了
----------------------------------------------------------------------*/
 function LoadFirstImageComplete(){
	 command('loaded');
	 //start();
 }
 
/*　全ての画像の読み込み完了
----------------------------------------------------------------------*/
 function LoadComplete(){
	 
 }