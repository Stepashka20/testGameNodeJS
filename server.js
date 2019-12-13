// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var chat_history = [];
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function(user_name) {
    players[socket.id] = {
      x: 300,
      y: 300,
      name: user_name
    };
  });
  socket.on('new message', function(text_message) {
    chat_history.push(text_message);
    var player = players[socket.id] || {};
    io.sockets.emit('msg', text_message,player.name);
  });
  socket.on('disconnect', function() {
    var player = players[socket.id] || {};
    console.log("Игрок "+player.name + " отключился");
    delete players[socket.id];
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
