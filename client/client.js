/* 
The function of this file is to connect the client and server together.
We will send client data and retrieve server data.
*/

// This line makes Client object unreachable
const socket = io();

var Client = {
  roomData: null,
  playerData: {
    name: ''
  },
  lobby: [],
  /*
    Call this in Preload(), this will connect the client (user) to...
    the server and will obtain updates from the server if needed
  */
  initializeConnection: function() {
    console.log('Initializing WebSocket Connection')
    Client.initializePlayerData(true);
    // will fetch all rooms available as soon as the lobby page is accessed.
    Client.fetchAllRooms(1);

    socket.on('joinedRoom', function(roomData) {
      console.log('You have joined room: ' + roomData.id);
      console.table(roomData);
      Client.roomData = roomData;
    });

    socket.on('someoneJoined', function(playerName) {
      console.log(playerName + ' has joined your room');
      GUI.drawSomeoneJoined(playerName)
    });

    socket.on('obtainFetchedRoomData', function(roomData) {
      Client.roomData = roomData;
    });

    // Get rooms from server and store in lobby menu
    socket.on('obtainFetchedRooms', function(rooms) {
      Client.lobby = rooms;
      updateserverList();
    });

    socket.on('forceUpdateData', function() {
      Client.fetchRoomData();
      forcedUpdate = true;
    });

    socket.on('kill', function(data) {
      GUI.drawKillFeed(data.killer, data.killed);
    });

    socket.on('gainScoreDestroyArrow', function(key) {
      arrowKey = key;
      score = true;
    });
  },

  initializePlayerData: function(guest = false) {
    if(guest) {
      Client.playerData.name = 'Guest' + Math.floor(100000 + Math.random() * 900000);
    } else {
      // Obtain LocalStorage data for player information;
    }
  },

  /*
    Client will join the room given a room identifer.
    Call on interface, clicked on "Join Room".
  */
  joinRoom: function(roomId) {
    socket.emit('joinRoom', {roomId: roomId, playerData: Client.playerData});
  },
  
  /*
    Client will create a room, room will be created in Redis...
    Client will then join the created room.
    Call on interface, clicked on "Create Room" in create room modal.
  */
  createRoom: function(roominfo) {
    socket.emit('createRoom', {roomInfo: roominfo, playerData: Client.playerData});
  },

  joinOrCreateRandomRoom: function() {
    console.log('Joining/Creating a random room');
    socket.emit('joinOrCreateRandomRoom', Client.playerData);
  },

  /*
    Broadcasts a forced update for all players in a room.
    USAGE: When a players shoots an arrow, force all players to update to view the arrow.
  */
  broadcastForceUpdateData: function() {
    socket.emit('broadcastForceUpdateData', Client.roomData.id);
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

  sendHitData: function(shooter, arrowKey) {
    socket.emit('sendHitData', {arrow: arrowKey, shooter: shooter, roomId: Client.roomData.id});
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