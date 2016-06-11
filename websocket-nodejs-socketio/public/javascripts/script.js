'use strict';

var canvas = new fabric.Canvas('c');
resize();

function resize() {
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
};

var canvasObjects = {};

var text = new fabric.Text('', { 
	left: 50, 
	top: 50, 
	fontSize: 10,
	selectable: false,
	hoverCursor: 'default'
});
canvas.add(text);

// create a rectangle object
/*var rect = new fabric.Rect({
	left: 0,
	top: 0,
	fill: 'green',
	width: 20,
	height: 20
});

var other = new fabric.Rect({
	left: 30,
	top: 30,
	fill: 'green',
	width: 20,
	height: 20,
	selectable: false
});/

/*canvas.add(rect);
canvas.add(other);
canvas.renderAll();*/








//var socket = io.connect('http://localhost:3000');
var socket = io.connect('192.168.1.4:3000');

socket.on('connection reply', function (data) {
	socket.emit('room and dimensions', {
		roomName: window.location.pathname.split('/')[1],
		userName: window.location.pathname.split('/')[2],
		cHeight: window.innerHeight,
		cWidth: window.innerWidth
	});
});

socket.on('players', function (data) {
	console.log(data);
	var textToSet = '';
	for (var i in data) {
		textToSet += data[i].userName + ' : ' + data[i].points + '\n';
	}
	text.setText(textToSet);
	canvas.renderAll();
});

socket.on('new object', function (data) {
	canvasObjects[data.props.id] = new fabric.Rect(data.props);
	canvas.add(canvasObjects[data.props.id]);
	canvas.renderAll();
});

canvas.on('mouse:down', function(options) {
	console.log(options.e.clientX + ' ' + options.e.clientY)
	socket.emit('any click', {
		X: options.e.clientX, 
		Y: options.e.clientY
	});
	if (options.target && options.target.gameObject) {
		console.log('an object was clicked! ', options.target);
		socket.emit('game object click', {
			id: options.target.id
		});
	}
});

socket.on('remove object', function (data) {
	canvas.remove(canvasObjects[data.id]);
	delete canvasObjects[data.id]
	canvas.renderAll();
});
/*socket.on('begin', function (data) {
	rect.set(data);
	canvas.renderAll();
});





socket.on('refreshUpdate', function (data) {
	other.set(data);
	canvas.renderAll();
});*/

socket.on('disconnect', function (data) {
	location.reload();
});

/*setInterval(function() {
	socket.emit('refresh', {
		left: rect.getLeft(), 
		top: rect.getTop(), 
		width: rect.getWidth(), 
		height: rect.getHeight(),
  		angle: rect.getAngle(),
  		fill: rect.getFill()
	});
}, 80);*/