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
    // roominfo is passed in from interface.js => contains 
    // all the room information to be displayed in the room list
    server.io.sockets.adapter.rooms[roomId].options = roominfo;
    // console.log(roomId);
    // Holds the roomId for each room created to be accessed for the delete room function

    socket.emit("obtainFetchedRooms", [roominfo]);

    // TODO: Add password to room, placeholder for now
    server.io.sockets.adapter.rooms[roomId].password = {};

    const room = server.io.sockets.adapter.rooms[roomId];
    server.client.set(roomId, JSON.stringify(room), redis.print);
    socket.emit('joinedRoom', room);
  },

  joinRoom: function (socket, roomId, playerData) {
    socket.join(roomId);

    // console.log(playerData);

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

  joinOrCreateRandomRoom: function (socket, data) {
    const self = this;
    server.client.dbsize(function (err, size) {
      if (size == 0) {
        self.createRoom(socket, {}, data);
      } else {
        const self_ = self;
        server.client.randomkey(function (err, key) {
          self_.joinRoom(socket, key, data);
        });
      }
    });
  },

  // Updates a single player's data inside of a room
  updatePlayerData: function (socket, roomId, player) {
    const room = server.io.sockets.adapter.rooms[roomId];
    if (room) {
      room.sockets[socket.id] = player;
      server.client.set(roomId, JSON.stringify(room));
    }
  },

  updateArrowData: function (socket, roomId, arrows) {
    const room = server.io.sockets.adapter.rooms[roomId];
    for (let key in arrows) {
      if (arrows[key].data.life >= arrows[key].data.maxLife) {
        delete room.arrows[key];
      } else {
        room.arrows[key] = arrows[key].data;
      }
    }
    server.client.set(roomId, JSON.stringify(room));
    this.broadcastForceUpdateData(socket, roomId);
  },

  leaveRoom: function (socket, roomId) {
    const room = server.io.sockets.adapter.rooms[roomId];
    delete room.sockets[socket.id];

    if (Object.keys(room.sockets).length == 0) {
      server.client.del(roomId);
    } else {
      server.client.set(roomId, JSON.stringify(room));
    }
  },

  // Fetches a room's data for any player requesting it.
  fetchRoomData: function (socket, roomId) {
    server.client.get(roomId, function (error, data) {
      if (error)
        console.log(error);

      socket.emit('obtainFetchedRoomData', JSON.parse(data));
    });
  },

  broadcastForceUpdateData: function (socket, roomId) {
    socket.to(roomId).emit('forceUpdateData');
  },

  sendHitData: function (socket, arrow, shooter, roomId) {
    const self = this;
    const room = server.io.sockets.adapter.rooms[roomId];

    // Set room message for killfeed
    server.io.in(roomId).emit('kill', { killed: room.sockets[socket.id].name, killer: room.sockets[shooter].name });
    server.io.to(`${shooter}`).emit('gainScoreDestroyArrow', arrow);
    server.client.set(roomId, JSON.stringify(room), function (err, reply) {
      self.broadcastForceUpdateData(socket, roomId);
    });
  },

  fetchAllRooms: function (socket, pageNum) {
    server.client.keys('*', function (error, data) {
      roomIndexStart = (pageNum - 1) * 10;
      roomIndexEnd = (pageNum * 10);



      if (roomIndexEnd > data.length) {
        roomIndexEnd = data.length;
      }

      if (roomIndexStart > data.length) {
        roomIndexStart = 0;
      }

      let roomIds = data.slice(roomIndexStart, roomIndexEnd);

      console.log("Above mget");
      server.client.mget(roomIds, function (error, data) {
        // console.table(roomIds);
        // console.log("mget", data);
        let rooms = [];
        console.log(`Printing data: ${data}`);
        // console.table(data);
        // this stops an error from occuring when mget is undefined
        if (data) {
          data.forEach(roomData => {
            parsedRoomData = JSON.parse(roomData);
            parsedRoomData.options.KEY = parsedRoomData.id;
            rooms.push(parsedRoomData.options);
            console.log("parsedRoomData: ", parsedRoomData);
          });
        }
        socket.emit('obtainFetchedRooms', rooms);
      });
    });
  },

  deleteRoom: function (socket, thisKey) {
    server.client.exists(thisKey, function (err, reply) {
      if (reply === 1) {
        // .DEL removes from server, .del sets value to null
        server.client.DEL(thisKey, function (err, reply) {

          console.log("DELETED:", reply);
        });
      } else {
        console.log('doesn\'t exist');
      }
    });
  }
}
