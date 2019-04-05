var server = require('./server');
var uuid = require('uuid');
var redis = require('redis');

module.exports = {
  createRoom: function (socket, roominfo, playerData) {
    const roomId = uuid();
    socket.join(roomId);

    // Initializes an id to given room for client usage
    server.io.sockets.adapter.rooms[roomId].id = roomId;

    // Initializes the player who created the room [Placeholder as of now]
    server.io.sockets.adapter.rooms[roomId].sockets[socket.id] = {
      name: playerData.name,
      x: 0,
      y: 0,
      velocity: { x: 0, y: 0 },
      score: 0
    };

    // TODO: Add options to room, placeholder for now
    server.io.sockets.adapter.rooms[roomId].arrows = {};

    // TODO: Add options to room, placeholder for now
    server.io.sockets.adapter.rooms[roomId].options = {
      serverList: function(roominfo) {
        let rooms = JSON.parse(null || "[]");
        rooms.push(roominfo);
        server.client.set("lobbysd", JSON.stringify(rooms));
        socket.emit("obtainFetchedRooms", rooms);
      },
    };
    // TODO: Add password to room, placeholder for now
    server.io.sockets.adapter.rooms[roomId].password = {};
    
    const room = server.io.sockets.adapter.rooms[roomId];
    server.client.set(roomId, JSON.stringify(room), redis.print);
    server.io.sockets.adapter.rooms[roomId].options.serverList(roominfo);
    socket.emit('joinedRoom', room);
  },

  joinRoom: function (socket, roomId, playerData) {
    socket.join(roomId);

    // Initializes the player who is joining the room [Placeholder as of now]
    server.io.sockets.adapter.rooms[roomId].sockets[socket.id] = {
      name: playerData.name,
      x: 0,
      y: 0,
      velocity: { x: 0, y: 0 },
      score: 0
    };

    const room = server.io.sockets.adapter.rooms[roomId];
    server.client.set(roomId, JSON.stringify(room), redis.print);
    socket.emit('joinedRoom', room);
    socket.to(roomId).emit('someoneJoined', playerData.name);
  },

  // Updates a single player's data inside of a room
  updatePlayerData: function (socket, roomId, player) {
    const room = server.io.sockets.adapter.rooms[roomId];
    // console.table(server.io.sockets.adapter.rooms);
    if (room) {
      room.sockets[socket.id] = player;
      server.client.set(roomId, JSON.stringify(room));
    }
  },

  updateArrowData: function (socket, roomId, arrows) {
    const room = server.io.sockets.adapter.rooms[roomId];
    for (let key in arrows) {
      if(arrows[key].data.life >= arrows[key].data.maxLife) {
        delete room.arrows[key];
      } else {
        room.arrows[key] = arrows[key].data;
      }
    }
    server.client.set(roomId, JSON.stringify(room));
  },

  // Fetches a room's data for any player requesting it.
  fetchRoomData: function (socket, roomId) {
    server.client.get(roomId, function (error, data) {
      if (error)
        console.log(error);

      socket.emit('obtainFetchedRoomData', JSON.parse(data));
    });
  },

  sendHitData: function(socket, shooter, roomId) {
    const room = server.io.sockets.adapter.rooms[roomId];
    room.sockets[socket.id].health--;

    // Set room message for killfeed
    server.client.set(roomId, JSON.stringify(room));
  },

  fetchAllRooms: function(socket, pageNum) {
    server.client.keys('*', function(error, data) {
      roomIndexStart = (pageNum - 1) * 10;
      roomIndexEnd = (pageNum * 10);

      if (roomIndexEnd > data.length) {
        roomIndexEnd = data.length;
      }

      let roomIds = data.slice(roomIndexStart, roomIndexEnd)
      server.client.mget(roomIds, function (error, data) {
        let rooms = [];
        data.forEach(roomData => {
          parsedRoomData = JSON.parse(roomData);
          rooms.push(parsedRoomData);
        });
        socket.emit('obtainFetchedRooms', rooms);
      });
    });
  }
}
