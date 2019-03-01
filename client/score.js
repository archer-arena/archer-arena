var Score = {

    initialize: function(main) {
        var leaderboard = {
            you: main.player,
            players: main.otherPlayers,
            scoreArr: {}
        }

        scoreArr = you.push(players);
    },

    sortScore: function() {
        for (var i = 0; i < scoreArr.length; i++) {
            scoreArr[i].score;
        }
        scoreArr.sort(function(a, b){return b - a});
        scoreArr[0].isFirst = true;
    },

    update (main){
        sortScore();
    }
}