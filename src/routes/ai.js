var express = require('express'),
    jwt = require("jwt-simple"),
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
router.get('/move', function(req, res) {
   res.send('Move');
})

router.get('/board', function (req, res) {
   console.log(req.body);

   var ident = null;
   if (req.body.token) {
      var jwtData = jwt.decode(req.body.token);
      ident = jwtData.ident;
   }

   game.fetchGame(ident, function(gameModel) {
      var jwtData = {
         'ident': gameModel.ident
      };
      var pkg = {
         'map': gameModel.board
      };
      sendReply(res, pkg, jwtData);
   });

});

var sendReply = function(res, payload, jwtData) {
   var token = jwt.encode(jwtData, config.get('jwt.secret'))

   res.json({
      'meta': {
         'token': token
      },
      'payload': payload
   });
};

module.exports = router;
