
var express = require('express');

var app = express();
var ai = require('./src/routes/ai');

app.get('/', function (req, res) {
     res.send('Hello World!');
});

app.use('/ai', ai);

app.listen(3000);
console.log('listening on port 3000');
