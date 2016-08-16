/*=======================================================================
/* Transition
=======================================================================*/

/* params
----------------------------------------------------------------------*/
transition = [];
transitionMode = 'fade';

/* init
----------------------------------------------------------------------*/
function initTransition() {

}

/* command
----------------------------------------------------------------------*/

/*1番目以外の画像を非表示にする
----------------------------------------------------------------------*/
transition.showFirstImage = function() {

    for (var i = 0; i < element.find('li').length; i++) {
        //i番目のリスト要素を取得
        var li = element.find('li').eq(i);
        //最初の画像以外は非表示に設定
        if (i == 0) {
            li.fadeIn(setting.fadeSpeed);
            resizeImages(i);
        } else {
            li.hide();
        }
        //sdsds
    }
    element.show();
}


transition.transition = function(num, transitionMode, direction) {
    transitionStop();
    if (transitionMode == 'fade') {
        fade.transitionFade(num);
    } else if (transitionMode == 'swipe') {
        swipe.transitionSwipe(num, direction);
    }

}


/* functions
----------------------------------------------------------------------*/

function changeTransitionMode(mode) {
    transitionMode = mode;
}



function transitionStop() {
    if (transitionMode == 'fade') {
        transitionFadeStop();
    } else if (transitionMode == 'swipe') {

    }
}