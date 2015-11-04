var express = require('express');
var app = new express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var distDir = 'public';

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile( __dirname + "/" + distDir + '/index.html');
});

server.listen(3000);

