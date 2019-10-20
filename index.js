process.env.UV_THREADPOOL_SIZE = 4;
let blockChain = require('./util/blockchain');
const mongoose = require('mongoose');
const config = require('./config/keys.js');
const express = require('express');
const helmet  = require('helmet');


if(process.env.NODE_ENV!='ci'){
  // Connect to database
  mongoose.connect(config.mongoURI,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true});

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', async() => {
    console.log('Mongoose default connection open to ' + config.mongoURI);
    let bc = new blockChain();
    bc.initiateDataFetchAndUpload();
  });

  // If the connection throws an error
  mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });

  const gracefulExit = function() {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection with DB :' + config.mongoURI + ' is disconnected through app termination');
      process.exit(0);
    });
  }

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
}

// Setup server
const app = express();

// use helmet to protect app from some well known web vulnerabilities
app.use(helmet());

if(process.env.NODE_ENV!='ci'){
  const server = require('http').createServer(app);
  // Start server
  server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    //console.log(mongoose.connection.readyState);
  });
}
require('./config/setup')(app);
require('./routes/index')(app);

// Expose app
exports = module.exports = app;