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
  joinFeed: [],
  killFeed: [],

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
    GUI.joinFeed.forEach(text => {
      length = GUI.joinFeed.length;
      if(text.object == null) {
        text.object = main.add.text(config.gameOptions.scale.width - 500, (config.gameOptions.scale.height / 2) + (length * 16), text.text, {fontSize: 24});
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
  }
}