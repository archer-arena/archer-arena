const router = require('express').Router(); 
var auth = require('./auth0');

module.exports = function (app) {
    // Registration
    router.route('/register')
      .post(auth.register)

    // Login
    router.route('/login')
      .get(auth.login)
  
    app.use('/api', router);
  }