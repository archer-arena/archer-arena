const game = new Phaser.Game({
  type: config.gameOptions.type,
  width: config.gameOptions.width,
  height: config.gameOptions.height,
  parent: config.gameOptions.parent,
  physics: {
    default: config.gameOptions.physics,
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    extend: {
      player: null
    }
  }
});

/*
  Similiar to Unity's "Awake()" function
  Is called before create()
*/
function preload()
{

}

/*
  Similiar to Unity's "Start()" function
  Is called after preload, but before update()
*/
function create()
{
  Player.initialize(this);
}

/*
  Similiar to Unity's "Update()" function
  Is continuously called.
*/
function update()
{

}