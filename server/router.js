const router = require('express').Router(); 
var auth = require('./auth0');

module.exports = function (app) {
    // Registration
    router.route('/register')
      .post(auth.register)
  
    app.use('/api', router);
  }