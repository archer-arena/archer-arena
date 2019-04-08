class UI extends Phaser.Scene {

  constructor ()
  {
    super({ key: 'UIScene', active: true });
  }

  preload() {
    this.load.image('leaderboard', 'assets/graphics/ui/leaderboard.png');
  }

  create() {
    let leaderboard = this.physics.add.sprite(config.gameOptions.scale.width - 150, 275, 'leaderboard')
    leaderboard.setOrigin(0.5);
    leaderboard.displayWidth = 300;
    leaderboard.displayHeight = 550;
  }

  update() {
    GUI.update(this);
  }
}

var GUI = {
  deletingJoinFeed: false,
  deletingKillFeed: false,
  respawning: false,
  joinFeed: [],
  killFeed: [],
  leaderboardFeed: [],

  drawKillFeed(killer, killed) {
    length = GUI.killFeed.length;
    GUI.killFeed.push(
      {
        text: killer + ' KILLED ' + killed,
        object: null
      }
    )
  },

  drawSomeoneJoined(name) {
    length = GUI.joinFeed.length;
    GUI.joinFeed.push(
      {
        text: name + ' has joined the game',
        object: null,
        life: 0
      }
    )
  },

  drawRespawnNotification() {
    GUI.respawning = true;
  },

  updateLeaderboard: function(main) {
    GUI.leaderboardFeed.forEach(feed => {
      if(feed.textObject != null) {
        feed.textObject.destroy();
      }
    });
    GUI.leaderboardFeed = [];

    for(key in Client.roomData.sockets) {
      GUI.leaderboardFeed.push({
        id: key,
        name: Client.roomData.sockets[key].name,
        score: Client.roomData.sockets[key].score,
        textObject: null
      });
    }

    GUI.leaderboardFeed.sort(function(a, b){return b.score - a.score});
    for(var i = 0; i < GUI.leaderboardFeed.length; i++) {
      if(i < 10)
        GUI.leaderboardFeed[i].textObject = main.add.bitmapText(config.gameOptions.scale.width - 250, 10 + (i * 42), 'pixel', GUI.leaderboardFeed[i].name + ' - ' + GUI.leaderboardFeed[i].score, 28, 'center');
      else
        break;
    }
  },

  update: function(main) {
    if(Client.roomData)
      GUI.updateLeaderboard(main);
    // Join Feed
    GUI.joinFeed.forEach(text => {
      length = GUI.joinFeed.length;
      if(text.object == null) {
        text.object = main.add.bitmapText(config.gameOptions.scale.width - 350, (config.gameOptions.scale.height / 2) + (length * 24), 'pixel', text.text, 20);
      }
    });

    if(!GUI.deletingJoinFeed && GUI.joinFeed.length > 0) {
      GUI.deletingJoinFeed = true; 
      setTimeout(function() {
        var text = GUI.joinFeed.pop();
        text.object.destroy();
        GUI.deletingJoinFeed = false;
      }, 5000);
    }

    // Kill feed
    GUI.killFeed.forEach(text => {
      length = GUI.killFeed.length;
      if(text.object == null) {
        text.object = main.add.bitmapText(50, 25 + (length * 16), 'pixel', text.text, 24);
      }
    });

    if(!GUI.deletingKillFeed && GUI.killFeed.length > 0) {
      GUI.deletingKillFeed = true; 
      setTimeout(function() {
        var text = GUI.killFeed.pop();
        text.object.destroy();
        GUI.deletingKillFeed = false;
      }, 5000);
    }

    if(GUI.respawning) {
      GUI.respawning = false;
      let test = main.add.bitmapText(config.gameOptions.scale.width/2 + 50, config.gameOptions.scale.height/2 - 50, 'pixel', "You Died.\n Waiting for respawn...", 36, 'center');
      setTimeout(function() {
        test.destroy();
      }, 5000);
    }
  }
}