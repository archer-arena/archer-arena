var Arrow = {

    initialize: function(main, shooter, target) {
      var arrow = {
        physics: main.physics.add.sprite(shooter.x, shooter.y, 'arrow_sprite'),
        data: {
          key: socket.id + '-' + Math.random().toString(36).substr(2, 5),
          xSpeed: 0,
          ySpeed: 0,
          rotation: 0,
          life: 0,
          maxLife: 10000
        }
      }
      arrow.physics.body.allowRotation = false;

      var direction = Math.atan((target.x-shooter.x)/(target.y-shooter.y));
      if (target.y >= shooter.y) {
        arrow.data.xSpeed = config.playerOptions.arrowSpeed*Math.sin(direction);
        arrow.data.ySpeed = config.playerOptions.arrowSpeed*Math.cos(direction);
      }
      else {
        arrow.data.xSpeed = -config.playerOptions.arrowSpeed*Math.sin(direction);
        arrow.data.ySpeed = -config.playerOptions.arrowSpeed*Math.cos(direction);
      }

      arrow.physics.setVelocity(arrow.data.xSpeed, arrow.data.ySpeed)
      arrow.physics.rotation = Phaser.Math.Angle.Between(shooter.x, shooter.y, target.x, target.y);
      arrow.data.rotation = arrow.physics.rotation;
      main.arrows[arrow.data.key] = arrow.data;
    },

    update: function (main) {
      for(let key in main.arrows) {
        main.arrows[key] = {
          belongsTo: socket.id,
          xSpeed: main.arrows[key].xSpeed,
          ySpeed: main.arrows[key].ySpeed,
          rotation: main.arrows[key].rotation,
          life: main.arrows[key].life + 1,
          maxLife: main.arrows[key].maxLife
        }
      }
    },

    updateOtherArrows: function (main, roomData) {
       
      for(let key in roomData.arrows) {
        playerKey = key.substring(0, key.length - 6);
        if(socket.id != playerKey) {

          // Check if player is in the game. If not, don't draw arrows.
          if(!(playerKey in main.otherPlayers)) {
            continue;
          }

          // If the roomData does not have a object for a player, create one
          if(!(key in main.otherArrows)) {
            var x = main.otherPlayers[playerKey].x;
            var y = main.otherPlayers[playerKey].y;
            main.otherArrows[key] = main.physics.add.sprite(x, y, 'arrow_sprite');
            main.otherArrows[key].setVelocity(roomData.arrows[key].xSpeed, roomData.arrows[key].ySpeed)
            main.otherArrows[key].rotation = roomData.arrows[key].rotation;
          } else {
            // Check collision?
          }
        }
      }

      // Check for arrows that have expired
      for(let key in main.otherArrows) {
        if(!(key in roomData.arrows)) {
          main.otherArrows[key].destroy();
          delete main.otherArrows[key];
        }
      }
    }
}