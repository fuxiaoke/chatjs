/*.con {
    background-color: #eee;
    width: 500px;
    height: 400px;
    position: absolute;
    overflow: hidden;
}
.tar {
     width: 500px;
     position: absolute;
     top: 2;
}
.conbar {
    width: 10px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    right: 5px;
    z-index: 999;
} */
;
(function($) {
    var mDrag = function(setting) {
        if(!(this instanceof mDrag)){
            return new mDrag(setting);
        }        
        this.setting = {
            con: '',
            tar: '',
            isall: true
        }
        var setting = $.extend(true, this.setting, setting);
        console.log(setting.isall+"180");
        if(setting.con !='' || setting.tar !=''){
            alert("You have a mistake in the Object!The right way is--> var mdrag = new mDrag(con,tar,isall) ");
        }else{
            //this.d(setting.con, setting.tar, setting.isall);

        }
    };
    mDrag.prototype = {
        d: function(con, tar, isall) { //isall是开启鼠标滑动
            //alert(tar.css("top"));
            var self = this,
                spagey = 0,
                epagey = 0,
                touchy = 0;
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', function(e) {
                    e = e || window.event;
                    if (isall) {
                        self.drag(con, tar, e);        
                        console.log(setting.con+"180");

                    } else {
                        var target = e.target || e.srcElement;
                        if (target.parentNode.className == con.attr('class')) {
                            self.drag(con, tar, e);
                        } else {
                            return false;
                        }
                    }
                }, true);
            }
            document.onmousewheel = function(e) {
                e = e || window.event;
                if (isall) {
                    self.drag(con, tar, e);
                } else {
                    var target = e.target || e.srcElement;
                    //alert(target.parentNode() + "1");
                    if (target.parentNode.className == con.attr('class')) {
                        self.drag(con, tar, e);
                    } else {
                        return false;
                    }
                }
            };
            $(tar).mousedown(function(e) {
                self.drag(con, tar, e);
            });
            if (!self.isPc()) {
                document.addEventListener('click', function(e) {});
                document.addEventListener('touchstart', function(e) {
                    var e = e || event;
                    e.preventDefault(); //阻止其他事件
                    // 如果这个元素的位置内只有一个手指的话
                    $("<div class='mask'></div>").appendTo($(con));
                    if (e.targetTouches.length == 1) {
                        var ttar = e.targetTouches[0]; // 把元素放在手指所在的位置
                        spagey = ttar.pageY - parseInt($(tar).css("top"));
                        if (e.targetTouches[0].target.className == "opimg") {
                            var targett = e.targetTouches[0].target;
                            //alert($(targett).attr("src"));
                            $("<div class='mmask'></div>").appendTo($('#contain'));
                            $("<div class='bigpic'><img src='" + $(targett).attr("src") + "'/></div>").insertBefore($('.timecon'));
                            $('.bigpic').animate({
                                opacity: 1,
                                top: ($(document).height() - $('.bigpic').height()) / 2,
                            }, function() {
                                if ($(document).width() - $('.bigpic').width() > 100) {
                                    $('.bigpic').animate({
                                        left: ($(document).width() - $('.bigpic').width()) / 2,
                                    });
                                }
                            })
                        };
                        if (e.targetTouches[0].target.className == "mmask") {
                            $('.bigpic').animate({
                                opacity: 0
                            }, function() {
                                $('.mmask').animate({
                                    opacity: 0
                                });
                                $('.mmask').remove();
                                $('.bigpic').remove();
                            })
                        }
                    }
                    // console.log(spagey);
                }, false);
                document.addEventListener('touchmove', function(e) {
                    var e = e || event;
                    e.preventDefault(); //阻止其他事件
                    // 如果这个元素的位置内只有一个手指的话
                    if (e.targetTouches.length == 1) {
                        var ttar = e.targetTouches[0]; // 把元素放在手指所在的位置
                        epagey = ttar.pageY;
                        // console.log(epagey);
                        if (epagey == 0) return false;
                        touchy = parseInt(epagey - spagey);
                        $(tar).css({
                            top: touchy
                        });
                    }
                }, false);
                document.addEventListener('touchend', function(e) {
                    var e = e || event;
                    e.preventDefault(); //阻止其他事件
                    if (parseInt($(tar).css("top")) >= 0) {
                        // console.log(parseInt($(tar).css("top")));
                        $(tar).animate({
                            top: 0
                        }, 600);
                    } else if (parseInt($(tar).css("top")) <= -parseInt($(tar).height() - $(document).height())) {
                        $(tar).animate({
                            top: -parseInt($(tar).height() - $(document).height())
                        }, 600);
                    };
                    $('.mask').remove();
                }, false);
            }
        },
        drag: function(con, tar, e) {
            e = e || window.event;
            var bar = Math.abs(con.height() / tar.height()),
                movec = con.height() - tar.height(),
                ismove = false,
                tmove = false,
                dmove = false;
            if (bar >= 1) {
                return false;
            }
            if (!$("div").hasClass('conbar')) {
                $("<div class='conbar'></div>").appendTo(con);
                $('.conbar').height(Math.abs(con.height() / movec) * 100 - 20);
            }
            var rate = Math.abs(parseInt(con.height() - $('.conbar').height() - 20) / movec);
            $(tar).mousedown(function(e) {
                /* Act on the event */
                //if ($("div").hasClass('mask')) $(".mask").remove();
                //$("<div class='mask'></div>").appendTo($("body"));
                dmove = true;
                _y = e.pageY - parseInt($(tar).css("top"));
            });
            $('.conbar').mousedown(function(e) {
                /* Act on the event */
                if ($("div").hasClass('mask')) $(".mask").remove();
                $("<div class='mask'></div>").appendTo($("body"));
                ismove = true;
                _y = e.pageY - parseInt($(".conbar").css("top") + $(".conbar").css("height"));
            });
            $(document).mousemove(function(e) {
                /* Act on the event */
                if (dmove) {
                    var yy = e.pageY - _y;
                    // console.log(yy);
                    // console.log(yy + "yy");
                    if (yy >= 0) {
                        yy = 0;
                    } else if (yy <= movec) {
                        yy = movec;
                    }
                    if (parseInt(tar.css("top")) <= movec) {
                        // console.log(e.pageY - _y);
                        if (yy <= e.pageY - _y) {
                            tar.css({
                                top: e.pageY - _y
                            });
                        } else {
                            return false;
                        }
                    } else {
                        tar.css({
                            top: yy
                        });
                        $(".conbar").css({
                            top: -yy * rate
                        });
                    }
                }
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
                            top: 0
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
                dmove = false;
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
        },
        isPc: function() {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
    };
    jQuery.extend(mDrag);
    //window['mDrag'] = mDrag;
})(jQuery);