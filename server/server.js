// Server-related functions will go here
var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');
var redis = require('redis');

var app = express();
var server = http.Server(app);
var io = socket(server);
var client = redis.createClient();
module.exports = {client: client, io: io};

var room = require('./room');

app.set('port', 4200);
app.use('/', express.static(path.join(__dirname, '../client')));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '../client/main.html'));
});

client.on("error", function (err) {
    console.log("Redis Error: " + err);
});

server.listen(process.env.PORT || 4200, function() {
    console.log('Starting server on port 4200');
});

io.on('connection', function(socket) {
    console.log("socket connected: " + socket.id);
    socket.on('connect', function() {
        console.log(socket.id);
    });

    socket.on('createRoom', function() {
        console.log(socket.id + ' is creating a room');
        room.createRoom(socket);
    });

    socket.on('joinRoom', function(roomId) {
        room.joinRoom(socket, roomId);
    })
});