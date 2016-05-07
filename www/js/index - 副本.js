;
(function($) {
    var Chat = function() {
        if (!(this instanceof Chat)) {
            return new Chat();
        }
        var self = this;
        this.init();
    };
    Chat.prototype = {
        showMsg: function(user, msg, color, clientType) {
            if (clientType === 0) {
                $('<div class="logmsg cmsg">' + user + msg + '</div>').appendTo($('.chatText'));
                if ($('.logmsg').length == 1) {
                    $('.logmsg').eq(0).css({
                        "width": $('.logmsg')[0].offsetWidth + 40,
                        "color": color,
                        "left": ($('.chatText').width() - $('.logmsg').eq(0).width()) / 2,
                        "top": 10
                    });
                }
                /*$('.logmsg').eq($('.logmsg').length - 1).css({
                    "width": $('.logmsg')[$('.logmsg').length - 1].offsetWidth + 40,
                    "color": color,
                    "left": ($('.chatText').width() - $('.logmsg').eq($('.logmsg').length - 1).width()) / 2
                });
                if ($('.citema').length > 0) {
                    $('.logmsg').eq($('.logmsg').length - 1).css({
                        top: 10 + parseInt($('.citema').eq($('.citema').length - 1).css("top")) + $('.citema').eq($('.citema').length - 1).height()
                    })
                } else if ($('.citemb').length > 0) {
                    $('.logmsg').eq($('.logmsg').length - 1).css({
                        top: 10 + parseInt($('.citemb').eq($('.citemb').length - 1).css("top")) + $('.citemb').eq($('.citemb').length - 1).height()
                    })
                } else {
                    for (var i = 0, max = $('.logmsg').length; i < max; i++) {
                        $('.logmsg').eq(i).css({
                            top: (i) * ($('.logmsg').height() + 10) + 5
                        })
                    }
                }*/
            } else if (clientType === 1) {
                $("<div class='citema cmsg'><div class='tips tipa'>" + user + "</div><br/><div class='csmsg csmsgb'>" + msg + "</div></div>").appendTo($('.chatText'));
                for (var i = 1, max = $('.citema').length; i < max; i++) {
                    $('.citema').eq(i).css({
                        "width": $('.citema')[i].offsetWidth,
                        "color": color,
                        "top": parseInt($('.cmsg').eq(i - 1).css("top")) + $('.cmsg').eq(i - 1).height() + 10
                    });
                }
            } else if (clientType === 2) {
                $("<div class='citemb cmsg'><div class='tips tipb'>" + user + "</div><br/><div class='csmsg csmsgb'>" + msg + "</div></div>").appendTo($('.chatText'));
                if ($('.citemb').length == 1) {
                    $('.citemb').eq(0).css({
                        "width": $('.citemb')[0].offsetWidth,
                        "color": color,
                        "top": parseInt($('.logmsg').eq($('.logmsg').length - 1).css("top")) + $('.logmsg').eq($('.logmsg').length - 1).height() + 10
                    });
                }
                for (var i = 1, max = $('.citemb').length; i < max; i++) {
                    $('.citemb').eq(i).css({
                        "width": $('.citemb')[i].offsetWidth,
                        "color": color,
                        "top": parseInt($('.citemb').eq(i - 1).css("top")) + $('.citemb').eq(i - 1).height() + 10
                    });
                }
            }
            $('.cstext').val('').focus();
            $('.chatText').scrollTop($('.chatText').prop("scrollHeight"));
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
                    $('.chatArea').animate({
                        opacity: 1
                    })
                    $('.cstext').focus();
                    $(document).keypress(function(e) {
                        if (e.which == 13) {
                            if ($.trim($('.cstext').val()).length != 0) {
                                self.socket.emit('postMsg', $.trim($('.cstext').val()));
                                self.showMsg(myName, $.trim($('.cstext').val()), "#fff", 1);
                                $('.showname').remove();
                            } else {
                                $('.cstext').focus();
                            }
                        }
                    });
                    $('.sending').bind('click', function() {
                        if ($.trim($('.cstext').val()).length != 0) {
                            self.socket.emit('postMsg', $.trim($('.cstext').val()));
                            self.showMsg(myName, $.trim($('.cstext').val()), "#fff", 1);
                            $('.showname').remove();
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
                            return;
                        }
                    }
                } else {
                    $("<div class='listitem'>" + nickName + "</div>").appendTo($('.lists'));
                    $('.list').html('List(' + userCount + ')');
                    for (var i = 0; i < userCount; i++) {
                        $('.listitem').eq(i).animate({
                            top: (i + 1) * $('.listitem').height() + 10
                        })
                    }
                }
            });
            this.socket.on('newMsg', function(user, msg) {
                self.showMsg(user, msg, "#fff", 2);
            });
        }
    };
    window['Chat'] = Chat;
})(jQuery);