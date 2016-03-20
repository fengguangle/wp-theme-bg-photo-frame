/*
 * jQuery Easy Slide Show Fade v1.0.0
 * Copyright 2015 Digistry
 * Contributing Author: Takeshi Kashihara
 */

(function($) {
    $.fn.easySlideshowFade = function(setting) {

        //params
        var defaluts = {
            suffle: false, //シャッフルの有無
            width: '100%', //画像の幅
            height: 'auto', //画像の高さ
            minHeight: 'none', //画像の最大の高さ
            maxHeight: 'none', //画像の最大の高さ
            autoChange: true, //画像の自動切り替え
            autoTimer: 4000, //画像の自動切り替えのタイマー
            fadeSpeed: 1000, //画像の自動切り替えのタイマー
            shuffle: false, //シャッフル
            gradationColor: '0,0,0', //グラデーションカラー
            callbackBefore: null, //コールバック(画像切り替え前)
            callbackAfter: null, //コールバック(画像切り替え後)
            callbackChange: null,
            photoFrame: false, //フォトフレーム機能
            stopWhenClicked: true,
            contents: '', //コンテンツ要素

        };

        //extend params
        setting = $.extend(defaluts, setting);

        if (this.length) {
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


            //Whether click or not
            var easing = 'easeOutCubic';




            /* call back before run
            ----------------------------------------------------------------------*/
            if (setting.callbackBefore) {
                window[setting.callbackBefore].apply()
            }

            if (element.find('li').length) {
                /*add element
                ----------------------------------------------------------------------*/

                element.wrap("<div id='images-wrapper'></div>")
                wrapper = $('#images-wrapper');


                /* setting css
                ----------------------------------------------------------------------*/
                //ul element
                element.css({
                    margin: '0px' //余白をなくす
                        ,
                    padding: '0px'
                })
                wrapper.css({
                    opacity: '1.0'
                })

                if (setting.height != 'auto') {
                    element.css({
                        height: setting.height + 'px' //高さをパラメータの値に指定
                    })
                }

                //list element
                element.find('li').css({
                    position: 'absolute' //ポジションを絶対値に指定して画像を重ねて表示
                        ,
                    listStyle: 'none' //リストスタイルを無しに指定
                        ,
                    display: 'none',
                    overflow: 'hidden'
                })

                element.find('img').css({
                    maxWidth: 'none' //画像の幅をパラメータの値に指定
                })

                //image alement
                if (setting.width == '100%') {
                    element.find('li').css({
                        width: '100%' //画像の幅をパラメータの値に指定
                    })
                    element.find('img').css({
                        width: '100%' //画像の幅をパラメータの値に指定
                    })
                } else if (setting.width != 'auto') {
                    element.find('img').css({
                        width: setting.width + 'px' //画像の幅をパラメータの値に指定
                    })
                }






                /*シャッフル
                ----------------------------------------------------------------------*/
                if (setting.shuffle) {
                    var shuffleElement = element.html().split("</li>")
                    shuffleElement.splice(shuffleElement.length - 1);

                    for (var i = shuffleElement.length - 1; i >= 0; i--) {
                        var r = Math.floor(i * Math.random());
                        var tmp = shuffleElement[i];
                        shuffleElement[i] = shuffleElement[r];
                        shuffleElement[r] = tmp;
                    }

                    element.empty();

                    for (var i = 0; i < shuffleElement.length; i++) {
                        element.append(shuffleElement[i]);
                    }

                }

                /*画像の情報を初期化
                ----------------------------------------------------------------------*/
                for (var i = 0; i < element.find('img').length; i++) {
                    var img = element.find('img').eq(i);
                    var src = img.attr('src');
                    imgInfo.push({
                        loaded: false,
                        src: src,
                        width: 0,
                        height: 0,
                        retio: 0,
                        source: null
                    })
                }
                /*=======================================================================
                /* Window resize
                =======================================================================*/

                /* Params
                ----------------------------------------------------------------------*/
                var photoAnimeTime = 1000;
                var photoAnimeEasing = 'easeOutQuad';

                /* Resize event
                ----------------------------------------------------------------------*/
                //Attach event
                function setResizeEvent() {
                    $(window).resize(function() {
                        for (var i = 0; i < element.find('li').length; i++) {
                            resizeImages(i);
                        }
                    })
                    for (var i = 0; i < element.find('li').length; i++) {
                        resizeImages(i);
                    }
                }



                /* Image resize
                ----------------------------------------------------------------------*/
                function resizeImages(_num, animation, callback) {
                    var windowWidth = $(window).width()
                    var windowHeight = $(window).height();
                    var windowRatio = windowWidth / windowHeight;
                    var _li = element.find('li').eq(_num)
                    var _img;



                    if (_li.css('display') != 'none') {

                        if (_num in imgInfo) {
                            _img = _li.find('img');
                            var imgRatio = imgInfo[_num]['ratio'];
                            var baseWidth = imgInfo[_num]['width'];
                            var baseHeight = imgInfo[_num]['height'];
                            var imgWidth;
                            var imgHeight;

                            var marginTop;
                            var marginLeft;



                            //Stop animation
                            _img.stop(false, true)

                            if (currentMode == 'background') {
                                if (windowRatio > imgRatio) {
                                    imgWidth = windowWidth;
                                    imgHeight = parseInt(baseHeight * (imgWidth / baseWidth));
                                    marginTop = -(imgHeight - windowHeight) / 2
                                    marginLeft = 0
                                } else {
                                    imgHeight = windowHeight;
                                    imgWidth = parseInt(baseWidth * (imgHeight / baseHeight));
                                    marginTop = 0
                                    marginLeft = -(imgWidth - windowWidth) / 2;
                                }
                            } else if (currentMode == 'photoframe') {
                                if (windowRatio >= imgRatio) { //if window is　taller 
                                    imgHeight = windowHeight;
                                    imgWidth = parseInt(baseWidth * (imgHeight / baseHeight));
                                    marginLeft = (windowWidth - imgWidth) / 2;
                                    marginTop = 0;
                                } else { //if window is wider
                                    imgWidth = windowWidth;
                                    imgHeight = parseInt(baseHeight * (imgWidth / baseWidth));
                                    marginLeft = 0;
                                    marginTop = (windowHeight - imgHeight) / 2;
                                }
                            }

                            if (animation) {

                                _img.animate({
                                    width: imgWidth + 'px',
                                    height: imgHeight + 'px',
                                    marginTop: marginTop + 'px',
                                    marginLeft: marginLeft + 'px'
                                }, photoAnimeTime, easing, function() {
                                    if (callback) {
                                        eval(callback + "()");
                                    }

                                })
                            } else {
                                _img.width(imgWidth);
                                _img.height(imgHeight);
                                _img.css({
                                    marginTop: marginTop + 'px',
                                    marginLeft: marginLeft + 'px'
                                })
                            }
                        }
                    }
                }

                function stopResizeImages() {
                    for (var i = 0; i < element.find('li').length; i++) {
                        var _li = element.find('li').eq(_num)
                        var _img = _li.find('img');
                        _img.stop(false, true)
                    }
                }
                /*=======================================================================
                /*読み込み
                =======================================================================*/

                /*　読み込み完了イベントの割り当て
                ----------------------------------------------------------------------*/

                for (var i = 0; i < element.find('img').length; i++) {

                    var img = this.find('img').eq(i);
                    var imgSrc = img.attr('src');
                    var loadImg = $(new Image());
                    loadImg.attr('id', i)
                    loadImg.bind('load', function() {
                        var index = $(this).attr('id');
                        var src = $(this).attr('src');
                        imgInfo[index]['loaded'] = true;
                        setImageSize(index); //画像サイズを取得
                        attachThumbImage(index, src); //サムネール画像の作成
                        checkLoadComplete() //画像が全て読み込まれたかチェック
                    })
                    loadImg.attr('src', imgSrc);
                }

                /*元画像のサイズを取得
                ----------------------------------------------------------------------*/
                function setImageSize(_index) {
                    var img = element.find('img').eq(_index);
                    var _src = img.attr('src');
                    var _size = getImageTrueSize(img);
                    _size['ratio'] = _size['width'] / _size['height'];

                    imgInfo[_index]['width'] = _size['width'];
                    imgInfo[_index]['height'] = _size['height'];
                    imgInfo[_index]['ratio'] = _size['ratio'];
                    imgInfo[_index]['loaded'] = true;

                    checkLoadComplete(_index); //読み込み完了のチェック
                }

                function getImageTrueSize(image) {
                    var size = []
                    if (image.prop('naturalWidth')) {
                        size['width'] = image.prop('naturalWidth')
                        size['height'] = image.prop('naturalHeight')
                    } else {
                        var img = new Image();
                        img.src = image.attr('src');
                        size['width'] = img.width
                        size['height'] = img.height;
                    }
                    return size;

                }

                /*　読み込み完了チェック
                ----------------------------------------------------------------------*/

                function checkLoadComplete(index) {

                    var allLoaded = true;

                    if (index == 0) { //最初の画像が読み込み完了したら動作スタート
                        LoadFirstImageComplete();
                    } else {
                        for (var i = 0; i < imgInfo.length; i++) {
                            if (!imgInfo[i]['loaded']) {
                                allLoaded = false;
                                break;
                            }
                        }
                    }

                    if (allLoaded) {
                        loaded = true;
                        LoadComplete()
                    }

                }

                /*　最初に表示させる画像の読み込み完了
                ----------------------------------------------------------------------*/
                function LoadFirstImageComplete() {
                    start();
                }

                /*　全ての画像の読み込み完了
                ----------------------------------------------------------------------*/
                function LoadComplete() {

                }
                /*=======================================================================
                動作スタート
                =======================================================================*/
                function start() {

                    showFirstImage();
                    setResizeEvent();

                    //最初のタイマーイベントを設定
                    setTimer();
                    if (setting.callbackAfter) {
                        window[setting.callbackAfter].apply()
                    }
                }

                /*1番目以外の画像を非表示にする
                ----------------------------------------------------------------------*/
                function showFirstImage() {

                    for (var i = 0; i < element.find('li').length; i++) {
                        //i番目のリスト要素を取得
                        var li = element.find('li').eq(i);
                        //最初の画像以外は非表示に設定
                        if (i == 0) {
                            li.fadeIn(setting.fadeSpeed)
                            resizeImages(i);
                        } else {
                            li.hide()
                        }
                        //sdsds
                    }
                    element.show();
                }
                /*=======================================================================
                　　Photoframe function
                =======================================================================*/

                var commandProcess = [];

                var interface = false;
                /*Command
                ----------------------------------------------------------------------*/
                function command(sentence, val) {
                    commandProcess[sentence](val);
                }


                commandProcess.modeChange = function() {
                    mode.modeChange();
                    if (currentMode == 'background') {
                        hideInterface()
                        disableTimerInterface()
                    }
                    disableTimer();
                }

                commandProcess.modeChangeEnd = function() {
                    if (currentMode == 'photoframe') {
                        showInterface();
                        enableTimerInterface();
                    } else if ('background') {
                        timerOn();
                    }
                    btnEnable = true;
                    setTimer();
                }

                commandProcess.transitionEnd = function() {
                    setTimer();

                }

                commandProcess.imgChange = function(val) {
                    var newNum = change.getChangeNum(val);
                    transition(newNum);
                    current = newNum;
                }

                commandProcess.timerChange = function() {
                    var newNum = change.getChangeNum('next');
                    transition(newNum);
                    current = newNum;
                }




                /*Show/Hide Interface
                ----------------------------------------------------------------------*/
                var interfaceTimer = [];

                function showInterface() {
                    if (!interface) {
                        showNav();
                        showThumbBtn();
                        showTimer();
                        interface = true;
                    }
                }

                function hideInterface() {
                    if (interface) {
                        hideNav();
                        hideThumbBtn();
                        hideTimer();
                        interface = false;
                    }
                }

                function enableTimerInterface() {
                    $(window).bind('click', function() {
                            showInterface()
                            removeTimerInterface();
                            setTimerInterface();
                        })
                        /*
                        $(window).bind('mousemove', function(){
                        	showInterface()
                        	removeTimerInterface();
                        	setTimerInterface();
                        })
                        */
                    setTimerInterface()
                }

                function setTimerInterface() {
                    interfaceTimer.push(setTimeout(function() {
                        hideInterface()
                    }, setting.autoTimer))
                }


                function disableTimerInterface() {
                    $(window).unbind('click');
                    $(window).unbind('mousemove');
                    removeTimerInterface();

                }

                function removeTimerInterface() {
                    for (var i = 0; i < interfaceTimer.length; i++) {
                        clearTimeout(interfaceTimer[i])
                    }
                    interfaceTimer.length = 0;
                }


                /*=======================================================================
                　　Photoframe function
                =======================================================================*/

                /* params
                ----------------------------------------------------------------------*/
                var contentFadeTime = 500;
                var currentMode = 'background';
                var mode = [];
                /* Change mode
                ----------------------------------------------------------------------*/
                //Toggle
                mode.modeChange = function() {
                    if (btnEnable) {
                        btnEnable = false;
                        stopModeChangeAnimation();
                        if (currentMode == 'background') {
                            photoFrameMode();
                        } else if (currentMode == 'photoframe') {
                            backgroundMode();
                        }
                        command('modeChange')
                    }

                }

                //Photoframe
                function photoFrameMode() {
                    currentMode = "photoframe";
                    hideContents();
                }

                //Background
                function backgroundMode() {
                    currentMode = "background";
                    modeChangeAnimation(mode)
                }



                /*Contents animation
                ----------------------------------------------------------------------*/
                //Show
                function showContents() {
                    $(setting.contents).fadeIn(contentFadeTime, function() {
                        contentsAnimationEnd();
                    });
                }

                //Hide
                function hideContents() {
                    $(setting.contents).fadeOut(contentFadeTime, function() {
                        contentsAnimationEnd()
                    });
                }

                function stopContentsAnimation() {
                    $(setting.contents).stop(false, true)
                }


                //Animation end.
                function contentsAnimationEnd() {
                    //Run resize if mode has photoframe.
                    if (currentMode == "photoframe") {
                        modeChangeAnimation();
                    } else if (currentMode == "background") {
                        command('modeChangeEnd')
                    }
                }


                /* Change Animation
                ----------------------------------------------------------------------*/
                function modeChangeAnimation(mode) {
                    var currentImage = element.find('li').eq(current).find('img');
                    resizeImages(current, true, 'EndModeChangeAnimation');
                }

                function EndModeChangeAnimation() {
                    if (currentMode == "photoframe") {
                        btnEnable = true;
                    } else if (currentMode == "background") {
                        showContents();
                    }
                    changeToggleBtnIcon()
                    command('modeChangeEnd')
                }

                function stopModeChangeAnimation() {
                    stopContentsAnimation()
                }



                /*=======================================================================
                　　Toggle
                =======================================================================*/

                /* Params
                ----------------------------------------------------------------------*/
                var toggleBtnId = prefix + '-toggle';
                var iconClassPhotoFrame = 'glyphicon-picture';
                var iconClassBlog = 'glyphicon-list-alt';

                var toggleButtonSrc = '<a href="#" id="' + toggleBtnId + '" class="' + prefix + '-btn"><span class="glyphicon glyphicon-picture"></span></a>';
                var toggleButton;
                if (setting.photoFrame) {
                    initPhotoFrame();
                }

                /* init
                ----------------------------------------------------------------------*/

                function initPhotoFrame() {

                    $('body').append(toggleButtonSrc)
                    toggleButton = $('#' + toggleBtnId);
                    var toggleEvent;

                    if (device == 'pc') {
                        toggleEvent = 'click';
                    } else {
                        toggleEvent = 'touchstart';
                    }

                    toggleButton.bind(toggleEvent, function() {
                        command('modeChange');
                    })
                }


                /* Icon Change
                ----------------------------------------------------------------------*/
                function changeToggleBtnIcon() {
                    $('#' + toggleBtnId).find('span').removeClass(iconClassPhotoFrame)
                    $('#' + toggleBtnId).find('span').removeClass(iconClassBlog)
                    if (currentMode == 'background') {
                        $('#' + toggleBtnId).find('span').addClass(iconClassPhotoFrame)
                    } else if (currentMode == 'photoframe') {
                        $('#' + toggleBtnId).find('span').addClass(iconClassBlog)

                    }

                }



                /*=======================================================================
                　　Navigation
                =======================================================================*/

                var nav;
                var prev;
                var next;
                var navClicked = false;
                var navPrefix = prefix + '-nav';

                if (setting.photoFrame) {
                    initNav();
                }


                /* Init
                ----------------------------------------------------------------------*/
                function initNav() {
                    if (element.find('li').length > 1) {
                        //prev
                        $('body').append('<a class="' + prefix + '-btn ' + navPrefix + '" id="' + navPrefix + '-prev" href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>');
                        //next
                        $('body').append('<a class="' + prefix + '-btn ' + navPrefix + '" id="' + navPrefix + '-next" href="#"><span class="glyphicon glyphicon-chevron-right"></span></a>');


                        $('.' + navPrefix).click(function() {
                            navClick($(this))
                        })


                        //Resize
                        $(window).resize(function() {
                            resizeNav();
                        })

                        nav = $('.' + navPrefix);
                    }
                }

                /* Click
                ----------------------------------------------------------------------*/
                function navClick(btn) {
                    //次に表示させる画像を設定する
                    var newNum;
                    if (btnEnable && nav.hasClass('active')) {
                        var navBtn = btn.attr('id').replace(navPrefix + '-', '');
                        command('imgChange', navBtn);
                    }
                }



                /* Show/Hide
                ----------------------------------------------------------------------*/
                function showNav() {
                    nav.stop(false, true)
                    nav.fadeIn(1000, function() {
                        nav.addClass('active');
                    });
                    navPosition();
                }

                function hideNav() {
                    nav.removeClass('active');
                    nav.stop(false, true)
                    nav.fadeOut();
                }

                function stopNav() {

                }

                /* Resize
                ----------------------------------------------------------------------*/
                function resizeNav() {
                    navPosition();
                }

                function navPosition() {
                    var left;
                    var top = ($(window).height() - nav.width()) / 2;
                    $('#' + navPrefix + '-prev, #' + navPrefix + '-next').css({
                        top: top + 'px'
                    })
                }
                /*=======================================================================
                Image Thumbnails
                =======================================================================*/
                var thumbPage;
                var thumbBtn;

                var thumbPrefix = prefix + '-thumb';
                var thumbPageClass = thumbPrefix + '-thumbs';
                var thumbBtnClass = thumbPrefix + '-btn';
                var thumbTime = 500;

                /* Init
                ----------------------------------------------------------------------*/
                if (setting.photoFrame) {
                    initThumbs();
                }

                function initThumbs() {
                    //ページ
                    $('body').append('<div id="' + thumbPageClass + '"><div id="' + thumbPageClass + '-inner" class="clearfix"><ul></ul></div></div>');
                    thumbPage = $('#' + thumbPageClass + ' ul');

                    //サムネール
                    for (var i = 0; i < element.find('li').length; i++) {
                        var thumb = '<li class="' + thumbPrefix + '" id="' + prefix + '-thumb-' + i + '"><a href="#' + i + '"></a></li>';
                        thumbPage.append(thumb);
                    }

                    //ボタン
                    $('body').append('<a id="' + thumbBtnClass + '" class="' + prefix + '-btn" href="#"><span class="glyphicon glyphicon-th"></span></a>');
                    thumbBtn = $('#' + thumbBtnClass);

                    //Event
                    var eventName;
                    if (device == 'pc') {
                        eventName = 'click';
                    } else {
                        eventName = 'touchend';
                    }

                    thumbBtn.bind(eventName, function() {
                        toggleThumbBtn();
                    })


                    $('#' + thumbPageClass).bind('click', function() {
                        closeThumbs();
                    })

                }

                function attachThumbImage(num, src) {
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
                    var drawPositonX = (thumbSize - (thumbSize * imgRatio)) / 2;
                    var drawPositonY = 0;
                    ctx.drawImage(thumbImg, drawPositonX, drawPositonY, thumbSize * imgRatio, thumbSize);
                    thumb.append(canvas);

                    //thumb.append(thumbImg);

                    var fixWidth;
                    var fixHeight;
                    var fixMarginTop = 0;
                    var fixMarginLeft = 0;

                    if (imgRatio > 1) { //横長の場合
                        fixHeight = thumbSize
                        fixWidth = imgWidth * (thumbSize / imgHeight);
                        fixMarginLeft = -(fixWidth - thumbSize) / 2;
                    } else {　 //縦長の場合
                        fixWidth = thumbSize
                        fixHeight = imgHeight * (thumbSize / fixWidth);
                        fixMarginTop = -(fixHeight - thumbSize) / 2;
                    }
                    /*
                    thumbImg.css({
                    	width : fixWidth + 'px',
                    	height : fixHeight + 'px',
                    	marginTop : fixMarginTop + 'px',
                    	marginLeft : fixMarginLeft + 'px'
                    })
                    */

                    //Attach Event
                    var eventName;
                    if (device == 'pc') {
                        eventName = 'click';
                    } else {
                        eventName = 'touchstart';
                    }

                    thumb.bind('click', function() {
                        ThumbClick(thumb);
                    })

                }

                /* Resize
                ----------------------------------------------------------------------*/

                $(window).resize(function() {
                    resizeThumbs();
                })
                resizeThumbs()

                function resizeThumbs() {
                    var innerWidth = $(window).width();
                    var innerHeight = $(window).height();
                    var innerPaddingHorizontal = $(window).width() * 0.02;

                    $('#' + thumbPageClass + '-inner').css({
                        width: innerWidth + 'px',
                        //height : innerHeight + 'px',
                        padding: innerPaddingHorizontal + 'px ' + innerPaddingHorizontal + 'px',
                    })


                    //サムネールのサイズを取得
                    var thumbSize = thumbPage.find('li').width();
                    var thumbMargin = removeUnit(thumbPage.find('li').css('margin'));

                    var ulMargin = (
                        $('#' + thumbPageClass + ' ul').width() - (thumbSize + thumbMargin * 2) * parseInt($('#' + thumbPageClass + ' ul').width() / (thumbMargin * 2 + thumbSize))
                    ) / 2

                    $('#' + thumbPageClass + ' ul').css({
                        marginLeft: ulMargin + 'px'
                    })
                }


                /* Button
                ----------------------------------------------------------------------*/
                //Show
                function showThumbBtn() {
                    thumbBtn.stop(false, true)
                    thumbBtn.fadeIn()
                }

                //Hide
                function hideThumbBtn() {
                    thumbBtn.stop(false, true)
                    thumbBtn.fadeOut()
                }

                //サムネールボタンの開閉
                function toggleThumbBtn() {
                    thumbBtn.toggleClass('active')
                    toggleThumbs()
                }


                /* Event of Thumbs
                ----------------------------------------------------------------------*/
                function toggleThumbs() {
                    thumbAnimationStop()
                    if (thumbBtn.hasClass('active')) {
                        openThumbs()
                    } else {
                        closeThumbs()
                    }
                }

                function thumbAnimationStop() {
                    $('#' + thumbPageClass).stop(false, true)
                }

                function openThumbs() {
                    $('#' + thumbPageClass).animate({
                        width: '100%',
                        height: '100%'
                    }, thumbTime, easing)
                }


                function closeThumbs() {
                    $('#' + thumbPageClass).animate({
                        width: '0%',
                        height: '0%'
                    }, thumbTime, easing)
                    thumbBtn.removeClass('active')
                }



                /* Thumbnails
                ----------------------------------------------------------------------*/
                //Event
                function ThumbClick(thumb) {
                    var num = thumb.attr('href').replace('#', '');
                    console.log(num)
                    command('imgChange', num)
                    closeThumbs()
                }
                /*=======================================================================
                Timer Chnage
                =======================================================================*/
                var timer;
                var timerBtn;
                var timerPrefix = prefix + '-timer';
                var timerBtnId = timerPrefix + '-btn'

                initTimer()
                    /* Init
                    ----------------------------------------------------------------------*/

                function initTimer() {
                    if (setting.autoChange && element.find('li').length > 1) {
                        var timerBtnSrc = '<a id="' + timerBtnId + '" class="' + prefix + '-btn" href="#"><span class="glyphicon glyphicon-refresh ' + prefix + '-blur-text"></span><span class="glyphicon glyphicon-refresh"></span></a>';
                        $('body').append(timerBtnSrc);
                        timerBtn = $('#' + timerBtnId);

                        if (setting.autoChange && element.find('li').length > 1) {
                            timerBtn.addClass('on');
                        }

                        //Event
                        var eventName;
                        if (device == 'pc') {
                            eventName = 'click';
                        } else {
                            eventName = 'touchend';
                        }

                        timerBtn.bind(eventName, function() {
                            toggleTimer();
                        })
                    }
                }



                /* Click
                ----------------------------------------------------------------------*/
                function toggleTimer() {
                    timerBtn.toggleClass('on');
                    if (timerBtn.hasClass('on')) {
                        timerOn();
                    } else {
                        timerOff();
                    }
                }


                function timerOn() {
                    timerBtn.addClass('on');
                    setTimer()

                }

                function timerOff() {
                    timerBtn.removeClass('on');
                    disableTimer();
                }



                /* Event
                ----------------------------------------------------------------------*/
                function setTimer() {
                    disableTimer()
                    if (setting.autoChange && timerBtn.hasClass('on') && element.find('li').length > 1) {
                        enableTimer();
                    }
                }

                function enableTimer() {
                    timer.push(setTimeout(function() {
                        timerChange()
                    }, setting.autoTimer))
                }

                function disableTimer() {
                    for (var i = 0; i < timer.length; i++) {
                        clearTimeout(timer[i])
                    }
                    timer.length = 0;
                }



                /* Change
                ----------------------------------------------------------------------*/

                function timerChange() {
                    command('timerChange');
                }


                /* Show/Hide
                ----------------------------------------------------------------------*/
                function showTimer() {
                    timerBtn.stop(false, true)
                    timerBtn.fadeIn();
                    timerBtn.addClass('active');
                }

                function hideTimer() {
                    timerBtn.removeClass('active');
                    timerBtn.stop(false, true)
                    timerBtn.fadeOut();
                }
                // JavaScript Document
                var change = [];

                change.getChangeNum = function(val) {
                    var newNum;

                    if (isNaN(val)) {
                        newNum = changeType[val]()
                    } else {
                        newNum = changeType['num'](val)
                    }
                    return newNum;
                }

                var changeType = [];
                changeType.next = function() {
                    var newNum;
                    if (current == element.find('li').length - 1) { //一番最後の画像を表示させている場合は最初に戻る
                        newNum = 0;
                    } else { //それ以外は次の画像を指定する。
                        newNum = parseInt(current) + 1;
                    }
                    return newNum;
                }

                changeType.prev = function() {
                    var newNum;
                    if (current == 0) { //一番最後の画像を表示させている場合は最初に戻る
                        newNum = element.find('li').length - 1;
                    } else { //それ以外は次の画像を指定する。
                        newNum = parseInt(current) - 1;
                    }
                    return newNum;
                }

                changeType.num = function(val) {
                    return val;
                }

                // JavaScript Document

                transitionMode = 'fade';

                function initTransition() {

                }

                function changeTransitionMode(mode) {
                    transitionMode = mode;
                }


                function transition(num) {
                    transitionStop()
                    if (transitionMode == 'fade') {
                        transitionFade(num)
                    } else if (transitionMode == 'swipe') {
                        transitionSwipe(num)
                    }

                }

                function transitionStop() {
                    if (transitionMode == 'fade') {
                        transitionFadeStop()
                    } else if (transitionMode == 'swipe') {

                    }
                }







                /*=======================================================================
                Image Transition(Fade)
                =======================================================================*/

                function transitionFade(num) {

                    //各画像の表示・非表示
                    var length = element.find('li').length;
                    for (var i = 0; i < length; i++) {
                        //i番目のリスト要素を取得
                        var li = element.find('li').eq(i);
                        if (num == i) { //クリックされたボタンの順番と同一なら画像をフェードで表示
                            if (num != current) {
                                li.fadeIn(setting.fadeSpeed, function() {
                                    transitionFadeEnd()
                                });
                                resizeImages(i);
                            }
                        } else { //そうでなければフェードで非表示
                            li.fadeOut(setting.fadeSpeed);
                        }
                    }
                    transitionFadeEnd()
                }

                function transitionFadeStop() {
                    var length = element.find('li').length;
                    for (var i = 0; i < length; i++) {
                        var li = element.find('li').eq(i);
                        li.stop(false, true)
                    }
                }

                function transitionFadeEnd() {
                    command('transitionEnd');

                }





                /*=======================================================================
                Image Auto change(Fade)
                =======================================================================*/
                function transitionSwipe(num) {

                }


                function transitionSwipeStop() {

                }


                /* 
                ------------------------------------------*/

                function swipeMove() {

                }
                /*=======================================================================
                Utility
                =======================================================================*/
                /* Detect Device
                ----------------------------------------------------------------------*/
                function userAgent() {
                    var a;
                    var ua = navigator.userAgent;

                    if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1 || ua.indexOf("iPod") > -1) a = "ios";
                    else if (ua.indexOf("Android") > -1) a = "android";
                    else a = "pc";
                    return a;
                }

                /* Remove Unit
                ----------------------------------------------------------------------*/
                function removeUnit(val) {
                    return parseInt(val.replace(/([a-z]+)/, ''));
                }
            }
        }
    }
})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */