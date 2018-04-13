const Block = require('../blockchain/block');
const { MINE_RATE } = require('../config');

//test description - Block
describe('Block', () => {
    //instantiate variables
    let data, lastBlock, block;
    //set test objects before each test - reduce redundancy
    beforeEach(() => {
        //set dummy data
        data = 'bar';
        //set dummy lastBlock to genesis block
        lastBlock = Block.genesis();
        //create dummy local block using mineBlock method
        block = Block.mineBlock(lastBlock, data);
    })
    it('sets the `data` to match the input', () => {
       expect(block.data).toEqual('bar');
    })
    it('sets the `lastHash` to match the hash of the last block', () => {
       expect(block.lastHash).toEqual(lastBlock.hash);
    })
    it('generated a hash that matched the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });
    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timeStamp + 360000))
        .toEqual(block.difficulty - 1)
    })
    it('raised the difficulty for quickly mined block', () => {
        expect(Block.adjustDifficulty(block, (block.timeStamp + 1)))
        .toEqual(block.difficulty + 1)
    })  
})