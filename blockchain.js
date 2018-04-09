//BLOCKCHAIN CLASS FILE

//require packages/files
const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]; //set initial chain to arrayw with genesis block
    }

    /**
     * addBlock function - adds a block to the chain 
     * @param {array} data 
     */
    addBlock(data) {
        //block variable set by Block.mineBlock() 
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        //add block to the end of the chain array
        this.chain.push(block);
        //returns block information
        return block;
    }

    /**
     * isValidChain function - checks if the incoming chain is valid - returns true or false
     * @param {*} chain 
     */
    isValidChain(chain) {
        //returns false if the genesis block on the chain is not the same as Block.genesis()
        //compare two objects by JSON.stringify
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        //for every block starting after the genesis block - i.e #1 
        for(let i = 1; i < chain.length; i++) {

            const block = chain[i];
            const lastBlock = chain[i - 1];

            //if current block hash does not equal lastBlock hash, return false (not valid)
            //or if the current block hash does not equal a valid generated hash block based on data, return false (not valid)
            if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }

        }

        //if all validations conditions are met, then return true
        return true;
    }

    /**
     * replaceChain function - replaces chain only if newChain is longer and valid
     * @param {array} newChain 
     */
    replaceChain(newChain) {
        //if the new chain is shorter than the existing chain - do nothing
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain');
            return
        //if the newChain is not valid - do nothing
        } else if (!this.isValidChain(newChain)){
            console.log('The received chain is not valid');
            return
        } 
        //otherwise, if longer and valid, then replace the existing chain 
        console.log('replacing blockchain with the new chain.');
        this.chain = newChain;
    }
}

//export Blockchain class
module.exports = Blockchain;