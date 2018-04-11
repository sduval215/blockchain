//required packages
const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2PServer = require('./peer2peer_server');

//assign port variable
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//instantiate express application as app
const app = express();
//instanstiate blockchain class
const blockchain = new Blockchain();
//instantiate peer2peer server class
const p2pServer = new P2PServer(blockchain);

//middleware(s)
app.use(bodyParser.json());

//first endpoint of '/blocks' 
//GET method to return all blocks in the chain
app.get('/blocks', (req, res) => {
    //send json response of blockchain's chain
    res.json(blockchain.chain);
}) 

//second endpoint of '/mine'
//POST method to add block to blockchain based on user input (req.body.data)
app.post('/mine', (req,res) => {
    //create/add new block using blockchain.addBlock() method - req.body.data as user input data
    const block = blockchain.addBlock(req.body.data);
    console.log(`new block added ${block.toString()}`);

    p2pServer.syncChains();

    //redirect to /blocks endpoint to update block and list it as a response after POST
    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
})
p2pServer.listen();