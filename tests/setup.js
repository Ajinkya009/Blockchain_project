const config = require('../config/dev.js');
const express = require('express');
const helmet  = require('helmet');


// Setup server
const app = express();

require('../config/setup')(app);
require('../routes/index')(app);

// Expose app
exports = module.exports = app;