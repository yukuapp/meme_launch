const prisma = require("./prismacli");
const tokenDao = {
    async createToken(name, symbol, image, description, telegram, address, creator, total_supply) {
        console.log("createToken:", name, symbol, image, description, telegram, address, creator, total_supply);
        await prisma.meme_token.create({ data: { name, symbol, image: Buffer.from(image, 'base64'), description, telegram, token: address, creator, total_supply } });
    },
    async updateMarketCap(token, amount, isBuy) {
        let result = await prisma.meme_token.update({
            where: {
                token
            },
            data: {
                market_cap: isBuy == true ? { increment: amount } : { decrement: amount }
            }
        });
        console.log(result);
    },
    async queryTokenInfo(token) {
        let result = await prisma.meme_token.findUnique({
            where: { token },
            select: {
                token: true,
                symbol: true, 
                decimal: true,
                market_cap:true,
            },
        })
        return result;
    },
    async queryToken(token) {
        let result = await prisma.meme_token.findUnique({
            where: { token },
            include: { user: true }
        });
        return result;
    },
    async queryTokens(skip, take, orderBy, filter) {
        let result = await prisma.meme_token.findMany({
            skip,
            take,
            orderBy,
            where: filter,
            include: { user: true },
        });
        return result;
    },
    async getCountByFilter(filter) {
        const count = await prisma.meme_token.count(filter);
        return count;
    }
}
module.exports = tokenDao;