function playAsGuest() {
    // $("#overlay-start-menu").remove();
    // Client.joinOrCreateRandomRoom();
}

function mainMenu() {
    $("#overlay-lobby-menu").addClass("d-none");
    $("#log-in-menu").removeClass("d-none");
    Auth.logout();
}

function privateSelect() {
    $("#optional-pwd").removeClass("d-none");
}

function publicSelect() {
    $("#optional-pwd").addClass("d-none");
}

function loggedIn() {
    $("#log-in-menu").addClass("d-none");
    $("#overlay-lobby-menu").removeClass("d-none");
    $("#main-menu-btn").addClass("d-none");
    $("#log-out-btn").removeClass("d-none");
    $("#welcome-guest").addClass("d-none");
    $("#welcome-username").removeClass("d-none");
    Auth.login()
}

function isLoggedIn() {
    if(Auth.parseLogin()) {
        $("#log-in-menu").addClass("d-none");
        $("#overlay-lobby-menu").removeClass("d-none");
        $("#main-menu-btn").addClass("d-none");
        $("#log-out-btn").removeClass("d-none");
        $("#welcome-guest").addClass("d-none");
        $("#welcome-username").removeClass("d-none");
        Auth.setProfile();
    }
}

function loggedInAsGuest() {
    $("#log-in-menu").addClass("d-none");
    $("#overlay-lobby-menu").removeClass("d-none");
    $("#log-out-btn").addClass("d-none");
    $("#main-menu-btn").removeClass("d-none");
    $("#welcome-guest").removeClass("d-none");
    $("#welcome-username").addClass("d-none");
}

function clearRegForm() {
    $("#regForm")[0].reset();
}

function clearServerForm() {
    $("#server-name").val('');
    $("#player-count").val('');
    $("#optional-pwd").val('');
    $('#public-radio').prop('checked', true);
    $("#map-type-modal").get(0).selectedIndex = 0;
    $("#game-mode-modal").get(0).selectedIndex = 0;
    publicSelect();
}

function loadIntoGame() {
    $("#overlay-start-menu").addClass("d-none");
    $("#overlay-lobby-menu").addClass("d-none");
}

$("#server-creation-modal").on("hidden.bs.modal", function () {
    clearServerForm();
});

$("#registerModal").on("hidden.bs.modal", function () {
    clearRegForm();
});

isLoggedIn();
