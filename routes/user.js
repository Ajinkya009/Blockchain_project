'use strict';

const express = require('express');
const UserController = require('../controllers/user');


var router = express.Router();

router.post('/getTransactions/', UserController.getTransactions);

module.exports = router;
