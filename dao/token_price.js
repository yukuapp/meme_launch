const prisma = require("./prismacli");
const tokenPriceDao = {
    async insert(data) {
        await prisma.meme_token_price.create({
            data
        })
    },
    async getPriceByToken(token) {
        let result = await prisma.meme_token_price.findMany({
            where: {
                token
            },
            orderBy : {
                timestamp: 'asc'
            }
        });
        return result;
    }
}
module.exports = tokenPriceDao;