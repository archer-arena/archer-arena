/* 
The function of this file is to connect the client and server together.
We will send client data and retrieve server data.
*/
const socket = io();

var Client = {
  /*
    Call this in Preload(), this will connect the client (user) to...
    the server and will obtain updates from the server if needed
  */
  initializeConnection: function() {
    console.log('Initializing WebSocket Connection')
    socket.on('joinedRoom', function(roomData) {
      console.log(roomData);
    })
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
  createRoom: function() {
    socket.emit('createRoom');
  }
}