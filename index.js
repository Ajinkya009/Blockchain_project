process.env.UV_THREADPOOL_SIZE = 4;
let blockChain = require('./util/blockchain');
const perf = require('execution-time')();
var mongoose = require('mongoose');
var config = require('./config/dev.js');
let bc = new blockChain();


// Connect to database
mongoose.connect(config.mongoURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + config.mongoURI);
  async function func(){
    perf.start();
    await bc.getTransactionDataOfLatestBlocks(10);
    const results = perf.stop();
    console.log(results.preciseWords);
    }

    func();
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

var gracefulExit = function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection with DB :' + config.mongoURI + ' is disconnected through app termination');
    process.exit(0);
  });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);




