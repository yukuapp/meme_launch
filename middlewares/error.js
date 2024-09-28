class HttpException extends Error {
    constructor(msg, code) {
        super()
        this.code = code || 400;
        this.msg = msg || '服务器异常'
    }
}

class ParameterException extends Error {
    constructor(msg, code) {
        super()
        this.code = code || 401
        this.msg = msg || 'Parameters error'
    }
}

class AuthException extends Error {
    constructor(msg, code) {
        super()
        this.code = code || 402
        this.msg = msg || 'Unauthorized'
    }
}

class ForbiddenException extends Error {
    constructor(msg, code) {
        super();
        this.code = code || 403
        this.msg = msg || 'Forbidden'
    }
}
class NotFoundException extends Error {
    constructor(msg, code) {
        super()
        this.code = code || 404
        this.msg = msg || 'Not Found'
    }
}

class ContractException extends Error {
    constructor(msg, code) {
        super()
        this.code = code || 405
        this.msg = msg || 'Contranct Error'
    }
}
class StopTradeException extends Error {
    constructor(msg, code) {
        super()
        this.code = code || 406
        this.msg = msg || 'Stop Trade'
    }
}

module.exports = {
    HttpException, ParameterException, AuthException, ForbiddenException, NotFoundException, ContractException, StopTradeException
}
