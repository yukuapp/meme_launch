const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const userService = require("../services/user");
const walletService = require("../services/wallet");
const userDao = require("../dao/user");
const {AuthException, ParameterException} = require("../middlewares/error");
const {tokenBalanceOf} = require("../services/pumpfunService");
const { ethers } = require("ethers");
const userController = {
    async login(ctx, next) {
        let params = ctx.query;
        let tg_user = JSON.parse(decodeURIComponent(params.user));
        let verified = userService.verifyTelegram(params);
        if (verified) {
            let id = tg_user.id;
            let wallet = walletService.generate(id);
            let user = await userDao.findUser(id);
            if (!user) {
                //生成用户信息
                user = await userDao.register(id, tg_user.username || tg_user.first_name, tg_user.first_name, tg_user.last_name, tg_user.photo_url || '', wallet.address);
            }
            if (wallet == undefined) {
                ctx.code = 400;
                ctx.msg = "Wallet generate failed!";
                return next();
            }
            wallet.date = new Date();
            const jwt_token = jwt.sign(wallet, JWT_SECRET, { expiresIn: '1d' });
            ctx.code = 200;
            ctx.msg = "Login Success"
            ctx.data = {token:jwt_token,address:wallet.address}
            return next();
        } else {
            throw new AuthException();
        }
    },

    async balance(ctx,next) {
        const token = ctx.query.token;
        const user = ctx.query.user;
        if(token === undefined || user === undefined) {
            throw new ParameterException();
        }
        const balance = await tokenBalanceOf(token,user);
        ctx.code = 200;
        ctx.msg = "Token Balance";
        ctx.data = ethers.utils.formatUnits(balance,18);
        return next();
    },
    async export_private_key(ctx,next) {
        const wallet = ctx.state.wallet;
        ctx.code = 200;
        ctx.msg = "private key";
        ctx.data = wallet.private_key;
        return next();
    }
}
module.exports = userController;