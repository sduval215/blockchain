//BLOCK CLASS FILE

//required packages
const SHA256 = require('crypto-js/sha256');

class Block {
    //necessary arguments for block - hash, lastHash, timeStamp
    constructor(timeStamp, lastHash, hash, data){
       this.hash = hash;
       this.lastHash = lastHash;
       this.timeStamp = timeStamp;
       this.data = data;
    }

    /**
     * toString function - logs out all pertinent block data
     */
    toString() {
        return `Block -
            Timestamp: ${this.timeStamp}
            Lash Hash: ${this.lastHash.substring(0,15)}
            Hash     : ${this.hash.substring(0,15)}
            Data     : ${this.data}`;
    }

    /**
     * static genesis function - creates genesis block
     */
    static genesis() {
        //return reference to Block with genesis argument data
        return new this('Genesis Time', '------', 'first hash', [])
    }

    /**
     * mineBlock function - linking blocks together based
     * on inputted parameters
     * @param {object} lastBlock 
     * @param {array} data 
     */
    static mineBlock(lastBlock, data) {
        //generate timestamp
        const timestamp = Date.now();
        //create lastHash constant set as lastBlock's hash
        const lastHash = lastBlock.hash;
        //set hash based on static hash function
        const hash = Block.hash(timestamp, lastHash, data);

        return new this (timestamp, lastHash, hash, data);
    }

    /**
     * hash function - returns SHA256 encrypted hash based
     * on inputted parameters
     * @param {string} timestamp 
     * @param {string} lastHash 
     * @param {array} data 
     */
    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }
}

//export Block class
module.exports = Block;