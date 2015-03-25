var express = require('express'),
    jwt = require("jwt-simple"),
    config = require("config"),
    debug = require('debug')('ai');

var game = require("../model/game"),
    player = require("../model/player");

var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
     console.log('Time: ', Date.now());
       next();
})

// define the home page route
router.get('/', function(req, res) {
   res.send('Birds home page');
})

// define the about route
router.get('/move', function(req, res) {
   res.send('Move');
})


router.get('/dev-new-game', function (req, res) {
   game.createGame(function (gameModel) {
      sendReply(res, gameModel, []);
   });
});

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


router.delete('/register', function (req, res) {
   if (req.headers.token) {
      debug('Has token: '+req.headers.token);

      parseJWT(req.headers.token, function(jwtData) {
         // valid jwt
         player.archivePlayer(jwtData.ident);

         res.status(200).jsonp({
            meta: {
               code: 200,
            },
            payload: {}
         });
      }, function () {
         // invalid jwt
         res.status(400).jsonp({
            meta: {
               code: 400,
               error: 'bad token'
            },
            payload: {}
         });
      });
   }else {
      debug('not authorized: '+req.headers.token);
      res.status(403).jsonp({
         meta: {
            code: 403,
            error: 'unauthorized'
         },
         payload: {}
      });
   }
});

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




router.get('/board', function (req, res) {
   var ident = null;
   if (req.body.token) {
      var jwtData = jwt.decode(req.body.token);
      ident = jwtData.ident;
   }

   game.fetchGame(ident, function(gameModel) {
      if (gameModel) {
         var jwtData = {
            'ident': gameModel.ident
         };
         var pkg = {
            'map': gameModel.board
         };
         sendReply(res, pkg, jwtData);
      }else {
         sendError(res, 400, 'no game with given identifier found');
      }
   });

});

var sendReply = function(res, payload, jwtData) {
   var token = jwt.encode(jwtData, config.get('jwt.secret'))

   res.json({
      'meta': {
         'token': token
      },
      'payload': payload
   });
};

var sendError = function (res, code, errorMsg) {
   res.status(code).jsonp({
      'meta': {
         'error': code,
         'reason': errorMsg
      },
      'payload': {}
   });
}

var parseJWT = function (token, success, failed) {
   var data = null;
   try {
      data = jwt.decode(token, config.get('jwt.secret'));
      success(data);
   } catch(err) {
      debug('bad jwt: '+token);
      failed();
   }
}


module.exports = router;
