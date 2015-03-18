
var express = require('express'),
    JWTRedisSession = require("jwt-redis-session"),
    redis = require("redis"),
    config = require("config");

var redisClient = redis.createClient(),
    app = express();

app.use(JWTRedisSession({
   client: redisClient,
   secret: config.get('jwt.secret'),
   keyspace: "sess:",
   maxAge: 86400,
   algorithm: "HS256",
   requestKey: "jwtSession",
   requestArg: "jwtToken"
}));

app.get('/', function (req, res) {
   res.send('Hello World!');
});

var ai = require('./src/routes/ai');
app.use('/ai', ai);

app.listen(3000);
console.log('listening on port 3000');
