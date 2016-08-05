/*=======================================================================
/* Dammy
=======================================================================*/

/* params
----------------------------------------------------------------------*/
var dammy = [];
var dammyElement;

/* init
----------------------------------------------------------------------*/
function initDammy() {
    element.after('<ul class="bg-photo-frame-dammy"></ul>');
    dammyElement = $('.bg-photo-frame-dammy');

    dammyElement.css({
        margin: '0px',
        padding: '0px',
        position: 'absolute',
        display: 'block',
        width: '100%'
    });

}

/* command
----------------------------------------------------------------------*/
dammy.setDammy = function(num, direction) {
    dammyElement.find('li').remove();
    var leftMargin, rightMargin;
    leftMargin = -$(window).width();
    rightMargin = $(window).width();
    var wrapperMargin = removeUnit(wrapper.css('marginLeft'));
    num = parseInt(num);
    var leftDammyNum = 1;
    var rightDammyNum = 1;
    var dammyNum;

    if (wrapperMargin > 0) {
        leftDammyNum = Math.floor((wrapperMargin + $(window).width()) / $(window).width()) + 1;
    } else if (wrapperMargin < 0) {
        rightDammyNum = Math.floor(-(wrapperMargin - $(window).width()) / $(window).width()) + 1;
    }


    dammyNum = num;
    if (direction == 'next' || direction == 'current') {

        for (var i = 0; i < leftDammyNum; i++) {
            var leftNum;
            if (dammyNum == 0) {
                leftNum = element.find('li').length - 1;
            } else {
                leftNum = dammyNum - 1;
            }
            dammyShow(leftNum, i, 'left');
            dammyNum = leftNum;
        }
    }

    if (direction == 'prev' || direction == 'current') {
        dammyNum = num;
        for (var i = 0; i < rightDammyNum; i++) {
            var rightNum;
            if (dammyNum == element.find('li').length - 1) {
                rightNum = 0;
            } else {
                rightNum = dammyNum + 1;
            }

            dammyShow(rightNum, i, 'right');
            dammyNum = rightNum;
        }
    }


    dammyElement.css('display', 'block');


};

function dammyShow(num, i, direction) {
    command('setDammy', num);
    var dammyBase = element.find('li').eq(num).find('img');
    var width = dammyBase.width();
    var height = dammyBase.height();
    var marginTop = dammyBase.css('marginTop');
    var wrapperMargin = removeUnit(wrapper.css('marginLeft'));
    var marginLeft;
    if (direction == 'left') {
        marginLeft = -$(window).width() * (i + 1) + ($(window).width() - width) / 2;
    } else if (direction == 'right') {
        marginLeft = $(window).width() * (i + 1) + ($(window).width() - width) / 2;
    }

    var src = dammyBase.attr('src');
    var alt = dammyBase.attr('alt');
    var dammyImg = $('<li><img/></li>');

    dammyImg.find('img').attr('src', src);
    dammyImg.find('img').attr('alt', alt);
    dammyImg.addClass('bg-photo-frame-dammy-list').addClass('bg-photo-frame-dammy-' + direction);
    dammyImg.css({
        width: '100%',
        position: 'absolute',
        listStyle: 'none'
    });

    dammyImg.find('img').css({
        width: width + 'px',
        height: height + 'px',
        marginTop: marginTop,
        marginLeft: marginLeft + 'px'
    });

    dammyElement.append(dammyImg);
}

dammy.removeDammy = function() {
    dammyElement.find('li').remove();
};

initDammy();