;
(function($) {
    var Chat = function() {
        if (!(this instanceof Chat)) {
            return new Chat();
        }
        var self = this;
        this.init();
        if ($(window).width() < 500) {
            $('.chatArea').width($(window).width());
        }
        $(window).resize(function() {
            console.log(1);
            $('.showname').animate({
                left: ($(window).width() - $('.showname').width()) / 2,
                top: ($(window).height() - $('.showname').height()) / 2
            })
            if ($(window).width() < 500) {
                $('.chatArea').width($(window).width());
            }else{
                 $('.chatArea').width(800);
            }
        })
    };
    Chat.prototype = {
        showMsg: function(user, msg, color, clientType) {
            if (clientType === 0) {
                $('<div class="logmsg cmsg">' + user + msg + '</div>').appendTo($('.chatText'));
                if ($('.logmsg').length == 1) {
                    $('.logmsg').eq(0).css({
                        "top": 10
                    });
                }
                for (var i = 0, max = $('.logmsg').length; i < max; i++) {
                    $('.logmsg').eq(i).css({
                        //"width": $('.logmsg').eq(i)[0].offsetWidth +40,
                        "color": color,
                        "left": ($('.chatText').width() - $('.logmsg').width()) / 2,
                    });
                }
            } else if (clientType === 1) {
                $("<div class='citema cmsg'><div class='tips tipa'>" + user + "</div><br/><div class='csmsg csmsgb'>" + msg + "</div></div>").appendTo($('.chatText'));
                for (var i = 0, max = $('.citema').length; i < max; i++) {
                    $('.citema').eq(i).css({
                        //"width": $('.citema')[0].offsetWidth,
                        "color": color,
                    });
                }
            } else if (clientType === 2) {
                $("<div class='citemb cmsg'><div class='tips tipb'>" + user + "</div><br/><div class='csmsg csmsgb'>" + msg + "</div></div>").appendTo($('.chatText'));
                for (var i = 0, max = $('.citemb').length; i < max; i++) {
                    $('.citemb').eq(i).css({
                        "width": $('.citemb').eq(i)[0].offsetWidth,
                        "color": color,
                    });
                }
            }
            for (var i = 1, max = $('.cmsg').length; i < max; i++) {
                $('.cmsg').eq(i).css({
                    top: parseInt($('.cmsg').eq(i - 1).css("top")) + $('.cmsg').eq(i - 1).height() + 10
                })
            }
            $('.cstext').val('').focus();
            $('.chatText').height($('.chatText').prop("scrollHeight"));
            console.log($('.chatText').scrollTop());
            console.log($('.chatText').prop("scrollHeight"));
        },
        login: function() {
            var self = this;
            var nickName = $('.cname').val();
            if ($.trim(nickName).length != 0) {
                console.log(nickName);
                self.socket.emit('login', nickName);
            } else {
                $('.cname').focus();
            };
        },
        init: function() {
            var self = this;
            this.socket = io.connect();
            $(document).keypress(function(e) {
                if (e.which == 13) {
                    self.login();
                }
            });
            this.socket.on('connect', function() {
                if ($('.showname').length <= 0) {
                    $("<div class='showname'><div class='ctips'><span>Welcome</span></div><input type='text' placeholder='请输入你的昵称' name='cname' class='cname'><div class='surec'>确定</div></div>").appendTo($('#container'));
                }
                $('.showname').css({
                    left: ($(window).width() - $('.showname').width()) / 2
                }).animate({
                    top: ($(window).height() - $('.showname').height()) / 2
                })
                $('.cname').focus();
                $('.surec').bind('click', function() {
                    self.login();
                })
            })
            this.socket.on('nickExisted', function() {
                $('.ctips span').css({
                    "borderBottom": "2px solid red"
                }).html('昵称已被占用');
                $('.cname').focus();
            });
            this.socket.on('loginSuccess', function(users) {
                var myName = $('.cname').val();
                document.title = "chatjs ||" + myName;
                console.log("users" + users);
                $('.listitem').remove();
                for (var i = 0; i < users.length - 1; i++) {
                    $("<div class='listitem'>" + users[i] + "</div>").appendTo($('.lists'));
                    console.log($('.listitem').eq(i).html());
                }
                $('.showname').html('<div class="wel">欢迎你' + $('.cname').val() + '</div>').delay(500).animate({
                    "top": -$(window).height()
                }, function() {
                    $('.showname').remove();
                    $('.chatArea').animate({
                        opacity: 1
                    })
                    $('.cstext').focus();
                    $(document).keypress(function(e) {
                        if (e.which == 13) {
                            if ($.trim($('.cstext').val()).length != 0) {
                                self.socket.emit('postMsg', $.trim($('.cstext').val()));
                                self.showMsg(myName, $.trim($('.cstext').val()), "#fff", 1);
                                e.preventDefault();
                            } else {
                                $('.cstext').focus();
                            }
                        }
                    });
                    $('.sending').bind('click', function() {
                        if ($.trim($('.cstext').val()).length != 0) {
                            self.socket.emit('postMsg', $('.cstext').val());
                            self.showMsg(myName, $.trim($('.cstext').val()), "#fff", 1);
                            $('.cstext').val($('.cstext').val().match(/(\S*)/gm)).focus();
                        } else {
                            $('.cstext').focus();
                        }
                    })
                })
            });
            this.socket.on('system', function(nickName, userCount, type) {
                if (nickName == null) return;
                //var msg = nickName + (type == 'login' ? ' joined' : ' left');
                self.showMsg(nickName, (type == 'login' ? ' joined' : ' left'), "rgb(4,221,152)", 0);
                //$('.chatText').append($('<div class="logmsg">' + msg + '</div>'));
                if (type == 'logout') {
                    for (var i = 0; i < $('.listitem').length; i++) {
                        if ($('.listitem').eq(i).html() == nickName) {
                            $('.listitem').eq(i).animate({
                                opacity: 0
                            }, function() {
                                for (var j = i; j < $('.listitem').length; j++) {
                                    $('.listitem').eq(j).animate({
                                        top: (j) * $('.listitem').height() + 10
                                    })
                                }
                                $('.listitem').eq(i).remove();
                            });
                            break;
                        }
                    }
                } else {
                    $("<div class='listitem'>" + nickName + "</div>").appendTo($('.lists'));
                    //加上@功能
                    $('.listitem').bind('click', function() {
                        var _this = this;
                        var csval = $('.cstext').val() + '@' + $(_this).html() + ' ';
                        console.log(csval);
                        $('.cstext').val(csval);
                        $('.cstext').focus();
                    })
                    for (var i = 0; i < userCount; i++) {
                        $('.listitem').eq(i).animate({
                            top: (i + 1) * ($('.listitem').height() + 10)
                        })
                    }
                }
                $('.list').html('List(' + userCount + ')');
                console.log(userCount + "count");
            });
            this.socket.on('newMsg', function(user, msg) {
                self.showMsg(user, msg, "#fff", 2);
            });
        },
        d: function(con, tar, isall) {
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
    window['Chat'] = Chat;
})(jQuery);