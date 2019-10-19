//process.env.UV_THREADPOOL_SIZE = 4;
let blockChain = require('../util/blockchain');
const mongoose = require('mongoose');
const config = require('../config/dev.js');
const express = require('express');
const helmet  = require('helmet');


// Setup server
const app = express();

// use helmet to protect app from some well known web vulnerabilities
app.use(helmet());

const server = require('http').createServer(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  //console.log(mongoose.connection.readyState);
});

require('../config/setup')(app);
require('../routes/index')(app);

// Expose app
exports = module.exports = app;