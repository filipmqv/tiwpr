module.exports = function(server){
    var socketio = require('socket.io')(server);
    var sockets = {};
    var rooms = {};

    socketio.sockets.on('connection', function(socket) {
        // if there's no cookie and no userId in cookie - disconnect
        var cookieString = socket.request.headers.cookie;
        if (!cookieString) {
            socket.disconnect();
            return;
        }
        var index = cookieString.indexOf('userId') + 7;
        if (index < 0) {
            socket.disconnect();
            return;
        }
        var userId = cookieString.substr(index, index+18);
        var userRoomName = '';
        var userName = '';

        console.log('connected ' + userId + '   ' + cookieString);

        if (!sockets[userId]) { 
            // if user is first time
            sockets[userId] = {};
        }
        sockets[userId].socket = socket;

        socket.emit('connection reply');

        socket.on('room and dimensions', function (data) {
            userRoomName = data.roomName;
            userName = data.userName;
            if (!rooms[userRoomName]) { 
                // if such room doesn't exist
                rooms[userRoomName] = {};
                rooms[userRoomName].users = {};
                rooms[userRoomName].objects = {};
            }
            sockets[userId].roomName = data.roomName;
            sockets[userId].userName = data.userName;
            sockets[userId].cHeight = data.cHeight;
            sockets[userId].cWidth = data.cWidth;
            if (!sockets[userId].points) {
                sockets[userId].points = {};
            }
            if (!sockets[userId].points[userRoomName]) {
                sockets[userId].points[userRoomName] = 0;
            }
            rooms[userRoomName].users[userId] = 'dummy';
            emitPlayers(userRoomName);
            emitAllObjects(userRoomName);
        });

        socket.on('game object click', function (data) {
            if (rooms[userRoomName].objects[data.id]) { 
                // if not clicked yet
                emitInRoom(userRoomName, 'remove object', {id: data.id});
                var tempObj = rooms[userRoomName].objects[data.id].props;
                var newPoints = Math.ceil(1000 / (tempObj.width * tempObj.height))
                sockets[userId].points[userRoomName] += newPoints;
                socket.emit('new points', {amount: newPoints, X: data.X, Y: data.Y});
                emitPlayers(userRoomName);
                delete rooms[userRoomName].objects[data.id];
            }
        });

        socket.on('any click', function (data) {
            emitInRoom(userRoomName, 'user clicked', {X: data.X, Y: data.Y});
        });

        socket.on('resize', function (data) {
            if (sockets[userId]) {
                sockets[userId].cHeight = data.cHeight;
                sockets[userId].cWidth = data.cWidth;
                console.log(userName + ' resized to w=' + data.cHeight + ' h=' + data.cWidth);
            }
        });

        socket.on('disconnect', function () {
            delete rooms[userRoomName].users[userId];
            emitPlayers(userRoomName);
        });

        socket.on('error', function(error){
            console.trace(error);
        });

        function getPlayersFromRoom(rName) {
            var players = [];
            for(var uId in rooms[rName].users) {
                players.push({userName: sockets[uId].userName, points: sockets[uId].points[userRoomName]});
            }
            players.sort(function(a,b) {return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : 0);} );
            return players;
        }

        function emitPlayers(rName) {
            emitInRoom(rName, 'players', getPlayersFromRoom(rName));
        }

        function emitAllObjects(rName) {
            for(var oId in rooms[rName].objects) {
                socket.emit('new object', rooms[rName].objects[oId]);
            }
        }

        function emitInRoom(rName, tag, emitObject) {
            for(var uId in rooms[rName].users) {
                sockets[uId].socket.emit(tag, emitObject);
            }
        }



        
    });

    /*
    id: sadasdasd
    left: 30,
    top: 30,
    fill: 'green',
    width: 20,
    height: 20,
    selectable: false*/

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomColor() {
        return 'rgb('+getRandomInt(0,240)+','+getRandomInt(0,240)+','+getRandomInt(0,240)+')';
    }

    function generateObject(id, maxW, maxH) {
        var oWidth = getRandomInt(5, 50);
        var oHeight = getRandomInt(5, 50);
        var object = {
            id: id,
            gameObject: true,
            left: getRandomInt(0, maxW-oWidth),
            top: getRandomInt(0, maxH-oHeight),
            fill: getRandomColor(),
            width: oWidth,
            height: oHeight,
            selectable: false
        };
        return object;
    }

    function getMaxDimensions(rName) {
        var result = {};
        result.width = 99999999;
        result.height = 99999999;
        for (var uId in rooms[rName].users) {
            result.width = result.width > sockets[uId].cWidth ? sockets[uId].cWidth : result.width;
            result.height = result.height > sockets[uId].cHeight ? sockets[uId].cHeight : result.height;
        }
        return result;
    }

    var objectId = 0;
    function generateObjects() {
        for (var rName in rooms) {
            if (Object.keys(rooms[rName].objects).length < 75) {
                var maxDimens = getMaxDimensions(rName);
                var generated = {};
                generated.type = 'rect';
                generated.props = generateObject(objectId++, maxDimens.width, maxDimens.height);
                rooms[rName].objects[generated.props.id] = generated;
                for(var uId in rooms[rName].users) {
                    sockets[uId].socket.emit('new object', generated);
                }
            }
        }
    }

    (function generateObjectsLoop() {
        var rand = getRandomInt(80, 1000);
        setTimeout(function() {
            generateObjects();
            generateObjectsLoop();  
        }, rand);
    }());

};