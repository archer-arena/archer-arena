/*
Functions that relate to the main.html file should go in here.
*/

// Creates room using the Create Room button in the Create Room modal //
document.getElementById("createRoomSubmit").addEventListener("click", function () {
  console.log("creating a roomskie")
  Client.createRoom(getRoomInfo());
  // loadIntoGame();
});

$("#search-room-filter").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#lobby-overlay tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

function getRoomInfo() {
  return {
    roomName: $("#server-name").prop("value"),
    createdBy: "User",
    gameMode: $("#game-mode-modal").prop("value"),
    playerCount: $("#player-count").prop("value")
  }
}

function updateserverList() {
  var roomHTML = "";
  console.log("hello there im an annoying for loop");
  Client.lobby.forEach(room => {
    roomHTML += ` <tr>
      <th scope="row">${room.roomName}</th>
      <td>${room.createdBy}</td>
      <td>${room.gameMode}</td>
      <td>${room.playerCount}</td>
      <td><button class="btn btn-primary btn-block">Join</button></td>
    </tr>`;
  });

  $("#lobby-overlay").empty().append(roomHTML);
}