import { LoaderParser, Bullet } from "phaser-ce";

var Arrow = {
    initialize: function(main) {
        var arrow = main.physics.add.sprite(40, 10, 'nothing');
        arrow.anchor.set(0.5);
        arrow.body.allowRotation = false;
    }

    function createArrow() {
        arrows = game.add.group();
        arrows.enableBody = true;
        arrows.physicsBodyType = Phaser.Physics.ARCADE;

        //can change ammo count
        arrows.createMultiple(20, 'arrow');

        //when arrow is off map, it should disappear or stop at map edge
        arrows.callAll('events.onOutOfBounds.add', 'events.onOut', resetArrow);
        arrows.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
        arrows.setAll('checkWorldBounds', true);
        //callAll and setAll loop over every arrow object

        sprite = game.add.sprite 
    }

    function resetArrow(arrow) {
        arrow.kill();
    }

    function updateArrow() {
        arrow.rotation = game.physics.arcade.angleToPointer(arrow);
        if (game.input.activePointer.leftButton.isDown) {
            fireArrow();
        }
    }

    function fireArrow() {
        if (arrows.countDead() > 0) {
            var ammo = arrows.getFirstDead();
            ammo.reset(sprite.x - 8, sprite.y - 8);
            game.physics.arcade.moveToPointer(ammo, 300);
        }
    }
}