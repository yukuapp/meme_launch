const { ethers } = require("ethers");
const { MNEMONIC } = require("../config");
const walletService = {
    generate(tid) {
        const hdNode = ethers.utils.HDNode.fromMnemonic(MNEMONIC,ethers.wordlists.en,tid);
        let wallet = new ethers.Wallet(hdNode.privateKey);
        const address = wallet.address;
        const private_key = wallet.privateKey;
        if(address == undefined || private_key == undefined) {
            return;
        }
        return {address,private_key};
    }
}

module.exports = walletService;