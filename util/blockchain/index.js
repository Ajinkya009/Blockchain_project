let Web3 = require('web3');
var _ = require('lodash');
const Transaction = require('../../models/Transaction');
const _cliProgress = require('cli-progress');
 
class BlockChain{

    constructor(){
         this.web3 = new Web3('https://kovan.infura.io/v3/f67e11d1b3374b67b4873bca077eb482');
    }

    
    /*Helper function to get transaction data of multiple blocks.
    *Batch processes multiple blocks to avoid multiple network calls.
    *@param {Array} an array of block numbers
    */
    async getBulkTransactionData(blockNumbers,index){
        try{
            let batch = new this.web3.BatchRequest();
            let w3 = this.web3;
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
                                });
                            }
                            resolve(index+1);
                        }
                    });
                    batch.add(req);
                });
            });
            batch.execute();
            return Promise.all(promises);
            
        }    
        catch(err){
            console.log(err);
        }
    }

    /*Function to get transaction data of multiple latest consecutive blocks.
    *@param {number} totalBlocks - total number of consecutive blocks for which the transaction data has to be generated
    */
    async getTransactionDataOfLatestBlocks(totalBlocks){
        try{
            let latest = await this.web3.eth.getBlockNumber(); // get latest block number

            console.log("Started fetching and uploading data.");
            console.log(`Total blocks: ${totalBlocks} and total batches: ${totalBlocks/200}`);
            
            // create a new progress bar instance and use shades_classic theme
            const bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);

            // start the progress bar with a total value of totalBlocks and start value of 0
            bar1.start(totalBlocks/200, 0);
            
            //process multiple blocks at a time. 200 blocks in a single batch provided fast results
            for(let i=0;i<totalBlocks;i+=200){
                const blockNumbers = _.range(latest - 200, latest, 1);
                let index = await this.getBulkTransactionData(blockNumbers,(i+200)/200);
                bar1.update((i+200)/200);
                latest = latest - 200;
            }
            bar1.stop();
            console.log('Finished uploading data to database.');
            return;
        }
        catch(err){
            console.log(err);
        }
    }
    
}

module.exports = BlockChain;