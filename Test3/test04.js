var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/test12.html');
});

// GET static FILES
app.use(express.static(path.join(__dirname, '/public')));

var pc = 0;
io.on('connection', function(socket){
	console.log(++pc + ". User connected");
	
	setTimeout(function() {
		io.sockets.emit('joinEvent', { 
			player: 0 + pc,
		});
	}, 100);
	socket.broadcast.emit('createPlayer', { 
		player: pc
	});
	
	socket.on('updateEvent', function(data){
		socket.broadcast.emit('updateBroadcast', data);
	});
	
	socket.on('hostPlayer', function(data){
		console.log('hostplayer');
		socket.broadcast.emit('leftPlayerUpdate', data);
	});
	
	socket.on('secondPlayer', function(data){
		console.log('other player');
		socket.broadcast.emit('rightPlayerUpdate', data);
	});

	socket.on('disconnect', function(){
		socket.broadcast.emit('removePlayer', { player: pc });
		console.log('A user disconnected, ' + --pc + " remain");
	});
});



http.listen(3000, function() {
	console.log('listening on localhost:3000');
});
