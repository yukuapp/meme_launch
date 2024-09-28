const ethers = require('ethers');
const { FACTORY_CONTRACT_ADDRESS } = require('../config');
const {getContract,getAnonymousContract} = require("../contract/contractService");
const pumpfunFactoryService = {
    getFactoryContract(private_key) {
        let contract = getContract("PumpFunFactory",FACTORY_CONTRACT_ADDRESS,private_key);
        return contract
    },
    //创建bond-curve
    async createToken(private_key,name,symbol,sender,ethAmount) {
        console.log("private_key",private_key);
        let contract = this.getFactoryContract(private_key);
        let erc20_contract_address = await contract.getCreate2Address(name,symbol,sender);
        console.log("erc20_contract_address",erc20_contract_address)
        let tx;
        if (ethAmount) {
            tx = await contract.createPumpFun(name,symbol,{value: ethers.parseEther(ethAmount)})
        }else {
            tx = await contract.createPumpFun(name,symbol);
        }
        await tx.wait();
        return erc20_contract_address;
    },
     /**
     * 创建代币成功事件
     * 在Factory合约中触发
     * event CreatePumpFun(address indexed token);
     */
    listenCreatePumpFun() {
        let contract = getAnonymousContract("PumpFunFactory",FACTORY_CONTRACT_ADDRESS);
        contract.on('CreatePumpFun',(token) => {
            console.log(`listend ${FACTORY_CONTRACT_ADDRESS} CreatePumpFun address : ${token}`)
        })
    }
}
module.exports = pumpfunFactoryService;