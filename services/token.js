const pumpfunFactoryService = require("./pumpfunfactoryService");
const pumpfunService = require("./pumpfunService");
const tokenService = {
    async createToken(wallet,name,symbol,ethAmount) {
        let address = await pumpfunFactoryService.createToken(wallet.private_key,name,symbol,wallet.address,ethAmount);
        return address;
    },

    async buyToken(wallet,token,slippage,ethAmount) {
        await pumpfunService.buy(wallet,token,slippage,ethAmount);
    },

    async sellToken(wallet,coin,slippage,tokenAmount) {
        await pumpfunService.sell(wallet,coin,slippage,tokenAmount);
    },
    async maxEthtoBuy(token) {
        let maxEth = await pumpfunService.getMaxEthToBuy(token);
        return maxEth;
    },
    async getCurrentTokenPrice(token) {
        let price = await pumpfunService.getCurrentTokenPrice(token);
        return price;
    },
    async calculateTokenAmount(token,ethAmount) {
        let tokenAmount = await pumpfunService.calculateTokenAmount(token,ethAmount);
        return tokenAmount;
    },
    async calculateEthAmount(token,tokenAmount) {
        let ethAmount = await pumpfunService.calculateEthAmount(token,tokenAmount);
        return ethAmount;
    }
}

module.exports = tokenService;