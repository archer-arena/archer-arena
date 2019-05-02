const game = new Phaser.Game({
  type: config.gameOptions.type,
  width: config.gameOptions.width,
  scale: config.gameOptions.scale,
  physics: {
    default: config.gameOptions.physics,
    arcade: {
      gravity: { y: 0 }
    }
  },
  pixelArt: true,
  scene: [{
    preload: preload,
    create: create,
    update: update,
    extend: {
      player: null,
      otherPlayers: {},
      arrows: {},
      otherArrows: {},
      otherPlayers: {},
      crosshair: null,
      otherArrowsCollisionGroup: null
    }
  }, UI]
});


let player;
let initialized = false;
var timer = 0;
let showDebug = false; 
let score = false;
let arrowKey = '';
let worldLayer; 
let forcedUpdate = false;
let crown = null;
let firstPlayer = '';


/*
  Similiar to Unity's "Awake()" function
  Is called before create()
*/
function preload()
{

  //-----PLAYER-----//
  this.load.spritesheet('archer', 'assets/graphics/player/player.png',
  { frameWidth: 16, frameHeight: 16 });
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

  this.load.image('bounty_crown', 'assets/graphics/player/bounty_crown.png');
  this.load.image('test_shape', 'assets/graphics/player/test_shape.png');

  //-----MAP-----//

  //this.load.image('tileset', 'assets/graphics/map/tilemaps/tiles_packed.png');
  this.load.image('tileset', 'assets/graphics/map/tilemaps/snow-expansion.png');
  //this.load.tilemapTiledJSON('map','assets/graphics/map/Room Template/test_map.json');
  //this.load.tilemapTiledJSON('map_desert','assets/graphics/map/Room Template/map_ctf_desert.json');
  this.load.tilemapTiledJSON('map_snow','assets/graphics/map/Room Template/map_ctf.json');

  //----FONT----//
  this.load.bitmapFont('pixel', 'assets/fonts/pixel.png', 'assets/fonts/pixel.xml');
  

  //-----UI-----//
  this.load.image('crosshair', 'assets/graphics/ui/crosshair.png');
  this.load.image('reloading', 'assets/graphics/ui/reloading.png');
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

  const map = this.make.tilemap({key: 'map_snow'})
  const tileset = map.addTilesetImage('snow-expansion', 'tileset');

  const belowLayer = map.createStaticLayer('ground', tileset, 0, 0);
  worldLayer = map.createStaticLayer('wall', tileset, 0, 0);
  const aboveLayer = map.createStaticLayer('above', tileset, 0, 0);

  worldLayer.setCollisionByProperty({collides: true});
  aboveLayer.setDepth(10);

  /*
  const debugGraphics = this.add.graphics().setAlpha(0.75);
  worldLayer.renderDebug(debugGraphics, {
  	tileColor: null, 
  	collidingTileColor: new Phaser.Display.Color(243, 134,48,255),
  	faceColor: new Phaser.Display.Color(40, 39, 37, 255)
  });
  */
  this.anims.create({
      key: 'right', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer', { start: 0, end: 2}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.anims.create({
      key: 'left', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer', { start: 3, end: 5}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.anims.create({
      key: 'down', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer', { start: 6, end: 8}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.anims.create({
      key: 'up', //animation for the right direction of movement
      frames: this.anims.generateFrameNumbers('archer', { start: 9, end: 11}), //utilize the first 3 images of the spritesheet
      frameRate: 10, //run this animation at the rate of 10 frames per second
      repeat: -1, //-1 = loop animation
  });

  this.otherArrowsCollisionGroup = this.physics.add.group({
    key: 'arrow_sprite',
    frameQuantity: 4,
  });
  
  crown = this.physics.add.sprite(0, 0, 'bounty_crown');

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
    const self = this;
    if(!this.player && !initialized) {
      Player.initialize(this);
      this.physics.add.collider(this.player.physics, worldLayer);
      // player vs arrow collider
      this.physics.add.overlap(this.player.physics, this.otherArrowsCollisionGroup, function(pSprite, aSprite) {
        for(let key in self.otherArrows) {
          if(self.otherArrows[key] == aSprite) {
            let shooterId = key.slice(0, -6);
            if(self.player.data.health != 0) {
              self.player.data.health--;
              self.player.physics.visible = false;
              Client.sendHitData(shooterId, key);
              Player.waitForRespawn(self);
              break;
            }
          }
        }
      });
      initialized = true;
    }

    if(this.player) {
      this.player.text.x = this.player.physics.x;
      this.player.text.y = this.player.physics.y - 16;
      this.crosshair.body.velocity = this.player.physics.body.velocity;
      Player.move(this);
    }

    for(let key in Client.roomData.sockets) {
      if(socket.id != key && this.otherPlayers[key]) {
        this.otherPlayers[key].text.x = this.otherPlayers[key].x;
        this.otherPlayers[key].text.y = this.otherPlayers[key].y - 16;

        if(firstPlayer == key && crown) {
          if(!crown.visible)
            crown.visible = true;
          crown.x = this.otherPlayers[firstPlayer].x;
          crown.y = this.otherPlayers[firstPlayer].y - 26;
        }
      } else {
        if(socket.id == firstPlayer && crown) {
          if(!crown.visible)
            crown.visible = true;
          crown.x = this.player.physics.x;
          crown.y = this.player.physics.y - 26;
        }
      }

    }

    timer++;
    if(timer >= config.gameOptions.updateTime) {
      Player.update(this);
      Arrow.update(this);
      Client.sendPlayerData(this.player.data);
      Client.sendArrowData(this.arrows);
      Client.fetchRoomData();
      if(!forcedUpdate) {
        Player.updateOtherPlayers(this, Client.roomData);
        Arrow.updateOtherArrows(this, Client.roomData);
      }
      timer = 0;
      
      for(let key in this.otherArrows) {
        if (this.otherArrows[key].x < this.player.physics.x + 12 &&
          this.otherArrows[key].x + 12 > this.player.physics.x &&
          this.otherArrows[key].y < this.player.physics.y + 12 &&
          this.otherArrows[key].y + 12 > this.player.physics.y) 
        {
          let shooterId = key.slice(0, -6);
          if(this.player.data.health != 0) {
            this.player.data.health--;
            this.player.physics.visible = false;
            Client.sendHitData(shooterId, key);
            Player.waitForRespawn(this);
            break;
          }
        }
      }
    }

    if(forcedUpdate) {
      Player.updateOtherPlayers(this, Client.roomData);
      Arrow.updateOtherArrows(this, Client.roomData);
      forcedUpdate = false;
    }

    if(score) {
      this.player.data.score++;
      this.arrows[arrowKey].data.life = 100;
      this.arrows[arrowKey].physics.destroy();
      score = false;
    }
  }
  //this.crosshair.body.velocity.x = this.player.body.velocity.x;
  //this.crosshair.body.velocity.y = this.player.body.velocity.y;
  //Player.constrainCrosshair(this.crosshair, this.player);
}