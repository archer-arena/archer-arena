function playAsGuest() {
    $("#log-in-menu").addClass("d-none");
    $("#overlay-lobby-menu").removeClass("d-none");
    $("#log-out-btn").addClass("d-none");
    $("#main-menu-btn").removeClass("d-none");
    $("#welcome-username").addClass("d-none");
    $("#welcome-guest").removeClass("d-none");
}

function mainMenu() {
    $("#overlay-lobby-menu").addClass("d-none");
    $("#log-in-menu").removeClass("d-none");
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
}