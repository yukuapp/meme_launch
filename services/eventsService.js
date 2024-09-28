const ethers = require('ethers');
const { formatUnit,formatEth } = require('../utils/ethersBigNumber');
const { EVENT_CONTRACT_ADDRESS } = require("../config");
const tokenEventDao = require("../dao/token_events");
const tokenHolderDao = require("../dao/token_holder");
const tokenPriceDao = require("../dao/token_price");
const tokenDao = require('../dao/token');
const pumpfunService = require("../services/pumpfunService");

const { getContract, getAnonymousContract } = require("../contract/contractService");
const { logger } = require('../middlewares/logger');
const {covertTimestampToDateTime} = require("../utils/utils");

async function  updateTokenPrice(token, userETHChangeAmount, tokenChangeAmount, currentTokenPrice, timestamp) {
    let open = formatUnit(userETHChangeAmount) / formatUnit(tokenChangeAmount);
    let close = formatUnit(currentTokenPrice);
    let high = open > close ? open : close;
    let low = open > close ? close : open;
    await tokenPriceDao.insert({ token, open, close, high, low, timestamp });
}

async function addTokenBalance(token,account,amount) {
    if(token === account || account === "0x0000000000000000000000000000000000000000") {
        return;
    };
    await tokenHolderDao.addTokenBalance(token,account,amount);

};
async function reduceTokenBalance(token,account,amount) {
    if(token === account || account === "0x0000000000000000000000000000000000000000") {
        return;
    };
    await tokenHolderDao.reduceTokenBalance(token,account,amount);
}
const eventsService = {
    getContract(private_key) {
        let contract = getContract("Events", EVENT_CONTRACT_ADDRESS, private_key);
        return contract
    },
    /**
     * 监听交易
     * event PumpFunEvent(address indexed token,address account, bool isBuy, uint256 userETHChangeAmount, uint256 tokenChangeAmount, uint256 currentEthAmount, uint256 currentTokenAmount, uint256 currentTokenPrice);
     * 对于购买/出售的平均价格 计算为： userETHChangeAmount / tokenChangeAmount currentTokenPrice就是购买和出售后的最终价格 用于蜡烛图
     */
    listenPumpFunEvent() {
        let contract = getAnonymousContract("Events", EVENT_CONTRACT_ADDRESS);
        contract.on('PumpFunEvent', async (token, account, isBuy, userETHChangeAmount, tokenChangeAmount, currentEthAmount, currentTokenAmount, currentTokenPrice, event) => {
            let block = await event.getBlock();
            logger.log(`listend ${token} PumpFunEvent account : ${account} ${isBuy == true ? "buy" : "sell"},userETHChangeAmount:${userETHChangeAmount},tokenChangeAmount:${tokenChangeAmount},currentEthAmount:${currentEthAmount},currentTokenAmount:${currentTokenAmount},currentTokenPrice:${currentTokenPrice}`);
            await tokenEventDao.insert({ transaction: event.transactionHash, token, eth_amount: formatEth(userETHChangeAmount), token_amount: formatUnit(tokenChangeAmount), address :account, type: isBuy == true ? "BUY" : "SELL", timestamp: covertTimestampToDateTime(block.timestamp*1000) });
            await tokenDao.updateMarketCap(token, formatEth(userETHChangeAmount), isBuy);
            await updateTokenPrice(token, userETHChangeAmount, tokenChangeAmount, currentTokenPrice, block.timestamp);
        });
    },
    /**
     * 监听transfer
     * event PumpFunTransfer(address indexed token, address indexed from, address indexed to, uint256 amount);
     */
    listenTransfer() {
        let contract = getAnonymousContract("Events", EVENT_CONTRACT_ADDRESS);
        contract.on('PumpFunTransfer', async (token, from, to, amount) => {
        logger.log(`listend ${token} PumpFunTransfer from : ${from} to: ${to} ${amount}`);
        await addTokenBalance(token,to,formatUnit(amount));
        await reduceTokenBalance(token,from,formatUnit(amount));
        // let fromBalance = await pumpfunService.tokenBalanceOf(token,from);
        // let toBalance = await pumpfunService.tokenBalanceOf(token,to);
        // console.log(`${token} from: ${from} balance:${fromBalance},to: ${to}balance : ${toBalance}`)
        // await tokenHolderDao.upsertBalance(token,from,formatUnit(fromBalance));
        // await tokenHolderDao.upsertBalance(token,to,formatUnit(toBalance));
        });
    }
}
module.exports = eventsService;