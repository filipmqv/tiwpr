// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('c');

// create a rectangle object
var rect = new fabric.Rect({
	left: 800,
	top: 100,
	fill: 'red',
	width: 20,
	height: 20
});

// "add" rectangle onto canvas
canvas.add(rect);
canvas.setHeight(window.innerHeight);
canvas.setWidth(window.innerWidth);

canvas.renderAll();

var socket = io.connect('http://localhost:3000');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });