var Arrow = {

    initialize: function(main, shooter, target) {
      var arrow = {
        physics: main.physics.add.sprite(shooter.x, shooter.y, 'arrow_sprite'),
        data: {
          xSpeed: 0,
          ySpeed: 0,
          rotation: shooter.rotation,
          life: 0,
          maxLife: 0
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
      main.arrows.push(arrow);
      //socket.emit('AddNewArrow', {roomId: id, arrow: arrow});
    },

    update: function (main) {
      for(var i = 0; i < main.arrows.length; i++) {
        main.arrows[i].data = {
          x: main.arrows[i].physics.x,
          y: main.arrows[i].physics.y,
          velocity: main.arrows[i].physics.body.velocity,
          xSpeed: main.arrows[i].data.xSpeed,
          ySpeed: main.arrows[i].data.ySpeed,
          rotation: main.arrows[i].data.rotation,
          life: main.arrows[i].data.life + 1,
          maxLife: main.arrows[i].data.maxLife
        }
      }
    },

    updateOtherArrows: function (main, delta, life) {

    }
}