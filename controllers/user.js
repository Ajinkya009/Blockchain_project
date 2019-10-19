'use strict'

const ObjectID = require('mongodb').ObjectID;
const Transaction = require('../models/Transaction');

async function getTransactions(req,res){
    const userHash = req.body.userHash;
    try{
        let transactions = await Transaction.aggregate([
            {$match:
                {$or:
                    [
                        {from:userHash},
                        {to:userHash}
                    ]
                }
            }
        ]);
        res.status(200).json({transactions:transactions});
    }
    catch(err){
        res.status(500).json({error:err});
    }
    
}

module.exports = {
    getTransactions: getTransactions
}