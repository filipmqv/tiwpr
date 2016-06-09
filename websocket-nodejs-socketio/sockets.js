/*module.exports = function(io){
  io.sockets.on('connection', function (socket) {

    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('file1Event', function () {
      console.log('file1Event triggered');
    });
  });
};

*/

/*
module.exports = function(app){
    var io = require('socket.io')(app)
    var sockets = {};

    io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

    /*io.sockets.on('connection', function(socket) {
        var connectedUsername = socket.handshake.query.username;
socket.emit('news', { hello: 'world' });
socket.on('my other event', function (data) {
console.log(data);
});

        socket.on('disconnect', function () {
            delete sockets[connectedUsername];

            for(var username in sockets){
                sockets[username].socket.emit("someoneLeft", connectedUsername);
            }
        });*/

        /*socket.on('error', function(error){
            console.trace(error);
        });

        socket.on('webrtcOffer', function(data){
            sockets[data.receiver].socket.emit('webrtcOffer', data);
        });

        socket.on('webrtcAnswer', function(data){
            sockets[data.receiver].socket.emit('webrtcAnswer', data);
        });

        socket.on('webrtcIceCandidate', function(data){
            sockets[data.receiver].socket.emit('webrtcIceCandidate', data);
        });

        socket.on('webrtcError', function(data){
            sockets[data.receiver].socket.emit('webrtcError', data);
        });



        var usernames = [];
        for(var username in sockets){
            usernames.push({username: username});

            sockets[username].socket.emit("someoneJoined", {username: connectedUsername});
        }

        socket.emit("usersList", usernames);

        sockets[connectedUsername] = {};
        sockets[connectedUsername].socket = socket;
    });

};*/