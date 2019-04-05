var Arrow = {

    initialize: function(main, shooter, target) {
      var arrow = {
        physics: main.physics.add.sprite(shooter.x, shooter.y, 'arrow_sprite'),
        data: {
          key: socket.id + '-' + Math.random().toString(36).substr(2, 5),
          x: 0,
          y: 0,
          xSpeed: 0,
          ySpeed: 0,
          rotation: 0,
          life: 0,
          maxLife: 25
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
      main.arrows[arrow.data.key] = arrow;
    },

    update: function (main) {
      for(let key in main.arrows) {
        main.arrows[key].data = {
          belongsTo: socket.id,
          x: main.arrows[key].physics.x,
          y: main.arrows[key].physics.y,
          xSpeed: main.arrows[key].data.xSpeed,
          ySpeed: main.arrows[key].data.ySpeed,
          rotation: main.arrows[key].data.rotation,
          life: main.arrows[key].data.life + 1,
          maxLife: main.arrows[key].data.maxLife
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
            main.otherArrowsCollisionGroup.add(main.otherArrows[key]);
          } else {
            main.physics.moveTo(main.otherArrows[key], roomData.arrows[key].x + roomData.arrows[key].xSpeed, roomData.arrows[key].y + roomData.arrows[key].ySpeed, 200, 1000);
          }
        }
      }

      // Check for arrows that have expired
      for(let key in main.otherArrows) {
        if(!(key in roomData.arrows)) {
          main.otherArrowsCollisionGroup.kill(main.otherArrows[key]);
          main.otherArrows[key].destroy();
          delete main.otherArrows[key];
        }
      }
    }
}