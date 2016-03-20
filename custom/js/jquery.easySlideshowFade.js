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

            //mode
            var mode = 'background';

            //load		
            var loaded = false;

            //BreakPoint		
            var breakPoint = 782;


            //ButtonFunction
            var btnEnable = true;

            //Whether click or not
            var clicked = false;




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

                            if (mode == 'background') {
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
                            } else if (mode == 'photoframe') {
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
                                }, photoAnimeTime, photoAnimeEasing, function() {
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
                        _img.stop(true, false);
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
                        imgInfo[index]['loaded'] = true;
                        setImageSize(index); //画像サイズを取得
                        checkLoadComplete() //画像が全て読み込まれたかチェック
                    })
                    loadImg.attr('src', imgSrc);


                    /*
	
                     _img.bind("load", function(){
                    	 var index = element.find('img').index(this);
                    	 imgInfo[index]['loaded'] = true;
                    	 setImageSize(index); //画像サイズを取得
                    	 
                    	 
                    	 
                    	 checkLoadComplete()  //画像が全て読み込まれたかチェック
                     }) 
                     */
                }

                /*元画像のサイズを取得
                ----------------------------------------------------------------------*/
                function setImageSize(_index) {
                    var img = element.find('img').eq(_index);
                    var _src = img.attr('src');
                    var source = $('<img>');
                    source.attr('src', _src + "?" + new Date().getTime());
                    source.attr('alt', _index);
                    source.load(function() {
                        var num = $(this).attr('alt');
                        imgInfo[num]['source'] = source
                            //onLoad(num);
                        var _size = getImageTrueSize(imgInfo[num]['source']);
                        _size['ratio'] = _size['width'] / _size['height'];
                        imgInfo[_index]['width'] = _size['width'];
                        imgInfo[_index]['height'] = _size['height'];
                        imgInfo[_index]['ratio'] = _size['ratio'];
                        imgInfo[_index]['loaded'] = true;

                        checkLoadComplete(); //読み込み完了のチェック
                        if (_index == 0) { //最初の画像が読み込み完了したら動作スタート
                            LoadFirstImageComplete();

                        }

                    })
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

                function checkLoadComplete() {

                    var allLoaded = true;
                    for (var i = 0; i < imgInfo.length; i++) {
                        if (!imgInfo[i]['loaded']) {
                            allLoaded = false;
                            break;
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
                    setTimerEvent();
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
                Timer Chnage
                =======================================================================*/

                function setTimerEvent() {
                    if (setting.autoChange && element.find('li').length > 1) {
                        timer.push(setTimeout(function() {
                            timerChange()
                        }, setting.autoTimer))
                    }
                }


                function timerChange() {
                    //次に表示させる画像を設定する
                    var newNum;
                    var length = element.find('li').length;
                    if (current >= length - 1) { //一番最後の画像を表示させている場合は最初に戻る
                        newNum = 0;
                    } else { //それ以外は次の画像を指定する。
                        newNum = current + 1;
                    }
                    //current = newNum	//現在表示させている画像を代入
                    transition(newNum, true);
                }


                function pauseTimerChange() {
                    for (var i = 0; i < timer.length; i++) {
                        clearTimeout(timer[i])
                    }
                    timer.length = 0;
                }


                function restartTimerChange() {
                    if (setting.stopWhenClicked) {
                        if (!navClicked) { //ボタンをクリックしていなかったらタイマーイベントを再度設定
                            pauseTimerChange()
                            timer.push(setTimeout(function() {
                                timerChange()
                            }, setting.autoTimer))
                        }
                    } else {
                        pauseTimerChange()
                        timer.push(setTimeout(function() {
                            timerChange()
                        }, setting.autoTimer))
                    }
                }




                /*=======================================================================
                　　Photoframe function
                =======================================================================*/


                var toggleBtnId = 'photoframe-toggle';
                var iconClassPhotoFrame = 'glyphicon-picture';
                var iconClassBlog = 'glyphicon-list-alt';
                /* Params
                /* Params
                ----------------------------------------------------------------------*/
                var toggleButtonSrc = '<a href="#" id="' + toggleBtnId + '"><span class="glyphicon glyphicon-picture"></span></a>';
                var toggleButton;
                if (setting.photoFrame) {
                    initPhotoFrame();
                }

                var contentFadeTime = 500;



                /* Icon
                ----------------------------------------------------------------------*/
                function changeToggleBtnIcon() {
                    $('#' + toggleBtnId).find('span').removeClass(iconClassPhotoFrame)
                    $('#' + toggleBtnId).find('span').removeClass(iconClassBlog)
                    if (mode == 'background') {
                        $('#' + toggleBtnId).find('span').addClass(iconClassPhotoFrame)
                    } else if (mode == 'photoframe') {
                        $('#' + toggleBtnId).find('span').addClass(iconClassBlog)

                    }

                }

                /* init
                ----------------------------------------------------------------------*/

                function initPhotoFrame() {

                    $('body').append(toggleButtonSrc)

                    toggleButton = $('#photoframe-toggle');
                    var toggleEvent;

                    if (device == 'pc') {
                        toggleEvent = 'click';
                    } else {
                        toggleEvent = 'touchstart';
                    }

                    toggleButton.bind(toggleEvent, function() {
                        togglePhotoFrame();
                    })
                }

                /* Change mode
                ----------------------------------------------------------------------*/
                //Toggle
                function togglePhotoFrame() {
                    if (btnEnable) {
                        btnEnable = false;
                        pauseTimerChange();
                        stopModeChangeAnimation();
                        if (mode == 'background') {
                            photoFrameMode();
                        } else if (mode == 'photoframe') {
                            backgroundMode();
                        }

                    }
                }

                //Photoframe
                function photoFrameMode() {
                    mode = "photoframe";
                    hideContents();
                }

                //Background
                function backgroundMode() {

                    mode = "background";
                    hideNav();
                    modeChangeAnimation(mode)
                }

                function modeChangeAnimation(mode) {
                    var currentImage = element.find('li').eq(current).find('img');
                    resizeImages(current, true, 'EndModeChangeAnimation');
                }

                function EndModeChangeAnimation() {
                    if (mode == "photoframe") {
                        btnEnable = true;
                        showNav();
                        //setTimerEvent();
                    } else if (mode == "background") {
                        showContents();
                    }
                    changeToggleBtnIcon()

                }

                function stopModeChangeAnimation() {
                    stopContentsAnimation()
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
                    $(setting.contents).stop(true, false)
                }


                //Animation end.
                function contentsAnimationEnd() {
                    //Run resize if mode has photoframe.
                    if (mode == "photoframe") {
                        modeChangeAnimation();
                    } else if (mode == "background") {
                        setTimerEvent();
                        btnEnable = true;
                    }
                }





                /*=======================================================================
                　　Navigation
                =======================================================================*/

                var nav;
                var prev;
                var next;
                var navClicked = false;

                if (setting.photoFrame) {
                    initNav();
                }


                /* Init
                ----------------------------------------------------------------------*/
                function initNav() {
                    if (element.find('li').length > 1) {
                        $('body').append('<ul id="photoframe-nav"></ul>')
                        nav = $('#photoframe-nav');
                        //prev
                        nav.append('<li class="photoframe-nav-btn" id="photoframe-nav-prev"><a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a></li>');

                        for (var i = 0; i < element.find('li').length; i++) {
                            var navBtn = '<li class="photoframe-nav-btn photoframe-nav-num" id="photoframe-nav-' + i + '"><a href="#"></a></li>';
                            nav.append(navBtn);
                        }
                        //next
                        nav.append('<li class="photoframe-nav-btn" id="photoframe-nav-next"><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></li>');


                        $('.photoframe-nav-btn').click(function() {
                            navClick($(this))
                        })


                        //Resize
                        $(window).resize(function() {
                            resizeNav();
                        })
                    }
                }

                /* Click
                ----------------------------------------------------------------------*/
                function navClick(btn) {
                    //次に表示させる画像を設定する
                    var newNum;
                    if (btnEnable) {
                        if (btn.attr('id').match('prev')) {
                            if (current == 0) { //一番最後の画像を表示させている場合は最初に戻る
                                newNum = element.find('li').length - 1;
                            } else { //それ以外は次の画像を指定する。
                                newNum = current - 1;
                            }
                        } else if (btn.attr('id').match('next')) {
                            if (current == element.find('li').length - 1) { //一番最後の画像を表示させている場合は最初に戻る
                                newNum = 0;
                            } else { //それ以外は次の画像を指定する。
                                newNum = current + 1;
                            }
                        } else {
                            newNum = parseInt(btn.attr('id').replace('photoframe-nav-', ''));
                            //$('.photoframe-nav-btn').index(btn)
                        }
                        navClicked = true;
                        transition(newNum);
                    }

                }



                /* Show/Hide
                ----------------------------------------------------------------------*/
                function showNav() {
                    nav.fadeIn();
                    navPosition();
                    appearNav(current)
                }

                function hideNav() {
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
                    var top;
                    if (breakPoint <= $(window).width()) { //PC表示
                        left = ($(window).width() - nav.width()) / 2;
                        top = $(window).height() - $('.photoframe-nav-btn').height() - 10;
                        nav.css({
                            top: top + 'px',
                            left: left + 'px'
                        })

                        $('#photoframe-nav-prev').css({
                            position: 'relative',
                            left: 'auto'
                        })

                        $('#photoframe-nav-next').css({
                            position: 'relative',
                            right: 'auto'
                        })
                    } else { //スマホ表示

                        top = ($(window).height() - $('.photoframe-nav-btn a').width()) / 2;
                        nav.css({
                            top: top + 'px',
                            left: 'auto'
                        })

                        $('#photoframe-nav-prev').css({
                            position: 'fixed',
                            left: '10px'
                        })

                        $('#photoframe-nav-next').css({
                            position: 'fixed',
                            right: 0
                        })


                    }

                }


                /* Appearance
                ----------------------------------------------------------------------*/
                function appearNav(num) {
                    $('.photoframe-nav-btn').removeClass('current');
                    if (nav.css('display') != "none") {
                        $('#photoframe-nav-' + num).addClass('current');
                    }
                }
                // JavaScript Document

                transitionMode = 'fade';

                function initChangeMode() {
                    if (setting.photoFrame) {
                        $(window).resize(function() {
                            resizeChangeMode()
                        })
                    }
                }

                function resizeChangeMode() {

                }

                function chnageTransitionMode(mode) {
                    transitionMode = mode;
                }


                function transition(num, restart) {
                    transitionStop()
                    if (transitionMode == 'fade') {
                        transitionFade(num, restart)
                    } else if (transitionMode == 'swipe') {
                        transitionSwipe(num, restart)
                    }
                    current = num;

                    appearNav(num)

                }

                function transitionStop() {
                    transitionFadeStop()
                }




                /*=======================================================================
                Image Transition(Fade)
                =======================================================================*/

                function transitionFade(num, restart) {

                    //各画像の表示・非表示
                    var length = element.find('li').length;
                    for (var i = 0; i < length; i++) {
                        //i番目のリスト要素を取得
                        var li = element.find('li').eq(i);
                        if (num == i) { //クリックされたボタンの順番と同一なら画像をフェードで表示
                            if (num != current) {
                                li.fadeIn(setting.fadeSpeed, function() {
                                    transitionFadeEnd(restart)
                                });
                                resizeImages(i);
                            }

                        } else { //そうでなければフェードで非表示
                            li.fadeOut(setting.fadeSpeed);
                        }
                    }
                    //再度タイマーイベントを設定。
                    //ボタンがクリックされたら自動切り替えをストップする場合には
                    //ボタンがクリックされた場合は設定しない。


                }

                function transitionFadeStop() {
                    var length = element.find('li').length;
                    for (var i = 0; i < length; i++) {
                        var li = element.find('li').eq(i);
                        li.stop(true, true, false);
                    }
                }

                function transitionFadeEnd(restart) {
                    if (restart) {
                        restartTimerChange()
                    }
                }





                /*=======================================================================
                Image Auto change(Fade)
                =======================================================================*/
                function transitionSwipe(num) {

                }


                function transitionSwipeStop() {

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