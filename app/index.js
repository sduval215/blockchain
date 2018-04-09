//required packages
const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');

//assign port variable
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//instantiate express application as app
const app = express();
//instanstiate blockchain class
const blockchain = new Blockchain();

//middleware(s)
app.use(bodyParser.json());

//first endpoint of '/blocks' 
//GET method to return all blocks in the chain
app.get('/blocks', (req, res) => {
    //send json response of blockchain's chain
    res.json(blockchain.chain);
}) 

app.post('/mine', (req,res) => {
    //create/add new block using blockchain.addBlock() method - req.body.data as user input data
    const block = blockchain.addBlock(req.body.data);
    console.log(`new block added ${block.toString()}`);
    //redirect to /blocks endpoint to update block and list it as a response after POST
    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
    console.log(`listening on port ${HTTP_PORT}`);
})