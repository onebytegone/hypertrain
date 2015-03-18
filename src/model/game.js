var redis = require("redis").createClient(),
    _ = require("underscore");

var Game = {};

Game.fetchGame = function(ident) {
   if (!ident) {
      ident = this.generateIdentifier();
   }

   var gameModel = this.loadGame(ident);

   console.log('Game ident: '+gameModel.ident);

   return gameModel;
};

Game.loadGame = function(ident) {
   var gameModel = {
      'ident': ident,
      'players': [],
      'turn': -1,
      'complete': false,
      'winner': null,
   };

   redis.get(this.dbKey(gameModel.ident), function(err, reply) {
      // reply is null when the key is missing. (i.e. new game)
      if (reply) {
         // copy saved values over the default game states
         _.each(reply, function (value, key) {
            if (value) {
               gameModel[key] = value;
            }
         });
      }
   });

   return gameModel;
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

