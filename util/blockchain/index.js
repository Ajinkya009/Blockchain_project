let Web3 = require('web3');
var _ = require('lodash');
const perf = require('execution-time')();
const _cliProgress = require('cli-progress');
const async = require('async');
const mongoose = require('mongoose');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
var ObjectID = require('mongodb').ObjectID;

class BlockChain{

    constructor(){
         this.web3 = new Web3('https://kovan.infura.io/v3/f67e11d1b3374b67b4873bca077eb482');
         this.transactionData = [];
         this.totalCount = 0;
    }

    async indexTransactionData(transactions,index){
        //console.log(index);
        
    }

    /*Function to get transaction data of multiple blocks.
    *@param {Array} an array of block numbers
    *@returns {Array} an array of transaction data of all blocks
    */
    async getBulkTransactionData(blockNumbers,bar1){
        try{
            let batch = new this.web3.BatchRequest();
            let w3 = this.web3;
            let that = this;
            let promises = blockNumbers.map(bn=>{
                return new Promise((resolve,reject)=>{
                    let req = w3.eth.getBlock.request(bn,true,(err,data)=>{
                        if(err) reject(err);
                        else{
                            if(data.transactions.length>0){
                                data.transactions.map((transaction)=>{
                                    const trans = {
                                        from:transaction.from,
                                        to:transaction.to,
                                        hash:transaction.hash,
                                        blockNumber:transaction.blockNumber
                                    };
                                    Transaction.create(trans);
                                    resolve();
                                })
                            }
                            else{
                                resolve();
                            }
                            
                        }
                    });
                    batch.add(req);
                });
            });
            batch.execute();
            Promise.all(promises);
            return;
        }    
        catch(err){
            console.log(err);
        }
    }

    /*Function to get transaction data of multiple latest consecutive blocks.
    *@param {number} totalBlocks - total number of consecutive blocks for which the transaction data has to be generated
    *@returns {Array} an array of transaction data of all latest consecutive blocks
    */
    async getTransactionDataOfLatestBlocks(totalBlocks){
        try{
            let latest = await this.web3.eth.getBlockNumber(); // get latest block number
            const bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);
            bar1.start(totalBlocks, 0);
            for(let i=0;i<totalBlocks;i+=10){
                const blockNumbers = _.range(latest - 10, latest, 1);
                await this.getBulkTransactionData(blockNumbers);
                bar1.update(i+10);
                latest = latest - 10;
            }
            bar1.stop();
            return;
        }
        catch(err){
            console.log(err);
        }
    }
    
}

module.exports = BlockChain;