const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class ChainUtil {
    constructor(){

    }

    /**
     * genKeyPair function - generatese key pair values for public/private keys
     */
    static genKeyPair() {
        return ec.genKeyPair();
    }
}

module.exports = ChainUtil;