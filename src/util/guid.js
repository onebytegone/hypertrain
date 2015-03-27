/**
 * A guid generator
 *
 * Generator Source:
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */

var guid = function() {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   }

   return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

guid.validate = function(id) {
   return id.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi);
};

module.exports = guid;
