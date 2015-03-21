var express = require('express'),
    jwt = require("jwt-simple"),
    config = require("config"),
    game = require("../model/game");

var router = express.Router();


// define the home page route
router.get('/', function(req, res) {
   game.allGames(function (games) {
      res.jsonp(games);
   });
})

module.exports = router;
