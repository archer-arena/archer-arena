var server = require('./server');
var uuid = require('uuid');
var redis = require('redis');

module.exports = {
  createRoom: function(socket) {
    const roomId = uuid();
    socket.join(roomId);

    // Initializes an id to given room for client usage
    server.io.sockets.adapter.rooms[roomId].id = roomId;

    // Initializes the player who created the room [Placeholder as of now]
    server.io.sockets.adapter.rooms[roomId].sockets[socket.id] = {
      x: 0,
      y: 0,
      arrows: [],
      score: 0
    };

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

    // Initializes the player who is joining the room [Placeholder as of now]
    server.io.sockets.adapter.rooms[roomId].sockets[socket.id] = {
      x: 0,
      y: 0,
      arrows: [],
      score: 0
    };

    const room = server.io.sockets.adapter.rooms[roomId];
    server.client.set(roomId, JSON.stringify(room), redis.print);
    socket.emit('joinedRoom', room);
    socket.to(roomId).emit('someoneJoined', room);
  },

  // Updates a single player's data inside of a room
  updatePlayerData: function(socket, roomId, player) {
    const room = server.io.sockets.adapter.rooms[roomId];
    room.sockets[socket.id] = player;
    server.client.set(roomId, JSON.stringify(room));
  },

  // Fetches a room's data for any player requesting it.
  fetchRoomData: function(socket, roomId) {
    server.client.get(roomId, function(error, data) {
      if(error)
        console.log(error);

      socket.emit('obtainFetchedRoomData', JSON.parse(data));
    });
  }
}
