'use strict'

const Transaction = require('../models/Transaction');
const userCache = require('../util/cache/user');

class UserController extends userCache {
    
    /* Function to get transactions of a user. Caching is enabled in order to provide faster results.
    * @param {string} userHash 
    */
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
                if(transactions.length>0){
                    // transactions found
                    userCache.setUserTransactions(userHash,transactions);
                    res.status(200).json({transactions:transactions});
                }
                else{
                    // transactions were not present
                    res.status(200).json({response:"No transactions found!"});
                }
                
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