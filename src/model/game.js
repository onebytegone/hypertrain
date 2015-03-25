var redis = require("redis").createClient(),
    _ = require("underscore"),
    debug = require('debug')('game');

var board = require('./board'),
    player = require('./player'),
    guid = require('../util/guid');

var Game = {};

Game.config = {};
Game.config.board = {
   'width': 15,
   'height': 15
};

/**
 * Fetches an existing game from the database. If it
 * doesn't exist, value sent to callback will be false.
 *
 * @param ident string - identifier for the game
 * @param callback function - passed the game model array. passed false if game doesn't exist
 */
Game.fetchGame = function(ident, callback) {
   // request game data
   redis.get(this.dbKey(ident), function(err, reply) {
      var gameModel = {};
      if (reply) {
         var formatted = JSON.parse(reply);
         // copy saved values over the default game states
         _.each(formatted, function (value, key) {
            if (value) {
               gameModel[key] = value;
            }
         });
      }else {
         // reply is null when the key is missing. (i.e. game doesn't exist)
         gameModel = false;
      }

      callback(gameModel);
   });
};

/**
 * Creates a new game.
 *
 * @param ident string - identifier for the game
 * @param callback function - passed the game model array. passed false if game doesn't exist
 */
Game.createGame = function(callback) {
   var gameModel = {
      'ident': Game.generateIdentifier(),
      'players': [],
      'turn': -1,
      'complete': false,
      'winner': null,
      'board': [],
      'players': [],
      'date': new Date().getTime()
   };

   // Create new game
   gameModel.board = board.generateBoard(Game.config.board.width, Game.config.board.height);
   Game.saveGame(gameModel);

   // While we could return `gameModel`, using a
   // callback keeps the same form as fetch game.
   callback(gameModel);
};

Game.saveGame = function(gameModel) {
   console.log(gameModel);
   redis.set(this.dbKey(gameModel.ident), JSON.stringify(gameModel));
};

Game.generateIdentifier = function() {
   return guid();
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

