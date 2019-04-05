/*
Functions that relate to the main.html file should go in here.
*/

// Creates room using the Create Room button in the Create Room modal //
document.getElementById("createRoomSubmit").addEventListener("click", function () {
  Client.createRoom(getRoomInfo());
  //loadIntoGame();
});
// Refressh button will refresh the list of rooms available to the player
document.getElementById("refresh-btn").addEventListener("click", function () {
  Client.fetchAllRooms(1);
});
// Search filter for the room list.
// Player can search by room name/player count/ game mode/ created by
// Filter reduces list as user types in filter
$("#search-room-filter").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#lobby-overlay tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});
// Returns an object with the roomName/createdBy/gameMode/playerCount of each room
function getRoomInfo() {
  return {
    roomName: $("#server-name").prop("value"),
    createdBy: "User",
    gameMode: $("#game-mode-modal").prop("value"),
    playerCount: $("#player-count").prop("value")
  }
}
// The function will append rooms to the room list when the create room button is clicked
// create room button located in the modal of create room
function updateserverList() {
  var roomHTML = "";
  // console.table(Client.lobby);
  Client.lobby.forEach(room => {
    try {
      if (true) {
        roomHTML += ` <tr>
        <th scope="row">${room.roomName}</th>
        <td>${room.createdBy}</td>
        <td>${room.gameMode}</td>
        <td>${room.playerCount}</td>
        <td><button class="btn btn-primary btn-block">Join</button></td>
        <td><button type="button" class="btn btn-danger" onClick="Client.deleteRoom('${room.KEY}')">X</button></td>
      </tr>`;
        console.log("appending to table");
      }
    } catch (error) {
      console.error("BAD:", error.message);
    }

  });
  $("#lobby-overlay").empty();
  $("#lobby-overlay").append(roomHTML);
}