var expect = require("expect.js"),
    game = require('../../src/model/game');

describe('Game', function() {
   describe('Database Key', function() {
      it('should return the custom ident with the prefix "game:"', function() {
         expect(game.dbKey('')).to.be('game:');
         expect(game.dbKey('asdf')).to.be('game:asdf');
         expect(game.dbKey('da31b79b-bcd1-4d68-a426-6a01d064a462')).to.be('game:da31b79b-bcd1-4d68-a426-6a01d064a462');
      })
      it('should return the extra key with the ident and prefix "game:"', function() {
         expect(game.dbKey('', '')).to.be('game:');
         expect(game.dbKey('', 'a')).to.be('game::a');
         expect(game.dbKey('ident', null)).to.be('game:ident');
         expect(game.dbKey('asdf', 'key')).to.be('game:asdf:key');
         expect(game.dbKey('da31b79b-bcd1-4d68-a426-6a01d064a462', 'board')).to.be('game:da31b79b-bcd1-4d68-a426-6a01d064a462:board');
      })
   })
})
