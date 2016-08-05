/*=======================================================================
Timer
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var timer = [];
var timerArr = [];
var timerBtn;
var timerPrefix = prefix + '-timer';
var timerBtnId = timerPrefix + '-btn';




/* Init
----------------------------------------------------------------------*/

function initTimer() {
    if (setting.autoChange && element.find('li').length) {
        var timerBtnSrc = '<a id="' + timerBtnId + '" class="' + prefix + '-btn" href="#"><span class="glyphicon glyphicon-refresh ' + prefix + '-blur-text" aria-hidden="true"></span><span class="screen-reader-text">Disable Auto Change Images</span><span class="glyphicon glyphicon-refresh ' + prefix + '-text" aria-hidden="true"></span></a>';
        controls.append(timerBtnSrc);
        timerBtn = $('#' + timerBtnId);

        if (setting.autoChange && element.find('li').length) {
            timerBtn.addClass('on');
        }

        //Event
        if (device == 'pc') {
            timerBtn.click(function() {
                toggleTimer();
                return false;
            });
        } else {
            timerBtn.bind('touchend', function(event) {
                toggleTimer();
                event.preventDefault();
            });
        }
    }
}

initTimer();


/* Command
----------------------------------------------------------------------*/
timer.setTimer = function(num, direction) {
    timer.disableTimer();
    if (setting.autoChange && timerBtn.hasClass('on') && element.find('li').length) {
        enableTimer();
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
    timer.setTimer();
    $('#' + timerBtnId).find('span.screen-reader-text').html('Disable Auto Change Images')

}

function timerOff() {
    timerBtn.removeClass('on');
    timer.disableTimer();
    $('#' + timerBtnId).find('span.screen-reader-text').html('Enable Auto Change Images')
}



/* Event
----------------------------------------------------------------------*/

function enableTimer() {
    timerArr.push(setTimeout(function() {
        timerChange();
    }, setting.autoTimer));
}

timer.disableTimer = function() {
    for (var i = 0; i < timerArr.length; i++) {
        clearTimeout(timerArr[i]);
    }
    timerArr.length = 0;
}



/* Change
----------------------------------------------------------------------*/
function timerChange() {
    command('timerChange');
}


/* Show/Hide
----------------------------------------------------------------------*/
function showTimer() {
    timerBtn.stop(false, true);
    timerBtn.fadeIn();
    timerBtn.addClass('active');
}

function hideTimer() {
    timerBtn.removeClass('active');
    timerBtn.stop(false, true);
    timerBtn.fadeOut();
}