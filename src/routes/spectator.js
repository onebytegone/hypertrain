var express = require('express'),
    jwt = require("jwt-simple"),
    config = require("config"),
    game = require("../model/game"),
    guid = require("../util/guid"),
    debug = require('debug')('spectator');

var router = express.Router();

// define the base page route
router.get('/', function(req, res) {
   game.allGames(function (games) {
      res.jsonp(games);
   });
});

// define the game page route
router.get('/:gameident', function(req, res) {
   game.fetchGame(req.gameident, function(gameModel) {
      if (gameModel) {
         res.jsonp(gameModel);
      }else {
         res.status(400).jsonp({ error: 'invalid game identifier: ['+req.gameident+']' });
      }
   });
});

// route middleware to validate :gameident
router.param('gameident', function(req, res, next, gameident) {
   debug('validating gameident: ['+gameident+']');

   if (guid.validate(gameident)) {
      req.gameident = gameident;
      next();
   }else {
      debug('gameident ['+gameident+'] is not valid');
      res.status(400).jsonp({ error: 'invalid game identifier: ['+gameident+']' });
   }
});


module.exports = router;
