var redis = require("redis").createClient(),
    _ = require("underscore"),
    debug = require('debug')('player');

var guid = require('../util/guid');

var Player = {};
Player.config = {};

Player.dbKey = function (name, key) {
   return 'player:' + name + ( key ? ':'+key : '');
};

Player.allPlayers = function(callback) {
   redis.keys(this.dbKey('*'), function(err, replies) {
      if (replies) {
         redis.mget(replies, function (err, reply) {
            var players = _.map(reply, function (item) {
               return JSON.parse(item);
            });

            callback(players);
         });
      } else {
         callback([]);
      }
   });
};

Player.nameIsAvailable = function(name, callback) {
   this.allPlayers(function (players) {
      var names = _.map(players, function (item) {
         return item.name;
      });

      debug(names.indexOf(name));

      callback(names.indexOf(name) === -1);
   });
};

Player.newPlayer = function(name) {
   var ident = guid();
   redis.set(this.dbKey(ident), JSON.stringify({
      'ident': ident,
      'name': name
   }));

   debug('created player: '+ident);

   return ident;
};

Player.archivePlayer = function(ident) {
   var self = this;
   redis.get(this.dbKey(ident), function(err, reply) {
      if (reply) {
         debug('archiving player: '+ident);
         redis.set('archived:'+self.dbKey(ident), reply);
      }

      debug('removing old key for player: '+ident);
      redis.del(self.dbKey(ident));
   });
};

module.exports = Player;

