var express = require('express');
var router = express.Router();

// /* GET home page. */
router.use('/order', require('./order.js'));
router.use('/detail', require('./detail.js'));
router.use('/enroll', require('./enroll.js'));


module.exports = router;
