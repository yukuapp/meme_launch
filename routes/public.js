"use strict";
const Router = require("koa-router");
const controllers = require("../controllers");
const { secret } = require('../config');
const router = new Router();
const {jwtMiddleWare} = require("../middlewares/jwt");
router.get("/", async (ctx, next) => {
  ctx.msg = "success";
  return next();
});


/**
 * @swagger
 * /user/login:
 *  post:
 *    tags: [user]
 *    summary: login
 *    description: 登陆telegram，获取tg的用户信息并生成钱包私钥保存在后台
 *    parameters:
 *      - name: id
 *        description: telegram user id
 *        required: true
 *        schema:
 *          type: number
 *      - name: first_name
 *        description: telegram user first_name
 *        required: true
 *        schema:
 *          type: string
 *      - name: hash
 *        description: 参数的hash值
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'object'
 *              description: 返回值
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/user/login",controllers.user.login);
router.get("/user/privatekey",jwtMiddleWare,controllers.user.export_private_key);

/**
 * @swagger
 * /user/balance:
 *  get:
 *    tags: [user]
 *    summary: 查询用户代币余额
 *    description: 查询用户代币余额
 *    parameters:
 *      - name: token
 *        description: token的address
 *        required: true
 *        schema:
 *          type: string
 *      - name: user
 *        description: user 地址
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'object'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/user/balance",controllers.user.balance);

/**
 * @swagger
 * /token/create:
 *  post:
 *    tags: [token]
 *    summary: create
 *    description: 创建代币
 *    parameters:
 *      - name: name
 *        description: token name
 *        required: true
 *        schema:
 *          type: string
 *      - name: symbol
 *        description: token symbol
 *        required: true
 *        schema:
 *          type: string
 *      - name: image
 *        description: token avatar,Base64
 *        required: true
 *        schema:
 *          type: string
 *      - name: description
 *        description: token description
 *        required: false
 *        schema:
 *          type: string
 *      - name: telegram
 *        description: telegram url
 *        required: false
 *        schema:
 *          type: string
 *      - name: ethAmount
 *        description: 购买的eth数量
 *        required: false
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'string'
 *              description: token address
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.post("/token/create",jwtMiddleWare,controllers.token.createToken);

/**
 * @swagger
 * /token/buy:
 *  post:
 *    tags: [token]
 *    summary: buy token
 *    description: 购买代币
 *    parameters:
 *      - name: token
 *        description: token address
 *        required: true
 *        schema:
 *          type: string
 *      - name: slippage
 *        description: 滑点
 *        required: true
 *        schema:
 *          type: number
 *      - name: ethAmount
 *        description: 花费的eth数量
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.post("/token/buy",jwtMiddleWare,controllers.token.buy);

/**
 * @swagger
 * /token/sell:
 *  post:
 *    tags: [token]
 *    summary: sell token
 *    description: 出售代币
 *    parameters:
 *      - name: token
 *        description: token address
 *        required: true
 *        schema:
 *          type: string
 *      - name: slippage
 *        description: 滑点
 *        required: true
 *        schema:
 *          type: number
 *      - name: tokenAmount
 *        description: 出售的代币数量
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.post("/token/sell",jwtMiddleWare,controllers.token.sell);

/**
 * @swagger
 * /coins:
 *  get:
 *    tags: [token]
 *    summary: 查询代币
 *    description: 查询代币
 *    parameters:
 *      - name: page
 *        description: 查询页数，默认第一页
 *        required: false
 *        schema:
 *          type: number
 *      - name: limit
 *        description: 单次查询数量，默认20
 *        required: false
 *        schema:
 *          type: number
 *      - name: account
 *        description: 用户address，当sort是myToken时必传
 *        required: false
 *        schema:
 *          type: string
 *      - name: sort
 *        description: 筛选条件，支持marketCap/new/myToken，默认marketCap
 *        required: true
 *        schema:
 *          type: string
 *      - name: order
 *        description: 排序，传asc/desc，默认desc
 *        required: false
 *        schema:
 *          type: string
 *      - name: search
 *        description: 查询条件，支持token的name，symbol，address查询
 *        required: false
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'array'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/coins",controllers.token.coins);

/**
 * @swagger
 * /coin/{token}:
 *  get:
 *    tags: [token]
 *    summary: 查询代币
 *    description: 查询代币
 *    parameters:
 *      - name: token
 *        description: token的address
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'object'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/coin/:token",controllers.token.coin);


/**
 * @swagger
 * /coin/maxeth/{token}:
 *  get:
 *    tags: [token]
 *    summary: 查询最大可购买ETH数量
 *    description: 查询最大可购买ETH数量
 *    parameters:
 *      - name: token
 *        description: token的address
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'object'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/coin/maxeth/:token",controllers.token.maxEthtoBuy);
/**
 * @swagger
 * /token/trades/{token}:
 *  get:
 *    tags: [token]
 *    summary: 交易记录
 *    description: 交易记录
 *    parameters:
 *      - name: page
 *        description: 查询页数，默认第一页
 *        required: false
 *        schema:
 *          type: number
 *      - name: limit
 *        description: 单次查询数量，默认20
 *        required: false
 *        schema:
 *          type: number
 *      - name: token
 *        in: path
 *        description: 代币地址
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'array'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/token/trades/:token",controllers.token.trade);
/**
 * @swagger
 * /token/holders/{token}:
 *  get:
 *    tags: [token]
 *    summary: token holders
 *    description: token holders
 *    parameters:
 *      - name: page
 *        description: 查询页数，默认第一页
 *        required: false
 *        schema:
 *          type: number
 *      - name: limit
 *        description: 单次查询数量，默认20
 *        required: false
 *        schema:
 *          type: number
 *      - name: token
 *        in: path
 *        description: 代币地址
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'array'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/token/holders/:token",controllers.token.holders);
/**
 * @swagger
 * /token/candlesticks/{token}/:
 *  get:
 *    tags: [token]
 *    summary: token price
 *    description: token price
 *    parameters:
 *      - name: token
 *        in: path
 *        description: 代币地址
 *        required: true
 *        schema:
 *          type: string
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'array'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/token/candlesticks/:token",controllers.token.candlesticks);

/**
 * @swagger
 * /token/price/:token:
 *  get:
 *    tags: [token]
 *    summary: token price
 *    description: token price
 *    parameters:
 *      - name: token
 *        in: path
 *        description: 代币地址
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'array'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/token/price/:token",controllers.token.price);
/**
 * @swagger
 * /token/kingOfTheHill:
 *  get:
 *    tags: [token]
 *    summary: kingOfTheHill
 *    description: kingOfTheHill
 *    parameters:
 * 
 *    responses:
 *      '200':
 *        description: Ok
 *        schema:
 *          type: 'object'
 *          properties:
 *            code:
 *              type: 'number'
 *              description: 状态码
 *            data:
 *              type: 'array'
 *              description: 返回结果
 *            msg:
 *              type: 'string'
 *              description: 消息提示
 */
router.get("/token/kingOfTheHill",controllers.token.kingOfTheHill);
router.get("/token/calculate/token",controllers.token.calculateTokenAmount);
router.get("/token/calculate/eth",controllers.token.calculateEthAmount);
module.exports = router;
