//params
var defaluts = {
    suffle: false, //シャッフルの有無
    //width:'100%',				//画像の幅
    width: 0.8, //画像の幅
    height: 'auto', //画像の高さ
    minHeight: 'none', //画像の最大の高さ
    maxHeight: 'none', //画像の最大の高さ
    autoChange: true, //画像の自動切り替え
    autoTimer: 4000, //画像の自動切り替えのタイマー
    interfaceTimer: true, //インターフェース自動非表示
    fadeSpeed: 1000, //画像の自動切り替えのタイマー
    shuffle: false, //シャッフル
    gradationColor: '0,0,0', //グラデーションカラー
    callbackBefore: null, //コールバック(画像切り替え前)
    callbackAfter: null, //コールバック(画像切り替え後)
    callbackChange: null,
    photoFrame: false, //フォトフレーム機能
    stopWhenClicked: true,
    contents: '',
    maskColor: 'light',
    maskOpacity: 0.7,
    controls: ''



};

//extend params
setting = $.extend(defaluts, setting);

if (this.length) {
    //element
    var element = this;

    //Wrapper
    var wrapper;

    //Controls
    var controls;

    //parent element
    var parent = element.parent();

    //number of images
    var num = element.find('li').length;

    //information of images
    var imgInfo = [];

    //current image
    var current = 0;

    //previous image
    var previous = 0;

    //timer
    var timer = [];

    //device
    var device = userAgent();



    //load		
    var loaded = false;

    //BreakPoint		
    var breakPoint = 782;


    //ButtonFunction
    var btnEnable = true;

    //Whether click or not
    var clicked = false;

    //Whether click or not
    var prefix = 'bg-photo-frame';


    //Easing
    var easing = 'easeOutCubic';


    //Fade time
    var fadeTime = 1000;