var server = require('./server');
var uuid = require('uuid');
var redis = require('redis');

module.exports = {
  createRoom: function(socket) {
    const roomId = uuid();
    socket.join(roomId);

    // TODO: Add options to room, placeholder for now
    server.io.sockets.adapter.rooms[roomId].options = null;

    // TODO: Add password to room, placeholder for now
    server.io.sockets.adapter.rooms[roomId].password = null;

    const room = server.io.sockets.adapter.rooms[roomId];
    server.client.set(roomId, JSON.stringify(room), redis.print);
    socket.emit('joinedRoom', room);
  },

  joinRoom: function(socket, roomId) {
    socket.join(roomId);

    const room = server.io.sockets.adapter.rooms[roomId];
    server.client.set(roomId, JSON.stringify(room), redis.print);
    socket.emit('joinedRoom', room);
  }
}
