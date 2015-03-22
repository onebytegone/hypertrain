
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

var v1 = require('./versions/v1');
app.use('/v1', v1);

app.listen(3000);
console.log('listening on port 3000');
