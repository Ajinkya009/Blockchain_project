'use strict';

let mongoose = require("mongoose");
var Schema = mongoose.Schema;
let UserSchema = new mongoose.Schema({
	hash: {type: String, index:true},
	transactions: [{id:{type:Schema.Types.ObjectId, ref:'Transaction'},_id:false}]
});

let User = mongoose.model('User', UserSchema);

module.exports = User;