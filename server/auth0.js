var request = require("request");

module.exports = {
  register: function(req, res) {
    data = req.body;
    var options = { 
      method: 'POST',
      url: 'https://archer-arena.auth0.com/dbconnections/signup',
      headers: { 'content-type': 'application/json' },
      body: { 
        client_id: 'B6JBK9ctCtdXZg2diqe_Kd1OxoPdgqWq',
        email: data.email,
        password: data.password,
        connection: 'Username-Password-Authentication',
        user_metadata: {} 
      },
      json: true
    };

    request(options, function (error, resp, body) {
      if (error) throw new Error(error);
      else {
        res.send(body);
      }
    });
  },

  login: function(req, res) {
    var options = { 
      method: 'GET',
      url: 'https://archer-arena.auth0.com/authorize',
      headers: { 'content-type': 'application/json' },
      body: { 
        client_id: 'B6JBK9ctCtdXZg2diqe_Kd1OxoPdgqWq',
        response_type: 'token',
        connection: 'Username-Password-Authentication',
        redirect_uri: '/redirect'
      },
      json: true
    };

    request(options, function (error, resp, body) {
      if (error) throw new Error(error);
      else {
        res.send(body);
      }
    });
  }
}
