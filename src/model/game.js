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
Game.config.movers = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ];
Game.config.maxPlayers = function() { return Game.config.movers.length; }();



/**
 * Gets the ident for the current pending game

 * @param callback function - passed the game ident. null if none pending.
 */
Game.fetchPendingGame = function(callback) {
   redis.get(this.dbKey('pending'), function(err, reply) {
      callback(reply);
   });
}

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
      'players': {},
      'date': new Date().getTime()
   };

   // Create new game
   gameModel.board = board.generateBoard(Game.config.board.width, Game.config.board.height);
   Game.saveGame(gameModel);
   redis.set(this.dbKey('pending'), gameModel.ident);

   // While we could return `gameModel`, using a
   // callback keeps the same form as fetch game.
   callback(gameModel);
};


/**
 * Moves the game to the ready state. If it is marked
 * as the pending game, this will remove that state.
 *
 * @param gameModel array
 */
Game.startGame = function(gameModel) {
   debug('starting game: '+gameModel.ident);
   var self = this;
   this.fetchPendingGame(function (pendingIdent) {
      if (pendingIdent === gameModel.ident) {
         debug('removing pending game');
         redis.del(self.dbKey('pending'));
      };
   });

   gameModel.turn = 0;
   this.saveGame(gameModel);
};


Game.saveGame = function(gameModel) {
   redis.set(this.dbKey(gameModel.ident), JSON.stringify(gameModel));
};


/**
 * Adds a new player to the given game model. This does not
 * re-save the model.
 *
 * @param gameModel array
 * @param playerIdent string - id for the player
 */
Game.addPlayer = function(gameModel, playerIdent) {
   if (this.isGameFull(gameModel.players)) {
       throw new Error("Too many players for this game");
   }

   var mover = Game.config.movers[_.keys(gameModel.players).length];
   gameModel.players[playerIdent] = mover;

   debug('new player has mover: '+mover);
   debug('total players: '+_.keys(gameModel.players).length);
   debug('player list: '+_.values(gameModel.players).join(', '));

   return gameModel;
};


/**
 * Checks to see if the given game model has its max amount
 * of players.
 *
 * @param gameModel array
 * @return boolean
 */
Game.isGameFull = function(gameModel) {
    return _.keys(gameModel.players).length >= Game.config.maxPlayers-1;
};


/**
 * Checks to see if the given game has been started
 *
 * @param gameModel array
 * @return boolean
 */
Game.hasStarted = function(gameModel) {
   return gameModel.turn >= 0;
}

Game.generateIdentifier = function() {
   return guid();
};

Game.dbKey = function (ident, key) {
   return 'game:' + ident + ( key ? ':'+key : '');
};

Game.allGames = function(callback) {
   debug('starting listing all games');

   var self = this;
   redis.keys(this.dbKey('*'), function(err, replies) {
      var gameList = [];

      if (replies) {
         // Delete pending key
         replies = _.reject(replies, function(item) {
            return item === self.dbKey('pending');
         });

         redis.mget(replies, function (err, reply) {
            var games = _.map(reply, function (item) {
               var game = JSON.parse(item);

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

