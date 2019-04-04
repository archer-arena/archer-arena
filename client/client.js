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
    console.log('Initializing WebSocket Connection');
    // will fetch all rooms available as soon as the lobby page is accessed.
    Client.fetchAllRooms(1);

    socket.on('joinedRoom', function(roomData) {
      console.log('You have joined room: ' + roomData.id);
      // console.table(roomData);
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
      Client.lobby = rooms;
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
    console.log(roominfo);
    socket.emit('createRoom', roominfo);
  },

  /*
    Sends the server the players data such as arrows, player position, etc
  */
  sendPlayerData: function(player) {
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
  // for testing purposes. 
  // this will delete the rooms created while testing if code works
  // clicking the RED X icon next to JOIN ROOM button next to each room will delete the room
  deleteRoom: function(roomKey) {
    socket.emit('deleteRoom', roomKey);
    this.fetchAllRooms(1);
  }

};