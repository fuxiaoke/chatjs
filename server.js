var express = require('express'), //引入express模块  
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [],
    usersId = [],
    num = 1;
app.use('/', express.static(__dirname + '/www')); //指定静态HTML文件的位置  
server.listen(8082);
io.on('connection', function(socket) {
    //昵称设置  
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.nickname = nickname;
            users.push(nickname);
            usersId[users[users.length - 1]] = socket.id;
            console.log(usersId);
            socket.emit('loginSuccess', users);
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    socket.on('disconnect', function() {
        if (!!!socket.nickname) return;
        for (var i = 0, max = users.length; i < max; i++) {
            if (users[i] === socket.nickname) {
                for (var index in usersId) {
                    if (index === users[i]) {
                        delete usersId[index];
                    }
                }
                users.splice(i, 1);
                socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
            }
        }
    });
    socket.on('postMsg', function(msg) {
        var reg = /\s*@+(\w+|[\u4e00-\u9fa5]+)\s*/gm,
            s = /(\S+|[\u4e00-\u9fa5]+)/g,
            noa = /([^@]+)/g;
        console.log(msg + "\t0");
        if (reg.test(msg)) {
            console.log(msg + "\t1");
            var puser = msg.match(reg);
            console.log(puser);
            if (puser.length == 1) {
                console.log(msg + "\t2");
                var p = (puser[0].match(s))[0].match(noa);
                console.log(p[0] + "\t" + io.sockets.connected[usersId[users[i]]]);
                for (var i = 0, max = users.length; i < max; i++) {
                    if (p[0] === users[i]) {
                        console.log(msg + "\t3");
                        console.log(p[0] + "\t" + usersId[users[i]]);
                        io.sockets.connected[usersId[users[i]]].emit('newMsg', socket.nickname, msg);
                    }
                }
            } else {
                console.log(msg + "\t4");
                for (var k = 0, m = puser.length; k < m; k++) {
                    for (var i = 0, max = users.length; i < max; i++) {
                        if (users[i] === (puser[k].match(s))[0].match(noa)[0]) {
                            console.log((puser[k].match(s))[0].match(noa)[0]);
                            io.sockets.connected[usersId[users[i]]].emit('newMsg', socket.nickname, msg);
                        }
                    }
                }
            }
            console.log(msg + "\t5");
        } else {
            socket.broadcast.emit('newMsg', socket.nickname, msg);
        }
    });
});