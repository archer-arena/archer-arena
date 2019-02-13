var Arrow = {
    initialize: function(main) {
        var arrow = main.physics.add.sprite(40, 10, 'nothing');
        arrow.anchor.set(0.5);
        arrow.body.allowRotation = false;
    },

    createArrow: function (map) {
        Phaser.GameObjects.Image.call(this, map, 0, 0, 'arrow');
        this.speed = 2;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(6, 6, true);
    },

    fireArrow: function (shooter, target) {
        this.setPosition(shooter.x, shooter.y)
        this.direction = Math.atan((target.x-this.x)/(target.y-this.y));

        if (target.y >= this.y) {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation;
        this.born = 0;
        console.log('fireArrow');
    },

    updateArrow: function (time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    },
}