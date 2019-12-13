var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
  if (document.getElementById('inp') != document.activeElement) {
  switch (event.keyCode) {
    
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
    
  }
}
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

user_name=prompt("Твоё имя?");
socket.emit('new player',user_name);
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
context.fillStyle = "#00F";
context.strokeStyle = "#F00";
context.font = "italic 10pt Arial";
context.textAlign = "center";
context.textBaseline = "bottom";

socket.on('state', function(players) {
// console.log(players);
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.fillText(player.name, player.x, player.y-15);
  }

});
var chat = document.getElementById('history');
socket.on('msg', function(message,name) {
  chat.innerHTML+="<br><b>"+name+"</b>:"+message;
  
  });
function send_msg(){
  let text = document.getElementById('inp').value;
  socket.emit('new message',text);
}