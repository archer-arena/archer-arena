
var Player = {
  /*
    Initializes player, called only ONCE after the player joins a server
    - Input, Graphics, Draw
  */
  initialize: function(game) {
    var player = {
      speed: 100,
      physics: game.physics.add.sprite(480, 480, 'nothing'),
    }

    /* 
      Initializes movements key bindings based on configurations
    */
    moveKeys = game.input.keyboard.addKeys({
      'up': config.playerOptions.controls['up'],
      'down': config.playerOptions.controls['down'],
      'left': config.playerOptions.controls['left'],
      'right': config.playerOptions.controls['right']
    });

    /*
      Input event listeners WASD for movement on 'keydown'
    */
    game.input.keyboard.on('keydown_W', function(event) {
      player.physics.setVelocityY(-player.speed)
    });
    game.input.keyboard.on('keydown_A', function(event) {
      player.physics.setVelocityX(-player.speed)
    });
    game.input.keyboard.on('keydown_S', function(event) {
      player.physics.setVelocityY(player.speed)
    });
    game.input.keyboard.on('keydown_D', function(event) {
      player.physics.setVelocityX(player.speed)
    });

    /*
      Input event listeners WASD for movement on 'keyup'
    */
    game.input.keyboard.on('keyup_W', function (event) {
      if (moveKeys['down'].isUp)
        player.physics.setVelocityY(0)
      else
        player.physics.setVelocityY(player.speed)
    });
    game.input.keyboard.on('keyup_S', function (event) {
      if (moveKeys['up'].isUp)
        player.physics.setVelocityY(0)
      else
        player.physics.setVelocityY(-player.speed)
    });
    game.input.keyboard.on('keyup_A', function (event) {
      if (moveKeys['right'].isUp)
        player.physics.setVelocityX(0)
      else
        player.physics.setVelocityX(player.speed)
    });
    game.input.keyboard.on('keyup_D', function (event) {
      if (moveKeys['left'].isUp)
        player.physics.setVelocityX(0)
      else
        player.physics.setVelocityX(-player.speed)
    });

    game.player = player;
  },
}