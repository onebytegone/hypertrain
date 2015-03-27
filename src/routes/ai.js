var express = require('express'),
    jwt = require("jwt-simple"),
    config = require("config"),
    guid = require("../util/guid"),
    debug = require('debug')('ai');

var game = require("../model/game"),
    player = require("../model/player");

var router = express.Router();


// **************************************************
// JWT Processing
// **************************************************

var requireToken = function(next) {
   return function (req, res) {
      var fail = function () {
         debug('invalid token: '+req.headers.token);
         res.status(403).jsonp({
            meta: {
               code: 403,
               error: 'unauthorized'
            },
            payload: {}
         });
      };

      if (req.headers.token) {
         debug('has token: '+req.headers.token);
         parseJWT(req.headers.token, function(tokenData) {
            req.jwt = tokenData;
            next(req, res);
         }, fail);
      }else {
         fail();
      }
   };
};

var parseJWT = function (token, success, failed) {
   var data = null;
   try {
      data = jwt.decode(token, config.get('jwt.secret'));
   } catch(err) {
      debug('bad jwt: '+token+' error: '+err);
      failed();
      return;
   }

   success(data);
};


// **************************************************
// Routes
// **************************************************

router.get('/', function(req, res) {
   res.send('Welcome to the AI endpoint');
})


router.put('/join', requireToken( function (req, res) {
   game.fetchPendingGame(function(pending) {
      var joinGame = function (gameModel) {
         debug('Joining game: '+gameModel.ident);
         if (gameModel) {
            gameModel = game.addPlayer(gameModel, req.jwt.ident);
            game.saveGame(gameModel);

            if (game.isGameFull(gameModel)) {
               game.startGame(gameModel);
            }

            res.status(200).jsonp({
               meta: {
                  code: 200
               },
               payload: {
                  'gameident': gameModel.ident
               }
            });
         }else {
            serverError('could not join pending game');
         }
      };

      if(pending) {
         debug('joining existing game');
         game.fetchGame(pending, joinGame);
      }else {
         debug('creating new game');
         game.createGame(joinGame);
      }
   });
}));


router.post('/register/:teamname', function (req, res) {
   var teamname = req.params.teamname;
   player.nameIsAvailable(teamname, function (isAvailable) {
      if (isAvailable) {
         var ident = player.newPlayer(teamname);

         var token = jwt.encode({
            'teamname': teamname,
            'ident': ident
         }, config.get('jwt.secret'))

         res.status(201).jsonp({
            meta: {
               code: 201
            },
            payload: {
               'token': token
            }
         });
      }else {
         res.status(409).jsonp({
            meta: {
               code: 409,
               error: 'teamname is already in use'
            },
            payload: {}
         });
      }
   });

});


router.delete('/register', requireToken(function (req, res) {
   player.archivePlayer(req.jwt.ident);

   res.status(200).jsonp({
      meta: {
         code: 200,
      },
      payload: {}
   });
}));


router.get('/board', requireToken(function (req, res) {
   res.send('Board');
}));


router.get('/move', requireToken(function(req, res) {
   res.send('Move');
}));



// **************************************************
// Param validators
// **************************************************

// route middleware to validate :teamname
router.param('teamname', function(req, res, next, teamname) {
   debug('validating teamname: ['+teamname+']');

   if (teamname.match(/[0-9a-z]+/gi)) {
      next();
   }else {
      debug('teamname ['+teamname+'] is not valid');

      res.status(400).jsonp({
         meta: {
            code: 400,
            error: 'invalid teamname: ['+teamname+']'
         },
         payload: {}
      });
   }
});


// route middleware to validate :gameident
router.param('gameident', function(req, res, next, gameident) {
   debug('validating gameident: ['+gameident+']');

   if (guid.validate(gameident)) {
      req.gameident = gameident;
      next();
   }else {
      debug('gameident ['+gameident+'] is not valid');

      res.status(404).jsonp({
         meta: {
            code: 404,
            error: 'game not found'
         },
         payload: {}
      });
   }
});



// **************************************************
// Helper functions
// **************************************************

var serverError = function (res, msg) {
   res.status(500).jsonp({
      meta: {
         code: 500,
         error: msg
      },
      payload: {}
   });
}

module.exports = router;
