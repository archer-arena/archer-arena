
var Player = {
  /*
    Initializes player, called only ONCE after the player joins a server
    - Input, Graphics, Draw
  */
  initialize: function(game) {
    var player = {
      x: 0,
      y: 0,
      physics: game.physics.add.sprite(480, 480, 'nothing'),
    }

    game.input.keyboard.on('keydown_W', function(event) {
      console.log('Up');
    });
    game.input.keyboard.on('keydown_A', function(event) {
      console.log('Left');
    });
    game.input.keyboard.on('keydown_S', function(event) {
      console.log('Right');
    });
    game.input.keyboard.on('keydown_D', function(event) {
      console.log('Down');
    });

    game.player = player;
  },
}