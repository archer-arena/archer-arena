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
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
    extend: {
      player: null,
      otherPlayers: {},
      arrows: {},
      otherArrows: {},
      otherPlayers: {},
      crosshair: null
    }
  }
});


let player;
var timer = 0;
let showDebug = false; 
let score;
let worldLayer;


/*
  Similiar to Unity's "Awake()" function
  Is called before create()
*/
function preload()
{
  //-----PLAYER-----//
  this.load.spritesheet('archer_blk', 'assets/graphics/player/player_black.png',
    { frameWidth: 15, frameHeight: 16 });
  this.load.spritesheet('archer_blu', 'assets/graphics/player/player_blue.png',
    { frameWidth: 15, frameHeight: 16 });
  this.load.spritesheet('archer_grn', 'assets/graphics/player/player_green.png',
    { frameWidth: 15, frameHeight: 16 });
  this.load.spritesheet('archer_pnk', 'assets/graphics/player/player_pink.png',
    { frameWidth: 15, frameHeight: 16 });
  this.load.spritesheet('archer_prp', 'assets/graphics/player/player_purple.png',
    { frameWidth: 15, frameHeight: 16 });
  this.load.spritesheet('archer_red', 'assets/graphics/player/player_red.png',
    { frameWidth: 15, frameHeight: 16 });
  this.load.spritesheet('arrow_sprite','assets/graphics/player/arrow_sprite.png',
    { frameWidth: 16, frameHeight: 10});

  this.load.image('bounty_skull', 'assets/graphics/player/bounty_skull.png');
  this.load.image('test_shape', 'assets/graphics/player/test_shape.png');

  //-----MAP-----//
  /* --OLD MAP--
  this.load.image('map_base', 'assets/graphics/map/map_base.png');
  this.load.image('map_layer1', 'assets/graphics/map/large_layer1.png');
  this.load.image('map_layer2', 'assets/graphics/map/large_layer2.png');
  this.load.image('map_layer3', 'assets/graphics/map/large_layer3.png');
  */

  this.load.image('tileset', 'assets/graphics/map/tilemaps/tiles_packed.png');
  this.load.tilemapTiledJSON('map','assets/graphics/map/Room Template/test_map.json');
  


  //-----UI-----//
  this.load.image('crosshair', 'assets/graphics/ui/crosshair.png');
  this.load.image('button', 'assets/graphics/ui/button.png');
  this.load.image('button_toggle', 'assets/graphics/ui/button_toggle.png');
  this.load.image('controls', 'assets/graphics/ui/controls.png');
  this.load.image('box', 'assets/graphics/ui/menu_bg.png');
  this.load.image('box_selection', 'assets/graphics/ui/menu_selection.png');
  this.load.image('stamina_bar', 'assets/graphics/ui/StaminaBar.png');
  this.load.image('title', 'assets/graphics/ui/title.png');
  this.load.image('background', 'assets/graphics/ui/title_bckgnd.png');
  this.load.image('tag', 'assets/graphics/ui/title_tag.png');
  this.load.image('ui_arrow', 'assets/graphics/ui/ui_arrow.png');
  this.load.image('ui_arrow_sml', 'assets/graphics/ui/uiArrow.png');
}

/*
  Similiar to Unity's "Start()" function
  Is called after preload, but before update()
*/
function create()
{
  Client.initializeConnection();

  /* -- OLD MAP -- 
  this.add.image(400, 300, 'map_layer1');
  this.add.image(400, 300, 'map_layer2');
  this.add.image(400, 300, 'map_layer3');
  */

  const map = this.make.tilemap({key: 'map'})
  const tileset = map.addTilesetImage('tiles_packed', 'tileset');

  const belowLayer = map.createStaticLayer('ground', tileset, 0, 0);
  worldLayer = map.createStaticLayer('wall', tileset, 0, 0);

  worldLayer.setCollisionByProperty({collides: true});

  //For Debug
 /*
  const debugGraphics = this.add.graphics().setAlpha(0.75);
  world.renderDebug(debugGraphics, {
  	tileColor: null, 
  	collidingTileColor: new Phaser.Display.Color(243, 134,48,255),
  	faceColor: new Phaser.Display.Color(40, 39, 37, 255)
  });
 */

  this.anims.create({
      key: 'right', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer_blk', { start: 0, end: 2}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.anims.create({
      key: 'left', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer_blk', { start: 3, end: 5}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.anims.create({
      key: 'down', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer_blk', { start: 6, end: 8}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.anims.create({
      key: 'up', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer_blk', { start: 9, end: 11}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  Player.initialize(this);

  this.physics.add.collider(this.player.physics, worldLayer);
  
  //Debug Graphics
  /*
  this.input.keyboard.once('keyboard_D', event => {
  	this.physics.world.createDebugGraphic();

  	const graphics = this.add
  		.graphics()
  		.setAlpha(0.75)
  		.setDepth(20);

  	world.renderDebug(graphics, {
  		tileColor: null,
  		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
  		faceColor: new Phaser.Display.Color(40, 39, 37, 255)
  	});
  });
  */
  //Score.initialize(this);
  //Score.sortScore();
}

/*
  Similiar to Unity's "Update()" function
  Is continuously called.
*/
function update()
{
  /*
    Timer will increment 1 frame, we will run the update set whenever it meets the...
    config file's updateTimer. 
  */
  if(Client.roomData) {
    timer++;
    if(timer >= config.gameOptions.updateTime) {
      Player.update(this);
      Arrow.update(this);
      // console.log("game.js => Hi im updating lul");
      Client.sendPlayerData(this.player.data);
      Client.sendArrowData(this.arrows);
      Client.fetchRoomData();
      Player.updateOtherPlayers(this, Client.roomData);
      Arrow.updateOtherArrows(this, Client.roomData);
      timer = 0;
    }
  }
  //this.crosshair.body.velocity.x = this.player.body.velocity.x;
  //this.crosshair.body.velocity.y = this.player.body.velocity.y;
  //Player.constrainCrosshair(this.crosshair, this.player);
}