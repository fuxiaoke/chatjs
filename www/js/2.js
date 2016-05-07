/*
.con {
    background-color: #eee;
    width: 500px;
    height: 400px;
    position: absolute;
    overflow: hidden;
}

.tar {
    width: 500px;
    position: absolute;
    top: 1;
}

.conbar {
    width: 10px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    right: 5px;
    z-index: 999;
}
 */
function dd(con, tar) {
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (target.parentNode.className == con.attr('class') || target.className == con.attr('class')) {
                drag(con, tar, e);
            } else {
                return false;
            }
        }, false);
    }
    document.onmousewheel = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        console.log(target.className == con.attr('class'));
        if (target.parentNode.className == con.attr('class') || target.className == con.attr('class')) {
            drag(con, tar, e);
            console.log(tar.height());
        } else {
            return false;
        }
    }; //IE/Opera/Chrome/Safari
    function drag(con, tar, e) {
        e = e || window.event;
        var bar = Math.abs(con.height() / tar.height()),
            movec = con.height() - tar.height(),
            ismove = false;
        if (bar >= 1) {
            return false;
        }
        if (!$("div").hasClass('conbar')) {
            $("<div class='conbar'></div>").appendTo(con);
            $('.conbar').height(Math.abs(con.height() / movec) * 100 - 20);
        }
        var rate = Math.abs(parseInt(con.height() - $('.conbar').height() - 20) / movec);
        $('.conbar').mousedown(function(e) {
            /* Act on the event */
            if ($("div").hasClass('mask')) $(".mask").remove();
            $("<div class='mask'></div>").appendTo($("body"));
            ismove = true;
            _y = e.pageY - parseInt($(".conbar").css("top") + $(".conbar").css("height"));
        });
        $(document).mousemove(function(e) {
            /* Act on the event */
            if (ismove) {
                var yy = e.pageY - _y;
                $(".conbar").css({
                    top: yy
                });
                tar.css({
                    top: -yy / rate
                });
                if (parseInt(tar.css("top")) >= 0) {
                    tar.css({
                        top: 1
                    });
                    $('.conbar').css({
                        top: 30
                    });
                } else if (parseInt(tar.css("top")) <= movec) {
                    tar.css({
                        top: movec
                    });
                    $('.conbar').css({
                        top: con.height() - parseInt($('.conbar').css("height")) - 20
                    });
                }
            }
        }).mouseup(function() {
            ismove = false;
            if ($("div").hasClass('mask')) $(".mask").remove();
        });
        if (e.wheelDelta) { //IE/Opera/Chrome
            var y = parseInt(tar.css("top"));
            if (e.wheelDelta < 0) {
                if (y <= movec) {
                    y = movec;
                } else {
                    y += e.wheelDelta / 2;
                }
            } else {
                if (y <= 0) y += e.wheelDelta / 2;
                else {
                    y = 0;
                }
            }
            tar.css({
                "top": y
            });
            $('.conbar').css({
                "top": -y * rate
            });
        } else if (e.detail) { //Firefox
            var y = parseInt(tar.css("top"));
            if (e.wheelDelta < 0) {
                if (y >= movec) {
                    y = movec;
                } else {
                    y += e.wheelDelta / 2;
                }
            } else {
                if (y <= 0) y += e.wheelDelta / 2;
                else {
                    y = 0;
                }
            }
            tar.css({
                "top": e.detail - y
            });
        };
        if (parseInt(tar.css("top")) <= movec) {
            tar.css({
                "top": movec
            });
        } else if (parseInt(tar.css("top")) >= 0) {
            tar.css({
                "top": 0
            });
            $(".conbar").css({
                "top": 30
            })
        };
        if (e.preventDefault) { /*FF 和 Chrome*/
            e.preventDefault(); // 阻止默认事件
        }
        return false;
    };
};