var express = require('express'),
    jwt = require("jwt-simple"),
    config = require("config"),
    game = require("../model/game"),
    debug = require('debug')('spectator');

var router = express.Router();

// define the base page route
router.get('/', function(req, res) {
   game.allGames(function (games) {
      res.jsonp(games);
   });
})

// define the game page route
router.get('/:gameident', function(req, res) {
   game.fetchGame(req.gameident, function(gameModel) {
      res.jsonp({
         'meta': {
            'code': 200
         },
         'payload': {
            'game': gameModel
         }
      });
   });
})

// route middleware to validate :gameident
router.param('gameident', function(req, res, next, gameident) {
   debug('validating gameident: ['+gameident+']');

   if (gameident.match(/[[:xdigit:]]*/g)) {
      req.gameident = gameident;
      next();
   }else {
      debug('gameident ['+gameident+'] is not valid');

      res.jsonp({
         'meta': {
            'error': 'invalid game identifier',
            'code': 400
         },
         'payload': {}
      });
   }
});


module.exports = router;
