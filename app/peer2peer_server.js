//required packages
const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

//create P2PServer class
class P2PServer {
    //accepts a single blockchain passed - to be used for all purposes in the server
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    /**
     * Listen function - creates a new websocket instance that listens on P2P_PORT
     */
    listen() {
       //instantiate websocket server  
       const server = new Websocket.Server({ port: P2P_PORT });
       //server eventListener on connection event
       server.on('connection', (socket) => { this.connectSocket(socket) });
       //connect to peers
       this.connectToPeers();

       console.log(`Listening for peer-to-peer connections on ${P2P_PORT}`);
    }

    /**
     * connectToPeers function - handle connectiosn for each peer in array
     */
    connectToPeers() {
        peers.forEach(peer => {

            //create new socket using particular peer 
            const socket = new Websocket(peer);

            //on successfully opening a socket connection
            socket.on('open', () => {
                //handle connection
                this.connectSocket(socket);
            })
        })
    }

    /**
     * connectSocket function - handles on successfull connection event
     * @param {*} socket 
     */
    connectSocket(socket) {
        //push socket to total sockets array
        this.sockets.push(socket);
        console.log('socket connected');

        //handle messages on successfull connection
        this.messageHandler(socket);

        this.sendChain(socket);
    }

    /**
     * messagesHandler function - handles on message event
     * @param {*} socket 
     */
    messageHandler(socket) {
        socket.on('message', (message) => {
            //transform stringified JSON to object
            let data = JSON.parse(message);
            //handle blockchain update 
            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket) {
        //send blockchain to all other sockets 
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChains() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        })
    }
}

module.exports = P2PServer;