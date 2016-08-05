/*=======================================================================
　　Navigation
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var nav;
var prev;
var next;
var navClicked = false;
var navPrefix = prefix + '-nav';

/* Init
----------------------------------------------------------------------*/
function initNav() {
    if (element.find('li').length) {
        //prev
        controls.append('<a class="' + prefix + '-btn ' + navPrefix + '" id="' + navPrefix + '-prev" href="#"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="screen-reader-text">Change the Previous Image</span></a>');

        //next
        controls.append('<a class="' + prefix + '-btn ' + navPrefix + '" id="' + navPrefix + '-next" href="#"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="screen-reader-text">Change the Next Image</span></a>');




        if (device == 'pc') {
            $('.' + navPrefix).click(function() {
                navClick($(this));
                return false;
            });
        } else {
            $('.' + navPrefix).bind('touchstart', function(event) {
                navClick($(this));
                event.preventDefault();
            });
        }





        $(window).resize(function() {
            resizeNav();
        });

        nav = $('.' + navPrefix);
    }
}

/* Click
----------------------------------------------------------------------*/
function navClick(btn) {
    if (btnEnable && nav.hasClass('active')) {
        var btn = btn.attr('id').replace(navPrefix + '-', '');
        command('imgChange', btn);
    }
}



/* Show/Hide
----------------------------------------------------------------------*/
function showNav() {
    nav.stop(false, true);
    nav.fadeIn(fadeTime, function() {
        nav.addClass('active');
    });
    navPosition();
}

function hideNav() {
    nav.removeClass('active');
    nav.stop(false, true);
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
    });
}

/* Init
----------------------------------------------------------------------*/
if (setting.photoFrame) {
    initNav();
}