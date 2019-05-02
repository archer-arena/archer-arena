/*
  Global game configurations
*/
var config = 
{
  gameOptions: {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.CENTER_BOTH,
      parent: 'game-container',
      resolution: 1,
      width: window.outerWidth,
      height: window.outerHeight,
    },
    physics: 'arcade',
    updateTime: 3
  },

  playerOptions: {
    arrowSpeed: 300,
    controls: {
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    }
  },

  mapOptions: {
    width: 1024,
    height: 1024,
    type: null // Map type... Desert/Snow/etc?
  }
};