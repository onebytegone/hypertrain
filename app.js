
var express = require('express'),
    bodyParser = require('body-parser'),
    redis = require("redis"),
    config = require("config");

var redisClient = redis.createClient(),
    app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.send('Hello World!');
});

var ai = require('./src/routes/ai');
app.use('/ai', ai);

app.listen(3000);
console.log('listening on port 3000');
