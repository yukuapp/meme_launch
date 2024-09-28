const ethers = require('ethers');
const fs = require('fs');
// const { BASE_PROVIDER } = require("../config");
const { MANTA_PROVIDER } = require("../config");
const { resolve } = require('path')
const provider = new ethers.providers.JsonRpcProvider(MANTA_PROVIDER);
function getAbi(contract_name) {
    const json = JSON.parse(fs.readFileSync(`${resolve('./')}/contract/${contract_name}.json`));
    return json.abi;
}
const contractService = {

    getContract(contract_name, contract_address, private_key) {
        const abi = getAbi(contract_name);
        const wallet = new ethers.Wallet(private_key, provider);
        const contract = new ethers.Contract(contract_address, abi, wallet);
        return contract;
    },
    getAnonymousContract(contract_name, contract_address) {
        const abi = getAbi(contract_name);
        let contract = new ethers.Contract(contract_address, abi, provider);
        return contract;
    },
    async getEthBalance(address) {
        let balance = await provider.getBalance(address);
        return balance;
    }
}

module.exports = contractService;