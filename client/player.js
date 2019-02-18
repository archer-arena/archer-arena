var Player = {
  /*
    Initializes player, called only ONCE after the player joins a server
    - Input, Graphics, Draw
  */
  initialize: function(main) {
    var crosshair = main.physics.add.sprite(480, 480, 'nothing');
    var player = {
      speed: 200,
      physics: main.physics.add.sprite(480, 480, 'archer_blk'),
    }

    /*
      enable mouse
    */
    Phaser.Input.Mouse.MouseManager.enabled = true;
    Phaser.Input.Mouse.MouseManager.capture = true;

    main.input.on('pointerdown', function (pointer) {
      Arrow.fireArrow();
    })

    /*
      enable camera
    */
    main.cameras.main.setZoom(4);
    main.cameras.main.startFollow(player.physics, true, 0.1, 0.1);

    /* 
      Initializes movements key bindings based on configurations
    */
    moveKeys = main.input.keyboard.addKeys({
      'up': config.playerOptions.controls['up'],
      'down': config.playerOptions.controls['down'],
      'left': config.playerOptions.controls['left'],
      'right': config.playerOptions.controls['right']
    });

    /*
      Input event listeners WASD for movement on 'keydown'
    */
    main.input.keyboard.on('keydown_W', function(event) {
      player.physics.setVelocityY(-player.speed)
    });
    main.input.keyboard.on('keydown_A', function(event) {
      player.physics.setVelocityX(-player.speed)
    });
    main.input.keyboard.on('keydown_S', function(event) {
      player.physics.setVelocityY(player.speed)
    });
    main.input.keyboard.on('keydown_D', function(event) {
      player.physics.setVelocityX(player.speed)
    });

    /*
      Input event listeners WASD for movement on 'keyup'
    */
    main.input.keyboard.on('keyup_W', function (event) {
      if (moveKeys['down'].isUp)
        player.physics.setVelocityY(0)
      else
        player.physics.setVelocityY(player.speed)
    });
    main.input.keyboard.on('keyup_S', function (event) {
      if (moveKeys['up'].isUp)
        player.physics.setVelocityY(0)
      else
        player.physics.setVelocityY(-player.speed)
    });
    main.input.keyboard.on('keyup_A', function (event) {
      if (moveKeys['right'].isUp)
        player.physics.setVelocityX(0)
      else
        player.physics.setVelocityX(player.speed)
    });
    main.input.keyboard.on('keyup_D', function (event) {
      if (moveKeys['left'].isUp)
        player.physics.setVelocityX(0)
      else
        player.physics.setVelocityX(-player.speed)
    });

    /*
      Crosshair functions
      Initializes the crosshair, on mouse down, and movements
    */
    // Locks pointer on mousedown
    main.game.canvas.addEventListener('mousedown', function () {
      main.game.input.mouse.requestPointerLock();
    });
  
    // Exit pointer lock when Q or escape (by default) is pressed.
    main.input.keyboard.on('keydown_Q', function (event) {
      if (main.game.input.mouse.locked)
        main.game.input.mouse.releasePointerLock();
    }, 0, main);

    // Move reticle upon locked pointer move
    main.input.on('pointermove', function (pointer) {
      if (main.input.mouse.locked)
      {
          crosshair.x += pointer.movementX;
          crosshair.y += pointer.movementY;
      }
    }, main);
 /*
    // Crosshair cannot move offscreen
    constrainCrosshair: function(crosshair) {
      var distX = crosshair.x-player.x;
      var distY = crosshair.x-player.y;

      if (distX > 800)
        crosshair.x = player.x+800;
      else if (distX < -800)
        crosshair.x = player.x-800;
      
      if (distY > 600)
        crosshair.y = player.y+600;
      else if (distY < -600)
        crosshair.y = player.y-600;
    }
*/

    main.player = player;
  },
}