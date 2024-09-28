const prisma = require("./prismacli");
const tokenEventDao = {
    async insert(data) {
        await prisma.meme_token_events.create({
            data
        });
    },
    async getEventByToken(token, skip, take) {
        let result = await prisma.meme_token_events.findMany({
            take,
            skip,
            where: { token },
            orderBy: { timestamp: 'desc' },
            include: { user: true }
        })
        return result;
    },
    async getCountByFilter(token) {
        const count = await prisma.meme_token_events.count({ where: { token } });
        return count;
    },
    async kingOfTheHill(today) {
        const event = await prisma.meme_token_events.groupBy({
            by: ['token'],
            _sum: {
                eth_amount: true
            },
            take: 1,
            where: {
                // type: "BUY",
                timestamp: {
                    gte: new Date(today)
                }
            },
            orderBy : {
                _sum: {
                    eth_amount: 'desc'
                }
            }

        });
        return event;
    }
}

module.exports = tokenEventDao;