var Arrow = {

    initialize: function(main, shooter, target) {
      var arrow = {
        physics: main.physics.add.sprite(shooter.x, shooter.y, 'nothing'),
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
          arrow.xSpeed = config.playerOptions.arrowSpeed*Math.sin(direction);
          arrow.ySpeed = config.playerOptions.arrowSpeed*Math.cos(direction);
      }
      else {
          arrow.xSpeed = -config.playerOptions.arrowSpeed*Math.sin(direction);
          arrow.ySpeed = -config.playerOptions.arrowSpeed*Math.cos(direction);
      }
      main.arrows.push(arrow);
      //socket.emit('AddNewArrow', {roomId: id, arrow: arrow});
    },

    updateArrow: function (arrow, delta) {
      arrow.data = {
        x: arrow.physics.x,
        y: arrow.physics.y,
        velocity: arrow.physics.body.velocity,
        xSpeed: arrow.data.xSpeed,
        ySpeed: arrow.data.ySpeed,
        rotation: arrow.data.rotation,
        life: arrow.data.life + delta,
        maxLife: arrow.data.maxLife
      }

      arrow.physics.x = arrow.data.xSpeed * delta;
      arrow.physics.y = arrow.data.ySpeed * delta;
    },

    updateOtherArrows: function (main, delta, life) {

    }
}