//BLOCK CLASS FILE

//required packages
const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    //necessary arguments for block - hash, lastHash, timeStamp
    constructor(timeStamp, lastHash, hash, data, nonce, difficulty){
       this.hash = hash;
       this.lastHash = lastHash;
       this.timeStamp = timeStamp;
       this.data = data;
       this.nonce = nonce;
       this.difficulty = difficulty || DIFFICULTY;
    }

    /**
     * toString function - logs out all pertinent block data
     */
    toString() {
        return `Block -
            Timestamp : ${this.timeStamp}
            Lash Hash : ${this.lastHash.substring(0,15)}
            Hash      : ${this.hash.substring(0,15)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}`;
    }

    /**
     * static genesis function - creates genesis block
     */
    static genesis() {
        //return reference to Block with genesis argument data
        return new this('Genesis Time', '------', 'first hash', [], 0, DIFFICULTY)
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
        //get difficulty of last block
        let { difficulty } = lastBlock;
        //set nonce value
        let nonce = 0;
        /* 
            generate new hash value(s) WHILE the created hash value
            created DOES NOT have the stated DIFFICULTY value of trailing zero(es)
        */
        do {
            //increment nonce value
            nonce++;
            //recreate timestamp on every loop for valid time signature
            timestamp = Date.now();
            //set difficulty based on calculation from mine rates and timestamp(s)
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            //set hash based on static hash function
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substr(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    /**
     * hash function - returns SHA256 encrypted hash based
     * on inputted parameters
     * @param {string} timestamp 
     * @param {string} lastHash 
     * @param {array} data 
     */
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    /**
     * blockHash function - returns same SHA256 encrypted hash based on inputted block object
     * @param {object} block 
     */
    static blockHash(block) {
        const { timeStamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timeStamp, lastHash, data, nonce, difficulty);
    }

    /**
     * adjustDifficulty function - adjusts difficulty value based on the value
     * differences between the timestamp and mine rates
     * @param {*} lastBlock 
     * @param {*} timestamp 
     */
    static adjustDifficulty(lastBlock, currentTime) { 
        //get lastBlock.difficulty
        let { difficulty } = lastBlock;
        //adjust difficulty based on timestamps and mine rate difference value(s)
        difficulty = (lastBlock.timeStamp + MINE_RATE) > currentTime ? difficulty + 1 :  difficulty - 1;
        return difficulty;
    }
}

//export Block class
module.exports = Block;