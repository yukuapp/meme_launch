'use strict'
const JSONBig = require('json-bigint');
const fs = require('fs')
const path = require('path')
const log4js = require('log4js')
const config = require('../config')

const logsDir = path.parse(config.LOG_PATH).dir
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

log4js.configure({
    appenders: {
        console: { type: 'console' },
        dateFile: { type: 'dateFile', filename: config.LOG_PATH, pattern: '-yyyy-MM-dd' }
    },
    categories: {
        default: {
            appenders: ['console', 'dateFile'],
            level: 'info'
        }
    }
})

const logger = log4js.getLogger('[Default]')

const loggerMiddleware = async (ctx,next) => {
    const start = new Date();
    await next()
    const ms = new Date() - start;

    const remoteAddress = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
        (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
    // let logText = `${ctx.method} ${ctx.status} ${ctx.url} 请求参数： ${JSONBig.stringify(ctx.request.body)} 响应参数： ${JSONBig.stringify(ctx.body)} - ${remoteAddress} - ${ms}ms`
    // 磁盘太小了,去掉日志
    let logText = `${ctx.method} ${ctx.status} ${ctx.url} - ${remoteAddress} - ${ms}ms`
    logger.info(logText)
}

module.exports = {
    logger,
    loggerMiddleware,
}