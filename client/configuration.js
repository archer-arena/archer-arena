/*
  Global game configurations
*/
var config = 
{
  gameOptions: {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    parent: 'game-container',
    physics: 'arcade',
    updateTime: 10
  },

  playerOptions: {
    controls: {
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    }
  }
};