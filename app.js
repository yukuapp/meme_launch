"use strict";

const Koa = require("koa");
const bodyParser = require("koa-bodyparser")();
const staticCache = require("koa-static-cache");
const cors = require("koa2-cors");
const koaBody = require("koa-body")();
const helmet = require("koa-helmet");
const config = require("./config");
const publicRouter = require("./routes/public");
const { loggerMiddleware } = require("./middlewares/logger");
const { errorHandler, responseHandler } = require("./middlewares/response");
const cacheControl = require('koa-cache-control');
const {listenPumpFunEvent,listenTransfer} = require("./services/eventsService");
const {listenCreatePumpFun} = require("./services/pumpfunfactoryService");
const http = require("http");
const https = require("https");
const fs = require('fs');
// require("./scheduler/index");
require("dotenv/config");
BigInt.prototype.toJSON = function () {
  return this.toString();
};
(async() => {
  // listenCreatePumpFun();
  listenPumpFunEvent();
  listenTransfer();
})()
const app = new Koa();
//cache
app.use(cacheControl({maxAge:60}));
// error
app.use(errorHandler);

app.use(koaBody);
// file-data
app.use(bodyParser);

// static file
app.use(staticCache(config.PUBLIC_DIR));

app.use(
  cors({
    origin: '*',
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
  })
);
//swagger
const { koaSwagger } = require("koa2-swagger-ui");
const swaggerInstall = require("./swagger");
swaggerInstall(app);
app.use(
  koaSwagger({
    routePrefix: "/swagger",
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
// Helmet
app.use(helmet());
app.use(loggerMiddleware);
app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

app.use(responseHandler);
// const options = {
//   key: fs.readFileSync("./server.key", "utf8"),
//   cert: fs.readFileSync("./server.cert", "utf8")
//   };

// https.createServer(app.callback()).listen('5010');
// https.createServer(options,app.callback()).listen(process.env.PORT);
app.listen(process.env.PORT);
