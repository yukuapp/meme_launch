
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const {AuthException} = require('./error');
const jwtMiddleWare = async(ctx,next) => {
    let token = ctx.headers.authorization;
    console.log("token:",token);
    if (!token) {
      throw new AuthException('The jwt token is missing');
    }
    try {
        const wallet = jwt.verify(token, JWT_SECRET);
        ctx.state.wallet = wallet;
    } catch (err) {
      throw new AuthException(err.message);
    }
    await next();
};

module.exports = {jwtMiddleWare};
