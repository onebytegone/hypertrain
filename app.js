
var express = require('express'),
    bodyParser = require('body-parser'),
    redis = require("redis"),
    config = require("config");

var redisClient = redis.createClient(),
    app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.send('&lt;all good&gt;');
});

var ai = require('./src/routes/ai');
app.use('/ai', ai);

var spectator = require('./src/routes/spectator');
app.use('/spectator', spectator);

app.listen(3000);
console.log('listening on port 3000');
