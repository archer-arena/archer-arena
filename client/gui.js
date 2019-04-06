class UI extends Phaser.Scene {

  constructor ()
  {
    super({ key: 'UIScene', active: true });
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

  initialize: function(main) {
    var leaderboard = {
      you: main.player,
      players: main.otherPlayers,
      scoreArr: {}
    }

    
    //scoreArr = leaderboard.you.data.push(leaderboard.players);
  },

  //edit to pass in array of scores with ids
  sortScore: function() {
    var testData = [
      {
        id: "one",
        score: 4,
        isFirst: false
      },
      {
        id: "two",
        score: 7,
        isFirst: false
      },
      {
        id: "three",
        score: 10,
        isFirst: false
      },
      {
        id: "four",
        score: 0,
        isFirst: false
      }
    ]
    testData.sort(function(a, b){return b.score - a.score});
    testData[0].isFirst = true;

    /*scoreArr.sort(function(a, b){return b - a});
    scoreArr[0].main.player.data.isFirst = true;*/
  },

  update: function(main) {
    // Join Feed
    GUI.joinFeed.forEach(text => {
      length = GUI.joinFeed.length;
      if(text.object == null) {
        text.object = main.add.bitmapText(config.gameOptions.scale.width - 350, (config.gameOptions.scale.height / 2) + (length * 24), 'pixel', text.text, 32);
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
        text.object = main.add.bitmapText(50, 25 + (length * 16), 'pixel', text.text, 32);
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
      let test = main.add.bitmapText(config.gameOptions.scale.width/2 + 50, config.gameOptions.scale.height/2 - 50, 'pixel', "You Died.\n Waiting for respawn...", 48, 'center');
      setTimeout(function() {
        test.destroy();
      }, 5000);
    }
  }
}