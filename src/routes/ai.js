var express = require('express'),
    config = require("config"),
    game = require("../model/game");

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

router.get('/game', function (req, res) {
   var ident = null;
   if (req.jwtSession.game) {
      ident = req.jwtSession.game.ident;
   }

   var gameModel = game.fetchGame(ident);

   res.send(gameModel.ident);
});

// define a test JWT route
router.get('/jwt', function(req, res) {
   // this will be stored in redis
   req.jwtSession.game = {};
   req.jwtSession.game.ident = 'thisisanident';

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
