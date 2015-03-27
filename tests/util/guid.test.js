var expect = require("expect.js"),
    guid = require('../../src/util/guid');

describe('guid', function() {
   describe('#validate()', function() {
      it('should return true when valid', function() {
         expect(guid.validate('4e0631f0-91b1-a375-d56e-e647f08191f2')).to.be.ok();
         expect(guid.validate('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')).to.be.ok();
      })
      it('should return false when invalid', function() {
         expect(guid.validate('zzzzzzzz-bbbb-cccc-dddd-eeeeeeeeeeee')).to.not.be.ok();
         expect(guid.validate('aaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')).to.not.be.ok();
         expect(guid.validate('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeee')).to.not.be.ok();
         expect(guid.validate('7689689')).to.not.be.ok();
         expect(guid.validate('ijogheobuwogube')).to.not.be.ok();
         expect(guid.validate('------------------------------------')).to.not.be.ok();
      })
   })
})
