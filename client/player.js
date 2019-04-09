let disableControl = false;
let canShoot = true;
var Player = {
  /*
    Initializes player, called only ONCE after the player joins a server
    - Input, Graphics, Draw
  */
  initialize: function(main) {
    var initCoords = Player.getRespawnCoordinates();
    var crosshair = main.physics.add.sprite(initCoords.x, initCoords.y, 'crosshair');
    var player = {
      speed: 100,
      physics: main.physics.add.sprite(initCoords.x, initCoords.y, 'archer'),
      text: main.add.bitmapText(initCoords.x, initCoords.y - 16, 'pixel', Client.playerData.name, 8, 'center'),
      input: null,
      data: {     
        x: initCoords.x,
        y: initCoords.y,
        velocity: {x: 0, y: 0},
        arrows: [],
        score: 0,
        isFirst: false,
        health: 1       
      }
    }
    player.text.setOrigin(0.5);
    /*
    var particles = main.add.particles('bounty_skull');

    /*var emitter = particles.createEmitter({
      frame: 'test_shape',
      lifespan: 200,
      speed: 200,
      alpha: 1,
      scale: 1
    });
    var testTween = main.tweens.addCounter({
      from: -0.5,
      to: 1,
      duration: 4000,
      ease: 'Sine.easeInOut'
    });
    var testPro = {
      active: true,
      update: function (particle)
      {
          particle.alpha = testTween.getValue();
      }
    }
    particles.addGravityWell(testPro);
    var emitter = particles.createEmitter();
    emitter.setSpeed(5);
    emitter.setLifespan(500);
    emitter.setScale(0.75, 0.75);



  //if (main.player.data.isFirst) {
    emitter.startFollow(player.physics);
  //}
    */
    player.physics.anims.load('up');
    player.physics.anims.load('right');
    player.physics.anims.load('left');
    player.physics.anims.load('down');

    // player vs arrow collider
    main.physics.add.overlap(player.physics, main.otherArrowsCollisionGroup, function(pSprite, aSprite) {
      for(let key in main.otherArrows) {
        if(main.otherArrows[key] == aSprite) {
          let shooterId = key.slice(0, -6);
          if(main.player.data.health != 0) {
            main.player.data.health--;
            main.player.physics.visible = false;
            Client.sendHitData(shooterId, key);
            Player.waitForRespawn(main);
            break;
          }
        }
      }
    });

    // player vs player collider
    //main.physics.add.collider(player, [otherPlayer??], collidePlayer);

    /*
      enable mouse
    */
    Phaser.Input.Mouse.MouseManager.enabled = true;
    Phaser.Input.Mouse.MouseManager.capture = true;

    main.input.on('pointerdown', function () {
      if(!disableControl && canShoot) { 
        Arrow.initialize(main, player.physics, crosshair);
        Player.refreshShotTimer(main);
      }
    })

    /*
      enable camera
    */
    main.cameras.main.setZoom(4);
    main.cameras.main.startFollow(player.physics, false, 1, 1);

    /* 
      Initializes movements key bindings based on configurations
    */
    player.input = main.input.keyboard.addKeys({
      'up': config.playerOptions.controls['up'],
      'down': config.playerOptions.controls['down'],
      'left': config.playerOptions.controls['left'],
      'right': config.playerOptions.controls['right']
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

    main.player = player;
    main.crosshair = crosshair;
  },

  update(main) {
    main.player.data = {
      name: Client.playerData.name,
      x: main.player.physics.x,
      y: main.player.physics.y,
      velocity: main.player.physics.body.velocity,
      score: main.player.data.score,
      health: main.player.data.health
    }
  },

  move(main) {
    if(!disableControl) {
      if(main.player.input['left'].isDown) {
        main.player.physics.setVelocityX(-main.player.speed)

        if(main.player.physics.anims.currentAnim.key != 'left') {
          main.player.physics.anims.play('left');
        } else if(!main.player.physics.anims.isPlaying) {
          main.player.physics.anims.play('left');
        }
      } else {
        if(!main.player.input['right'].isDown) {
          main.player.physics.setVelocityX(0);
        }
      }

      if(main.player.input['right'].isDown) {
        main.player.physics.setVelocityX(main.player.speed)

        if(main.player.physics.anims.currentAnim.key != 'right') {
          main.player.physics.anims.play('right');
        } else if(!main.player.physics.anims.isPlaying) {
          main.player.physics.anims.play('right');
        }
      } else {
        if(!main.player.input['left'].isDown) {
          main.player.physics.setVelocityX(0);
        }
      }

      if(main.player.input['up'].isDown) {
        main.player.physics.setVelocityY(-main.player.speed)

        if(main.player.physics.anims.currentAnim.key != 'up' && main.player.input['left'].isUp && main.player.input['right'].isUp) {
          main.player.physics.anims.play('up');
        } else if(!main.player.physics.anims.isPlaying) {
          main.player.physics.anims.play('up');
        }
      } else {
        if(!main.player.input['down'].isDown) {
          main.player.physics.setVelocityY(0);
        }
      }

      if(main.player.input['down'].isDown) { 
        main.player.physics.setVelocityY(main.player.speed)

        if(main.player.physics.anims.currentAnim.key != 'down' && main.player.input['left'].isUp && main.player.input['right'].isUp) {
          main.player.physics.anims.play('down');
        } else if(!main.player.physics.anims.isPlaying) {
          main.player.physics.anims.play('down');
        }
      } else {
        if(!main.player.input['up'].isDown) {
          main.player.physics.setVelocityY(0);
        }
      }

      if(main.player.physics.body.velocity.x == 0 && main.player.physics.body.velocity.y == 0) {
        main.player.physics.anims.stop();
      }
    }
  },

  updateOtherPlayers(main, roomData) {
    
    for(let key in roomData.sockets) {
      if(socket.id != key) {
        // If the roomData does not have a object for a player, create one
        if(!(key in main.otherPlayers)) {
          main.otherPlayers[key] = main.physics.add.sprite(480, 480, 'archer');
          main.otherPlayers[key].text = main.add.bitmapText(main.otherPlayers[key].x, main.otherPlayers[key].y - 16, 'pixel', Client.roomData.sockets[key].name, 8, 'center')
          main.otherPlayers[key].text.setOrigin(0.5);
          main.otherPlayers[key].anims.load('up');
          main.otherPlayers[key].anims.load('right');
          main.otherPlayers[key].anims.load('left');
          main.otherPlayers[key].anims.load('down');
        } else {
          let predictedPosition = {x: 0, y: 0};
          predictedPosition.x = roomData.sockets[key].x + roomData.sockets[key].velocity.x;
          predictedPosition.y = roomData.sockets[key].y + roomData.sockets[key].velocity.y;

          if(roomData.sockets[key].health == 0) {
            if(firstPlayer == key) {
              crown.visible = false;
            }
            main.otherPlayers[key].text.visible = false;
            main.otherPlayers[key].visible = false;
          } else {
            if(firstPlayer == key) {
              crown.visible = true;
            }
            main.otherPlayers[key].text.visible = true;
            main.otherPlayers[key].visible = true;
          }

          if(roomData.sockets[key].velocity.x > 0) {
            if(main.otherPlayers[key].anims.currentAnim.key != 'right') {
              main.otherPlayers[key].anims.play('right');
            } else if(!main.otherPlayers[key].anims.isPlaying) {
              main.otherPlayers[key].anims.play('right');
            }
          } else if(roomData.sockets[key].velocity.x < 0) {
            if(main.otherPlayers[key].anims.currentAnim.key != 'left') {
              main.otherPlayers[key].anims.play('left');
            } else if(!main.otherPlayers[key].anims.isPlaying) {
              main.otherPlayers[key].anims.play('left');
            }
          } else if(roomData.sockets[key].velocity.y > 0) {
            if(main.otherPlayers[key].anims.currentAnim.key != 'down') {
              main.otherPlayers[key].anims.play('down');
            } else if(!main.otherPlayers[key].anims.isPlaying) {
              main.otherPlayers[key].anims.play('down');
            }
          } else if(roomData.sockets[key].velocity.y < 0) {
            if(main.otherPlayers[key].anims.currentAnim.key != 'up') {
              main.otherPlayers[key].anims.play('up');
            } else if(!main.otherPlayers[key].anims.isPlaying) {
              main.otherPlayers[key].anims.play('up');
            }
          } else {
            main.otherPlayers[key].anims.stop();
          }

          if(roomData.sockets[key].velocity.x != 0 || roomData.sockets[key].velocity.y != 0) {
            main.physics.moveTo(main.otherPlayers[key], predictedPosition.x, predictedPosition.y, 100, 1000);
          } else {
            if(Phaser.Math.Distance.Between(main.otherPlayers[key].x, main.otherPlayers[key].y, roomData.sockets[key].x, roomData.sockets[key].y) > 10) {
              main.physics.moveTo(main.otherPlayers[key], roomData.sockets[key].x, roomData.sockets[key].y, 100, 1000);
            } else {
              main.otherPlayers[key].setVelocity(0, 0);
            }
          }
        }
      }
    }

    // Check for players who have left
    for(let key in main.otherPlayers) {
      if(!(key in roomData.sockets)) {
        main.otherPlayers[key].text.destroy();
        main.otherPlayers[key].destroy();
        delete main.otherPlayers[key];
      }
    }
  },

  refreshShotTimer(main) {
    canShoot = false;
    main.crosshair.setTexture('reloading');
    setTimeout(function() {
      canShoot = true;
      main.crosshair.setTexture('crosshair');
    }, 2000);
  },

  /*highlightFirst (main) {
    if (main.player.data.isFirst) {
      //highlight with skull icon above head and red edge around player sprite
      

      //other players can see skull and have arrow pointing to where isFirst player is offscreen
    }
  },*/

  waitForRespawn(main) {
    disableControl = true;
    GUI.drawRespawnNotification();
    main.player.text.destroy();
    const respawnCoords = Player.getRespawnCoordinates();
    setTimeout(function() {
      main.player.physics.setPosition(respawnCoords.x, respawnCoords.y);
      main.crosshair.setPosition(respawnCoords.x, respawnCoords.y);
    }, 4500)

    setTimeout(function() {
      main.player.physics.visible = true;
      main.player.text = main.add.bitmapText(respawnCoords.x, respawnCoords.y - 16, 'pixel', Client.playerData.name, 8, 'center');
      main.player.text.setOrigin(0.5);
    }, 5250)

    setTimeout(function() {
      main.player.data.health = 1;
      disableControl = false;
    }, 5500)
  },

  getRespawnCoordinates() {
    const x = Math.floor((Math.random() * config.mapOptions.width) + 50);
    const y = Math.floor((Math.random() * config.mapOptions.height) + 50);

    // TODO: Check if the position has a collider (wall) on it, so player does not spawn in a wall.

    return {x: x, y: y}
  }
}