var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/signup', require('./signup.js'));
router.use('/signin', require('./signin.js'));
router.use('/refresh', require('./refresh.js'));


module.exports = router;
