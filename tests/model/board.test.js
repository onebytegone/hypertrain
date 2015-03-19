var expect = require("expect.js"),
    board = require('../../src/model/board');

describe('Board', function() {
   describe('#generateBoard()', function() {
      it('should return a board of desired size', function() {
         expect(board.generateBoard(0,0).length).to.be(0);
         expect(board.generateBoard(5,5).length).to.be(5);
         expect(board.generateBoard(10,10).length).to.be(10);
         expect(board.generateBoard(10,10)[0].length).to.be(10);
         expect(board.generateBoard(10,10)[9].length).to.be(10);
      })
      it('should be filled with open char from config', function() {
         expect(board.generateBoard(1,1)[0][0]).to.be(board.config.markers.free);
      })
   })
   describe('#isAvailable()', function() {
      var boardData = [
         [ board.config.markers.free, board.config.markers.free ],
         [ board.config.markers.free, board.config.markers.full ]
      ];
      it('should return true when avaliable', function() {
         expect(board.isAvailable(boardData, 0, 0)).to.be.ok();
         expect(board.isAvailable(boardData, 1, 0)).to.be.ok();
      })
      it('should return false when not avaliable', function() {
         expect(board.isAvailable(boardData, 1, 1)).to.not.be.ok();
      })
      it('should return false when out of bounds', function() {
         expect(board.isAvailable(boardData, 3, 0)).to.not.be.ok();
         expect(board.isAvailable(boardData, 0, 3)).to.not.be.ok();
         expect(board.isAvailable(boardData, -1, 0)).to.not.be.ok();
         expect(board.isAvailable(boardData, 0, -1)).to.not.be.ok();
      })
   })
})
