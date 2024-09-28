const { ethers } = require("ethers");
const { logger } = require("../middlewares/logger");
const {getContract,getAnonymousContract,getEthBalance} = require("../contract/contractService");
const {formatEth,formatUnit, parseUnit} = require('../utils/ethersBigNumber');
const pumpfunService = {
    getPumpFunContract(private_key,address) {
        return getContract("PumpFun",address,private_key);
    },
    getAnonymousContract(address) {
        return getAnonymousContract("PumpFun",address);
    },
    //buy
    async buy(wallet,address,slippage,ethAmount) {
        console.log("buy:",wallet,address,slippage,ethAmount);
        let ethBalance =await getEthBalance(wallet.address);
        console.log("ethBalance:",ethBalance)
        if(ethers.utils.formatEther(ethBalance) < ethAmount) {
            throw new Error("Insufficient ETH balance");
        }
        let contract = this.getPumpFunContract(wallet.private_key,address);
        let tx = await contract.buy(slippage,{value: ethers.utils.parseEther(ethAmount)});
        await tx.wait();
        logger.log(`${wallet.address} 购买了 ${ethAmount}ETH ${address},交易详情：${tx}`)
    },
    //sell
    async sell(wallet,coin,slippage,tokenAmount) {
        let tokenBalance = await this.tokenBalanceOf(coin.token,wallet.address);
        console.log("tokenBalance:",ethers.utils.formatUnits(tokenBalance,coin.decimal),",tokenAmount:",tokenAmount)
        if(parseFloat(ethers.utils.formatUnits(tokenBalance,coin.decimal)) < parseFloat(tokenAmount)) {
            throw new Error(`Insufficient ${coin.symbol} balance`);
        }
        let contract = this.getPumpFunContract(wallet.private_key,coin.token);
        let tx = await contract.sell(ethers.utils.parseUnits(tokenAmount,coin.decimal),slippage);
        await tx.wait();
        logger.log(`${wallet.address} 售出了${tokenAmount}${coin.symbol},交易详情：${tx}`)
    },
    //balance
    async tokenBalanceOf(address,user) {
        let contract = getAnonymousContract("PumpFun",address);
        let balance = await contract.balanceOf(user);
        return balance;
    },
    //price
    async getCurrentTokenPrice(address) {
        let contract = getAnonymousContract("PumpFun",address);
        let price = await contract.getCurrentTokenPrice();
        return formatEth(price);
    },
    //number limit
    async getMaxEthToBuy(address) {
        let contract = getAnonymousContract("PumpFun",address);
        let max = await contract.getMaxEthToBuy();
        return formatEth(max);
    },
    async calculateTokenAmount(address,ethAmount) {
        let contract = getAnonymousContract("PumpFun",address);
        let tokenAmount = await contract.calculateTokenAmount(ethers.utils.parseEther(ethAmount));
        return formatUnit(tokenAmount);
    },
    async calculateEthAmount(address,tokenAmount) {
        let contract = getAnonymousContract("PumpFun",address);
        let ethAmount = await contract.calculateEthAmount(parseUnit(tokenAmount));
        return formatEth(ethAmount);
    }
}
module.exports = pumpfunService;