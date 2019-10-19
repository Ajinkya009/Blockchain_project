'use strict';

var express = require('express');
var controller = require('../controllers/user');


var router = express.Router();

router.post('/getTransactions/', controller.getTransactions);

module.exports = router;
