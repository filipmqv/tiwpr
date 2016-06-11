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

        console.log('connected ' + userId + '   ' + cookieString);

        if (!sockets[userId]) { // if user is first time
            sockets[userId] = {};
        }
        sockets[userId].socket = socket;

        socket.emit('connection reply');

        socket.on('room and dimensions', function (data) {
            userRoomName = data.roomName;
            if (!rooms[userRoomName]) { // if such room doesn't exist
                rooms[userRoomName] = {};
                rooms[userRoomName].users = {};
                rooms[userRoomName].objects = {};
            }
            sockets[userId].roomName = data.roomName;
            sockets[userId].cHeight = data.cHeight;
            sockets[userId].cWidth = data.cWidth;
            sockets[userId].points = 0;
            rooms[userRoomName].users[userId] = 'dummy';
            emitPlayers(userRoomName);
        });

        socket.on('game object click', function (data) {
            if (rooms[userRoomName].objects[data.id]) { // if not clicked yet
                emitInRoom(userRoomName, 'remove object', {id: data.id});
                var tempObj = rooms[userRoomName].objects[data.id].props;
                sockets[userId].points += Math.ceil(1000 / (tempObj.width * tempObj.height));
                emitPlayers(userRoomName);
                delete rooms[userRoomName].objects[data.id];
            }
        });

        socket.on('disconnect', function () {
            // TODO oznacz jako zakonczony, usun dopiero po uplywie jakiegos czasu gdyby user chcial wrocic
            delete rooms[userRoomName].users[userId];
            emitPlayers(userRoomName);
        });

        socket.on('error', function(error){
            console.trace(error);
        });

        function getPlayersFromRoom(rName) {
            var players = [];
            for(var uId in rooms[rName].users) {
                players.push({userId: uId, points: sockets[uId].points});
            }
            return players;
        }

        function emitPlayers(rName) {
            emitInRoom(rName, 'players', getPlayersFromRoom(rName));
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
        return 'rgb('+getRandomInt(0,255)+','+getRandomInt(0,255)+','+getRandomInt(0,255)+')';
    }

    function generateObject(id, maxW, maxH) {
        var object = {
            id: id,
            gameObject: true,
            left: getRandomInt(0, maxW),
            top: getRandomInt(0, maxH),
            fill: getRandomColor(),
            width: getRandomInt(5, 50),
            height: getRandomInt(5, 50),
            selectable: false
        };
        return object;
    }

    var objectId = 0;
    function generateObjects() {
        for (var rName in rooms) {
            //var uId = rooms[i]. TODO maxWidth maxHeight
            var generated = {};
            generated.type = 'rect';
            generated.props = generateObject(objectId++, 600, 300);
            rooms[rName].objects[generated.props.id] = generated;
            for(var uId in rooms[rName].users) {
                sockets[uId].socket.emit('new object', generated);
            }


        }
    }

    (function generateObjectsLoop() {
        var rand = getRandomInt(30, 3000)
        setTimeout(function() {
            generateObjects();
            generateObjectsLoop();  
        }, rand);
    }());

};