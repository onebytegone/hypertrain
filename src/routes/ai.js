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


router.get('/dev-new-game', function (req, res) {
   game.createGame(function (gameModel) {
      sendReply(res, gameModel, []);
   });
});

router.get('/board', function (req, res) {
   var ident = null;
   if (req.body.token) {
      var jwtData = jwt.decode(req.body.token);
      ident = jwtData.ident;
   }

   game.fetchGame(ident, function(gameModel) {
      if (gameModel) {
         var jwtData = {
            'ident': gameModel.ident
         };
         var pkg = {
            'map': gameModel.board
         };
         sendReply(res, pkg, jwtData);
      }else {
         sendError(res, 400, 'no game with given identifier found');
      }
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

var sendError = function (res, code, errorMsg) {
   res.status(code).jsonp({
      'meta': {
         'error': code,
         'reason': errorMsg
      },
      'payload': {}
   });
}


module.exports = router;
