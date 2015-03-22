// Filename: versions/v1.js

var express = require('express');
var router = express.Router();

var ai = require('../src/routes/ai');
router.use('/ai', ai);

var spectator = require('../src/routes/spectator');
router.use('/spectator', spectator);

module.exports = router;
