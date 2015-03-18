var express = require('express'),
    config = require("config");

var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
     console.log('Time: ', Date.now());
       next();
})

// define the home page route
router.get('/', function(req, res) {
     res.send('Birds home page');
})

// define the about route
router.get('/about', function(req, res) {
     res.send('About birds');
})

// define a test JWT route
router.get('/jwt', function(req, res) {
   // this will be stored in redis
   req.jwtSession.user = { 'color': 'blue' };

   // this will be attached to the JWT
   var claims = {
      iss: config.get('jwt.issuer'),
      aud: config.get('jwt.audience')
   };

   // Create JWT and add to reponse
   req.jwtSession.create(claims, function(error, token){
      res.json({ token: token });
   });
});

module.exports = router;
