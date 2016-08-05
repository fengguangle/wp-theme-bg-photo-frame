/*=======================================================================
Chanage
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var change = [];

change.getChangeNum = function(val){
	var newNum;
	
	if(isNaN(val)){
		newNum = changeType[val]();
	}else{
		newNum = changeType['num'](val);
	}
	
	return newNum;
};

var changeType = [];
changeType.next = function(){
	var newNum;
	if(current == element.find('li').length - 1){		//一番最後の画像を表示させている場合は最初に戻る
		newNum = 0;
	}else{						//それ以外は次の画像を指定する。
		newNum = parseInt(current) + 1;
	}
	
	return newNum;
};

changeType.prev = function(){
	var newNum;
	if(current == 0){		//一番最後の画像を表示させている場合は最初に戻る
		newNum = element.find('li').length - 1;
	}else{						//それ以外は次の画像を指定する。
		newNum = parseInt(current) - 1;
	}
	return newNum;
};

changeType.current = function(){
	return current;
};

changeType.num = function(val){
	return val;
};
