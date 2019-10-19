'use strict';

let mongoose = require("mongoose");
let transactionSchema = new mongoose.Schema({
	from: {type: String, index:true},
	to: {type: String, index:true},
	hash: {type: String},
	blockNumber: Number
});

let Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;