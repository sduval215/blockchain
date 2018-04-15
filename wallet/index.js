const { INITIAL_BALANCE } = require('../config'); 
const ChainUtil = require('../chain-util');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair(); //generates public/private keypairs
        this.publicKey = this.keyPair.getPublic().encode('hex'); //return public key in hex format
    }

    /**
     * toString function - returns all pertinent information of Wallet
     */
    toString(){
       return `Wallet -
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`
    }
}


module.exports = Wallet;