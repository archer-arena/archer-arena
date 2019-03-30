var Score = {

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

    update (main){
    }
}