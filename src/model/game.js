var redis = require("redis").createClient(),
    _ = require("underscore");

var board = require('./board');

var Game = {};

Game.config = {};
Game.config.board = {
   'width': 15,
   'height': 15
};

/**
 * Fetches an existing game from the database. If it
 * doesn't exist, it will create a new one.
 *
 * @param ident string - identifier for the game
 * @param callback function - passed the game model array
 */
Game.fetchGame = function(ident, callback) {
   var gameModel = {
      'ident': ident ? ident : Game.generateIdentifier(),
      'players': [],
      'turn': -1,
      'complete': false,
      'winner': null,
      'board': [],
      'players': []
   };

   // Load game data
   redis.get(this.dbKey(gameModel.ident), function(err, reply) {
      // reply is null when the key is missing. (i.e. new game)
      if (reply) {
         // copy saved values over the default game states
         _.each(reply, function (value, key) {
            if (value) {
               gameModel[key] = value;
            }
         });
      }else {
         gameModel.board = board.generateBoard(Game.config.board.width, Game.config.board.height);
      }

      callback(gameModel);
   });
};

Game.generateIdentifier = function() {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   }
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

Game.dbKey = function (ident, key) {
   return 'game:' + ident + ( key ? ':'+key : '');
};

module.exports = Game;

