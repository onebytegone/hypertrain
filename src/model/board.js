var _ = require("underscore");

var Board = {};

Board.config = {};
Board.config.markers = {
   'free': '_',
   'full': '#'
};

Board.generateBoard = function(width, height) {
   return _.range(width).map( function() {
      return _.range(height).map( function() {
         return Board.config.markers.free;
      });
   });
};

Board.isAvailable = function(map, x, y) {
   if (x < 0 || y < 0 || x > map.length || y > map[x].length) {
      return false;
   }

   return map[x][y] !== Board.config.markers.full;
};

module.exports = Board;

