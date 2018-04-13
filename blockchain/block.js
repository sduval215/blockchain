//BLOCK CLASS FILE

//required packages
const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

class Block {
    //necessary arguments for block - hash, lastHash, timeStamp
    constructor(timeStamp, lastHash, hash, data, nonce){
       this.hash = hash;
       this.lastHash = lastHash;
       this.timeStamp = timeStamp;
       this.data = data;
       this.nonce = nonce;
    }

    /**
     * toString function - logs out all pertinent block data
     */
    toString() {
        return `Block -
            Timestamp: ${this.timeStamp}
            Lash Hash: ${this.lastHash.substring(0,15)}
            Hash     : ${this.hash.substring(0,15)}
            Nonce    : ${this.nonce}
            Data     : ${this.data}`;
    }

    /**
     * static genesis function - creates genesis block
     */
    static genesis() {
        //return reference to Block with genesis argument data
        return new this('Genesis Time', '------', 'first hash', [], 0)
    }

    /**
     * mineBlock function - linking blocks together based
     * on inputted parameters
     * @param {object} lastBlock 
     * @param {array} data 
     */
    static mineBlock(lastBlock, data) {
        //declare hash and timestamp variable
        let hash, timestamp ;
        //create lastHash constant set as lastBlock's hash
        const lastHash = lastBlock.hash;
        //set nonce value
        let nonce = 0;

        /* 
            generate new hash value(s) WHILE the created hash value
            created DOES NOT have the stated DIFFICULTY value of trailing zero(es)
        */
        do {
            //increment nonce value
            nonce++;
            //set hash based on static hash function
            hash = Block.hash(timestamp, lastHash, data, nonce);
            //recreate timestamp on every loop for valid time signature
            timestamp = Date.now();
        } while (hash.substr(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this(timestamp, lastHash, hash, data, nonce);
    }

    /**
     * hash function - returns SHA256 encrypted hash based
     * on inputted parameters
     * @param {string} timestamp 
     * @param {string} lastHash 
     * @param {array} data 
     */
    static hash(timestamp, lastHash, data, nonce) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
    }

    /**
     * blockHash function - returns same SHA256 encrypted hash based on inputted block object
     * @param {object} block 
     */
    static blockHash(block) {
        const { timeStamp, lastHash, data, nonce } = block;
        return Block.hash(timeStamp, lastHash, data, nonce);
    }
}

//export Block class
module.exports = Block;