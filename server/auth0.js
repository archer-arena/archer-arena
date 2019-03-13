var request = require("request");

module.exports = {
  register: function(req, res) {
    console.log(req);
    var options = { 
      method: 'POST',
      url: 'https://archer-arena.auth0.com/dbconnections/signup',
      headers: { 'content-type': 'application/json' },
      body: { 
        client_id: 'B6JBK9ctCtdXZg2diqe_Kd1OxoPdgqWq',
        email: '',
        password: '',
        connection: 'Username-Password-Authentication',
        user_metadata: {} 
      },
      json: true 
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      res.send("It worked");
    });
  }
}