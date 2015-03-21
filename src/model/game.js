var redis = require("redis").createClient(),
    _ = require("underscore"),
    debug = require('debug')('game');

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
      'players': [],
      'date': new Date().getTime()
   };

   // Load game data
   redis.get(this.dbKey(gameModel.ident), function(err, reply) {
      // reply is null when the key is missing. (i.e. new game)
      if (reply) {
         var formatted = JSON.parse(reply);
         // copy saved values over the default game states
         _.each(formatted, function (value, key) {
            if (value) {
               gameModel[key] = value;
            }
         });
      }else {
         // Create new game
         gameModel.board = board.generateBoard(Game.config.board.width, Game.config.board.height);
         Game.saveGame(gameModel);
      }

      callback(gameModel);
   });
};

Game.saveGame = function(gameModel) {
   console.log(gameModel);
   redis.set(this.dbKey(gameModel.ident), JSON.stringify(gameModel));
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

Game.allGames = function(callback) {
   debug('starting listing all games');

   redis.keys('*', function(err, replies) {
      var gameList = [];

      if (replies) {
         redis.mget(replies, function (err, reply) {
            var games = _.map(reply, function (item) {
               var game = JSON.parse(item);
               debug(game);

               return {
                  'ident': game.ident,
                  'complete': game.complete,
                  'date': game.date,
               };
            });

            callback(games);
         });
      };
   });

   debug('done querying for all games');
};

module.exports = Game;

