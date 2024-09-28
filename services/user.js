const crypto = require("crypto")
const sha256 = require("js-sha256");
const { TELEGRAM_BOT_TOKEN } = require("../config");
// const secret = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
const secret = sha256.hmac.create('WebAppData').update(TELEGRAM_BOT_TOKEN).digest();
const userService = {
    verifyTelegram(params) {
        // if (new Date().getTime()/1000 - params['auth_date'] > 86400) {
        //     return false;
        // }
        let arr = [];
        let hash = "";
        Object.keys(params).forEach(key => {
            if(key === "hash") {
                hash = params[key];
            }else{
                arr.push(`${key}=${decodeURIComponent(params[key])}`)
            }
        });
        arr.sort((a, b) => a.localeCompare(b));
        const dataCheckString = arr.join("\n");
        try {
            // const _hash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');    
            const _hash = sha256.hmac.create(secret).update(dataCheckString).hex();
            return _hash === hash;
        } catch (error) {
            console.log("error:",error);
        }
    },
}

module.exports = userService;