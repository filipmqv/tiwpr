module.exports = function(server){
    var socketio = require('socket.io')(server);
    var sockets = {};
    var rooms = {};

    socketio.sockets.on('connection', function(socket) {
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
        console.log('connected ' + userId + '   ' + cookieString);

        //if (!sockets[userId]) {
            sockets[userId] = {};
        //}
        sockets[userId].socket = socket;

        socket.emit('connection reply');

        socket.on('room and dimensions', function (data) {
            var requestedRoom = data.roomName;
            if (!rooms[requestedRoom]) {
                rooms[requestedRoom] = {};
                rooms[requestedRoom].users = [];
                rooms[requestedRoom].objects = [];
            }
            sockets[userId].roomName = data.roomName;
            sockets[userId].cHeight = data.cHeight;
            sockets[userId].cWidth = data.cWidth;
            sockets[userId].points = 0;
            rooms[requestedRoom].users.push(userId);
            emitPlayers(requestedRoom);
        });


        socket.on('disconnect', function () {
            // TODO oznacz jako zakonczony, usun dopiero po uplywie jakiegos czasu gdyby user chcial wrocic

            rooms[sockets[userId].roomName].users.splice(getIndexInRoomFromUserId(userId), 1);


            /*delete sockets[userId];

            for(var username in sockets){
                sockets[username].socket.emit("someoneLeft", userId);
            }*/
        });

        socket.on('error', function(error){
            console.trace(error);
        });

        function getPlayersFromRoom(roomName) {
            var players = [];
            for(var i in rooms[roomName].users) {
                var uId = rooms[roomName].users[i];
                //console.log(rooms[roomName].users[i])
                players.push({userId: uId, points: sockets[uId].points});
            }
            return players;
        }

        function emitPlayers(roomName) {
            var emitObject = getPlayersFromRoom(roomName);
            for(var i in rooms[roomName].users) {
                var uId = rooms[roomName].users[i];
                sockets[uId].socket.emit('players', emitObject);
            }
        }

        function getIndexInRoomFromUserId(uId) {
            return rooms[sockets[uId].roomName].users.indexOf(uId);
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
        for (var i in rooms) {
            //var uId = rooms[i]. TODO maxWidth maxHeight
            var generated = {};
            generated.type = 'rect';
            generated.props = generateObject(objectId++, 600, 300);
            rooms[i].objects.push(generated);
            for(var j in rooms[i].users) {
                var uId = rooms[i].users[j];
                sockets[uId].socket.emit('new object', generated);
            }


        }
    }

    (function generateObjectsLoop() {
        var rand = getRandomInt(100, 5000)
        setTimeout(function() {
            generateObjects();
            generateObjectsLoop();  
        }, rand);
    }());

};