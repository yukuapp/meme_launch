const tokenDao = require("../dao/token");
const tokenService = require("../services/token");
const { pageDiv } = require('../utils/utils');
const tokenEventDao = require("../dao/token_events");
const tokenHolderDao = require("../dao/token_holder");
const tokenPriceDao = require("../dao/token_price");
const { ParameterException, NotFoundException,ContractException,StopTradeException } = require("../middlewares/error");
const moment = require("moment");
const tokenController = {
    async createToken(ctx, next) {
        const payload = ctx.request.body;
        const ethAmount = payload['ethAmount'];
        const name = payload['name'];
        const symbol = payload['symbol'];
        const image = payload['image'];
        const description = payload['description'];
        const telegram = payload['telegram'];
        const total_supply = payload['total_supply'] || 1e9;
        if (name == undefined || symbol == undefined || image == undefined) {
            throw new ParameterException();
        }
        const wallet = ctx.state.wallet;
        //创建合约
        const address = await tokenService.createToken(wallet, name, symbol, ethAmount);
        let token = await tokenDao.createToken(name, symbol, image, description, telegram, address, wallet.address, total_supply, wallet.address);
        ctx.code = 200;
        ctx.msg = "success";
        ctx.data = token;
        return next();
    },

    async buy(ctx, next) {
        const payload = ctx.request.body;
        const token = payload['token'];
        const slippage = payload['slippage'];
        const ethAmount = payload['ethAmount'];
        if (token == undefined || slippage == undefined || ethAmount == undefined) {
            throw new ParameterException();
        }
        const coin = tokenDao.queryTokenInfo(token);
        if(coin.market_cap >= 15) {
            throw new StopTradeException();
        };
        const wallet = ctx.state.wallet;
        await tokenService.buyToken(wallet, token, slippage, ethAmount);
        ctx.code = 200;
        ctx.msg = "buy Success";
        return next();
    },

    async sell(ctx, next) {
        const payload = ctx.request.body;
        console.log(payload)
        const token = payload['token'];
        const slippage = payload['slippage'];
        const tokenAmount = payload['tokenAmount'];
        if (token == undefined || slippage == undefined || tokenAmount == undefined) {
            ctx.code = 401;
            ctx.msag = "params error!"
            return next();
        }
        const wallet = ctx.state.wallet;
        const coin = await tokenDao.queryTokenInfo(token);
        if(coin.market_cap >= 15) {
            throw new StopTradeException();
        };
        console.log(coin)
        if(coin == undefined) {
            throw new NotFoundException();
        }
        try {
            await tokenService.sellToken(wallet, coin, slippage, tokenAmount);    
        } catch (error) {
            console.log(error.message);
            if (error.message.indexOf("Price below allowed slippage") != -1){
                throw new ParameterException("Slippage setting too small");
            }else {
                throw new ContractException(error.message);
            }
        }
        
        ctx.code = 200;
        ctx.msg = "Sell Success";
        return next();
    },

    async coin(ctx, next) {
        const token = ctx.request.params.token;
        const coin = await tokenDao.queryToken(token);
        if (coin == undefined) {
            throw new NotFoundException();
        }
        coin.image = Buffer.from(coin.image).toString('base64')
        ctx.code = 200;
        ctx.msg = "Coin Info";
        ctx.data = coin;
        return next();
    },

    async maxEthtoBuy(ctx,next) {
        const token = ctx.request.params.token;
        if (token == undefined) {
            throw new NotFoundException();
        }
        const maxEth = await tokenService.maxEthtoBuy(token);
        console.log("maxEth",maxEth);
        ctx.code = 200;
        ctx.msg = "Max Eth to Buy";
        ctx.data = maxEth;
        return next();

    },

    async coins(ctx, next) {
        const page = ctx.request.params.page || 1;
        const limit = ctx.request.params.limit || 20;
        const account = ctx.request.params.account;
        const order = ctx.request.params.order || 'desc';
        let sort = ctx.request.params.sort || 'marketCap';
        let filter = {};
        switch (sort) {
            case "marketCap":
                sort = { market_cap: order };
                break;
            case "new":
                sort = { create_time: order };
                break;
            case "myToken":
                if (account == undefined) {
                    ctx.code = 401;
                    ctx.msg = "account is null";
                    return next();
                }
                filter = { creator: account };
                break;
        }
        const search = ctx.query.search;
        const skip = limit * (page - 1);
        if (search !== undefined) {
            filter.OR = [
                {
                    name: { startsWith: search }
                },
                {
                    symbol: { startsWith: search }
                },
                {
                    token:  { startsWith: search }
                }
            ]
        }
        let result = await tokenDao.queryTokens(skip, limit, sort, filter);
        result = result.map(token => {
            return {
                ...token,
                image: token.image.toString('base64')
            }
        })
        const all_count = await tokenDao.getCountByFilter({ where: filter });
        const page_count = pageDiv(all_count, limit, page);
        ctx.code = 200;
        ctx.msg = "coins"
        ctx.data = {
            result,
            page: {
                all_count,
                page_count,
                page,
                limit,
            }
        };
        return next();
    },

    async trade(ctx, next) {
        const page = ctx.query.page || 1;
        const limit = ctx.query.limit || 20;
        const skip = limit * (page - 1);
        const token = ctx.request.params.token;
        const result = await tokenEventDao.getEventByToken(token, skip, limit);
        const all_count = await tokenEventDao.getCountByFilter(token);
        const page_count = pageDiv(all_count, limit, page);
        ctx.code = 200;
        ctx.msg = "trade"
        ctx.data = {
            result,
            page: {
                all_count,
                page_count,
                page,
                limit,
            }
        };
        return next();
    },

    async holders(ctx, next) {
        const page = ctx.request.params.page || 1;
        const limit = ctx.request.params.limit || 20;
        const skip = limit * (page - 1);
        const token = ctx.request.params.token;
        const result = await tokenHolderDao.getHoldersByToken(skip, limit, token);
        const all_count = await tokenHolderDao.getCountByFilter(token);
        const page_count = pageDiv(all_count, limit, page);
        ctx.code = 200;
        ctx.msg = "trade"
        ctx.data = {
            result,
            page: {
                all_count,
                page_count,
                page,
                limit,
            }
        };
        return next();
    },

    async candlesticks(ctx, next) {
        const token = ctx.request.params.token;
        if(token === undefined ) {
            throw new ParameterException();
        }
        const result = await tokenPriceDao.getPriceByToken(token);
        ctx.code = 200;
        ctx.msg = "candlesticks"
        ctx.data = result;
        return next();
    },

    async kingOfTheHill(ctx,next) {
        const today = moment().utc().startOf('day').valueOf();
        console.log(today);
        const event = await tokenEventDao.kingOfTheHill(today);
        console.log(event);
        if(event.length == 0){
            throw new NotFoundException();
        }
        const coin = await tokenDao.queryToken(event[0].token);
        coin.image = Buffer.from(coin.image).toString('base64')
        ctx.code = 200;
        ctx.msg = "kingOfTheHill"
        ctx.data = coin;
        return next();
    },

    async price(ctx,next) {
        const token = ctx.request.params.token;
        if(token === undefined ) {
            throw new ParameterException();
        }
        let price = await tokenService.getCurrentTokenPrice(token);
        ctx.code = 200;
        ctx.msg = "Token Price";
        ctx.data = price;
        return next();
    },
    async calculateTokenAmount(ctx,next) {
        const token = ctx.query.token;
        const ethAmount = ctx.query.amount;
        console.log("token:",token,",ethAmount",ethAmount);
        if(token == undefined || ethAmount == undefined) {
            throw new ParameterException()
        };
        let tokenAmount = await tokenService.calculateTokenAmount(token,ethAmount);
        ctx.code = 200;
        ctx.msg = "Calculate Token Amount";
        ctx.data = tokenAmount;
        return next();
    },
    async calculateEthAmount(ctx,next) {
        const token = ctx.query.token;
        const tokenAmount = ctx.query.amount;
        if(token == undefined || tokenAmount == undefined) {
            throw new ParameterException()
        };
        let ethAmount = await tokenService.calculateEthAmount(token,tokenAmount);
        ctx.code = 200;
        ctx.msg = "Calculate Eth Amount";
        ctx.data = ethAmount;
        return next();
    }
}

module.exports = tokenController;　