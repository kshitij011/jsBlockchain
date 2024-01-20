const SHA256 = require('crypto-js/sha256')

let currentdate = new Date();
let datetime = "Last Sync: " + currentdate.getDay() + "/" + currentdate.getMonth()+1 + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

class Block{

    constructor(index, data, previousHash = ''){
        this.index = index;
        this.timestamp = datetime;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.nonce + this.previousHash + JSON.stringify(this.data)).toString();
    }

    //Proof of work
    mineBlock(difficulty){  //loop till first n no. of 0 are preceding hash value
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "This is the genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(2);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
    }
}

let myCoin = new Blockchain();

console.log("Mining block 1...");
myCoin.addBlock(new Block(1, {amount: 4}))

console.log("Mining block 2...");
myCoin.addBlock(new Block(2, {amount: 6}))
console.log(JSON.stringify(myCoin,null, 4));


