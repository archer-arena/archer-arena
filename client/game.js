const game = new Phaser.Game({
  type: config.gameOptions.type,
  width: config.gameOptions.width,
  height: config.gameOptions.height,
  scene: {
    preload: preload,
    create: create,
    update: update
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

}

/*
  Similiar to Unity's "Update()" function
  Is continuously called.
*/
function update()
{

}