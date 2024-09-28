"use strict";

const { logger } = require("./logger");

const responseHandler = (ctx) => {
  ctx.type = "json";
  ctx.body = {
    code: ctx.code || 200,
    msg: ctx.msg || "",
    data: ctx.data,
  };
};

const errorHandler = (ctx, next) => {
  return next().catch((err) => {
    console.log("err:",err)
    if (err.code == null) {
      logger.error(err.stack);
    }
    ctx.body = {
      code: err.code || -1,
      data: null,
      msg: err.msg.trim(),
    };

    ctx.status = 200;
    return Promise.resolve();
  });
};

module.exports = {
  responseHandler,
  errorHandler,
};
