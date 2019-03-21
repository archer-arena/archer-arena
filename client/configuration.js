/*
  Global game configurations
*/
console.log(Phaser);
var config = 
{
  gameOptions: {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      parent: 'game-container',
      resolution: 1,
      width: window.outerWidth * window.devicePixelRatio,
      height: window.outerHeight * window.devicePixelRatio,
    },
    physics: 'arcade',
    updateTime: 10
  },

  playerOptions: {
    arrowSpeed: 200,
    controls: {
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    }
  },

  mapOptions: {
    width: 480,
    height: 480,
    type: null // Map type... Desert/Snow/etc?
  }
};