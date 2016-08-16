/*=======================================================================
/* Resize
=======================================================================*/
/* Params
----------------------------------------------------------------------*/
var resize = [];
var photoAnimeTime = 1000;
var photoAnimeEasing = 'easeOutQuad';


/* Commands
----------------------------------------------------------------------*/
//Attach event
resize.setResizeEvent = function() {
        $(window).resize(function() {
            for (var i = 0; i < element.find('li').length; i++) {
                resizeImages(i);
            }
        });
        for (var i = 0; i < element.find('li').length; i++) {
            resizeImages(i);
        }
    }
    /* Resize event
    ----------------------------------------------------------------------*/




/* Image resize
----------------------------------------------------------------------*/
function resizeImages(_num, animation, force, callback) {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var windowRatio = windowWidth / windowHeight;
    var _li = element.find('li').eq(_num);
    var _img;
    var arrow;

    if (force) {
        arrow = true;
    } else {
        if (_li.css('display') != 'none') {
            arrow = true;
        }
    }

    if (arrow) {
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
            _img.stop(true, false);

            if (currentMode == 'background') {
                if (windowRatio > imgRatio) {
                    imgWidth = windowWidth * setting.width;
                    imgHeight = parseInt(baseHeight * (imgWidth / baseWidth));
                    marginTop = -(imgHeight - windowHeight) / 2;
                    marginLeft = 0;
                } else {
                    imgHeight = windowHeight;
                    imgWidth = parseInt(baseWidth * (imgHeight / baseHeight));
                    marginTop = 0;
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
            imgWidth = parseInt(imgWidth);
            imgHeight = parseInt(imgHeight);
            marginTop = parseInt(marginTop);
            marginLeft = parseInt(marginLeft);

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
                });
            } else {
                _img.width(imgWidth);
                _img.height(imgHeight);
                _img.css({
                    marginTop: marginTop + 'px',
                    marginLeft: marginLeft + 'px'
                });
            }
        }
    }
}

function stopResizeImages() {
    for (var i = 0; i < element.find('li').length; i++) {
        var _li = element.find('li').eq(_num);
        var _img = _li.find('img');
        _img.stop(false, true);
    }
}