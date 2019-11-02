var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/info', require('./info.js'));

module.exports = router;
