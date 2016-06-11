'use strict';

var canvas = new fabric.Canvas('c');
resize();

function resize() {
	canvas.setHeight(window.innerHeight);
	canvas.setWidth(window.innerWidth);
	if (socket) {
		socket.emit('resize', {
			cHeight: window.innerHeight, 
			cWidth: window.innerWidth
		});
	}
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var canvasObjects = {};

var text = new fabric.Text('', { 
	left: 50, 
	top: 50, 
	fontSize: 60,
	selectable: false,
	evented: false,
	opacity: 0.3,
	textAlign: 'right',
	hoverCursor: 'default'
});
canvas.add(text);







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
	text.bringToFront();
	canvas.renderAll();
});

canvas.on('mouse:down', function(options) {
	socket.emit('any click', {
		X: options.e.clientX, 
		Y: options.e.clientY
	});
	if (options.target && options.target.gameObject) {
		socket.emit('game object click', {
			id: options.target.id,
			X: options.e.clientX, 
			Y: options.e.clientY
		});
	}
});

socket.on('remove object', function (data) {
	canvas.remove(canvasObjects[data.id]);
	delete canvasObjects[data.id]
	canvas.renderAll();
});

socket.on('new points', function (data) {
	var pointsRect = new fabric.Text('+'+data.amount, {  
		left: getRandomInt((data.X - 150) < 0 ? 0 : (data.X - 150), 
			(data.X + 150) < (window.innerWidth - 150) ? (data.X + 50) : (window.innerWidth - 150)), 
		top: getRandomInt((data.Y - 150) < 0 ? 0 : (data.Y - 150), 
			(data.Y + 150) < (window.innerHeight - 150) ? (data.Y + 50) : (window.innerHeight - 150)), 
		//left: getRandomInt(50, window.innerWidth - 150),
		//top: getRandomInt(50, window.innerHeight - 150),
		fontSize: 50,
		selectable: false,
		evented: false,
		hoverCursor: 'default'
	});
	pointsRect.animate('fontSize', '+=100', {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500,
		easing: fabric.util.ease.easeInOutQuad,
		onComplete: function() {canvas.remove(pointsRect)}
	});
	pointsRect.animate('opacity', 0, {
		onChange: canvas.renderAll.bind(canvas),
		duration: 500,
		easing: fabric.util.ease.easeInOutQuad
	});
	canvas.add(pointsRect);
});

socket.on('user clicked', function (data) {
	var clickCircle = new fabric.Circle({ 
		left: data.X-5,
		top: data.Y-5,
		radius: 5,
		selectable: false,
		evented: false,
		hoverCursor: 'default'
	});
	clickCircle.animate('opacity', 0, {
		onChange: canvas.renderAll.bind(canvas),
		duration: 400,
		easing: fabric.util.ease.easeOutQuad
	});
	canvas.add(clickCircle);
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