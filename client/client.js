/* 
The function of this file is to connect the client and server together.
We will send client data and retrieve server data.
*/

// This line makes Client object unreachable
const socket = io();

var Client = {
  roomData: null,
  lobby: [],
  /*
    Call this in Preload(), this will connect the client (user) to...
    the server and will obtain updates from the server if needed
  */
  initializeConnection: function() {
    console.log('Initializing WebSocket Connection')
    socket.on('joinedRoom', function(roomData) {
      console.log('You have joined room: ' + roomData.id);
      Client.roomData = roomData;
    });

    socket.on('someoneJoined', function(roomData) {
      console.log('Someone has joined your room');
      Client.roomData = roomData;
    });

    socket.on('obtainFetchedRoomData', function(roomData) {
      Client.roomData = roomData;
    });

    // Get rooms from server and store in lobby menu
    socket.on('obtainFetchedRooms', function(rooms) {
      console.log("client.js => we obtained fetch rooms");
      Client.lobby = Client.lobby.concat(rooms);
      updateserverList();
    });
  },

  /*
    Client will join the room given a room identifer.
    Call on interface, clicked on "Join Room".
  */
  joinRoom: function(roomId) {
    socket.emit('joinRoom', roomId);
  },
  
  /*
    Client will create a room, room will be created in Redis...
    Client will then join the created room.
    Call on interface, clicked on "Create Room" in create room modal.
  */
  createRoom: function(roominfo) {
    socket.emit('createRoom', roominfo);
    console.log("we're in createRoom");      
  },

  /*
    Sends the server the players data such as arrows, player position, etc
  */
  sendPlayerData: function(player) {
    // console.log("client.js => sending Player Data", player);
    socket.emit('updatePlayerData', {roomId: Client.roomData.id, player: player});
  },

  sendArrowData: function(arrows) {
    socket.emit('updateArrowData', {roomId: Client.roomData.id, arrows: arrows});
  },

  /*
    Client will fetch the room's data.
  */
  fetchRoomData: function() {
    socket.emit('fetchRoomData', Client.roomData.id);
  },

  fetchAllRooms: function (pageNum) {
    socket.emit('fetchAllRooms', pageNum);
  },

};