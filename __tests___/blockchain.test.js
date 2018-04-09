const Block = require('../block');
const Blockchain = require('../blockchain');

describe('Blockchain', () => {
    //instantiate variables
    let blockchain, genesisBlock, data;
    beforeEach(() => {
        //set dummy genesis block
        genesisBlock = Block.genesis();
        //instantiate dummy blockchain
        blockchain = new Blockchain();
        //instantiate a second dummy blockchain
        blockchain2 = new Blockchain();
        //set dummy data
        data = 'foo'
    })
    it('adds genesis block as first block', () => {
        expect(blockchain.chain[0]).toEqual(genesisBlock);
    })
    it('adds proper `data` on addBlock', () => {
        blockchain.addBlock(data);
        expect(blockchain.chain[1].data).toEqual('foo');
    })
    it('validates a valid chain', () => {
        blockchain2.addBlock('foo');
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
    })
    it('invalidates a chain with a corrupt genesis block', () => {
        //manually corrupt genesis block data of the second dummy chain
        blockchain2.chain[0].data = 'Bad data';
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    })
    it('invalidates a corrupt chain', () => {
        //add block to second dummy chain 
        blockchain2.addBlock('foo');
        //change genesis + 1 block data to something other than original data to misalign hash
        blockchain2.chain[1].data = 'Not foo';
        //should return false by Block.blockHash() conditional 
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    })
    it('replaces current chain with a longer chain', () => {
        //add new block - therefore elongating the chain - of second dummy blockchain
        blockchain2.addBlock('foo');
        //second chain is longer than first and valid, should replace chains
        blockchain.replaceChain(blockchain2.chain)
        expect(blockchain.chain).toEqual(blockchain2.chain);
    })
    it('does not replace current chain with a shorter chain', () => {
        //add new block - therefore elongating the chain - of first dummy blockchain
        blockchain.addBlock('bar');
        //first chain is longer than first and valid - should not be replaced by second
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).not.toEqual(blockchain2.chain)
    })
    it('does not replace a longer AND invalid chain', () => {
        //add new block - therefore elongating the chain - of the second blockchain
        blockchain2.addBlock('foo')
        //change genesis + 1 block data to corrupt and render Block.hashBlock false
        blockchain2.chain[1].data = 'not foo'
        //second chain is longer but NOT valid - should not be replaced then
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    })
})