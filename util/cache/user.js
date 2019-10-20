const redisUrl = require('../../config/keys').redisUrl;
const redis = require('redis').createClient(redisUrl);
const lru = require('redis-lru');
const userCache = lru(redis,20); // initialize lru cache with capacity of storing 20 transactions

class CacheFactory{
    
    static async getUserTransactions(userHash){
        try{
            const transactions = await userCache.get(userHash);
            return transactions;
        }
        catch(err){
            console.log(err);
        }
    }

    static async setUserTransactions(userHash,transactions){
        try{
            userCache.set(userHash,transactions);
            return;
        }
        catch(err){
            console.log(err);
        }
        
    }

    static async clearCache(){
        try{
            userCache.reset();
        }
        catch(err){
            console.log(err);
        }
    }

    static async closeClient(){
        try{
            redis.end();
        }
        catch(err){
            console.log(err);
        }
    }

}

module.exports = CacheFactory;
