'use strict'

const Transaction = require('../models/Transaction');
const userCache = require('../util/cache/user');

class UserController extends userCache {
    
    static async getTransactions(req,res){
        try{
            const userHash = req.body.userHash;
            if(userHash==undefined) throw new Error("Invalid user hash");
            const cachedTransactions = await userCache.getUserTransactions(userHash);
            if(cachedTransactions==null){
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
                userCache.setUserTransactions(userHash,transactions);
                res.status(200).json({transactions:transactions});
            }
            else{
                res.status(200).json({transactions:cachedTransactions});
            }
            
        }
        catch(err){
            console.log(err);
            res.status(500).send(err);
        }
        
    }
    
}


module.exports = UserController;