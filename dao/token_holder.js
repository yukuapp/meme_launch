const prisma = require("./prismacli");
const tokenHolderDao = {
    async insert(token, from, amount) {
        await prisma.meme_token_holder.create({
            data: {
                token, from, amount
            }
        })
    },
    async upsertBalance(token, account, amount) {
        if(token === account || account === "0x0000000000000000000000000000000000000000") {
            return;
        }
        await prisma.meme_token_holder.upsert({
            where: {
                token_address: {
                    token, address: account
                },
            },
            update: {
                amount
            },
            create: {
                token, address: account, amount
            }
        }
        )
    },
    async addTokenBalance(token,account,amount) {
        await prisma.meme_token_holder.upsert({
            where: {
                token_address: {
                    token,
                    address: account
                }
            },
            update: {
                amount: {
                    increment: amount
                }
            },
            create: {
                token, address: account, amount: amount
            }
        })
    },
    async reduceTokenBalance(token,account,amount) {
        await prisma.meme_token_holder.update({
            where: {
                token_address: {
                    token,
                    address: account
                }
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })
    },
    async getHoldersByToken(skip, take, token) {
        const holders = await prisma.meme_token_holder.findMany({
            skip,
            take,
            where: { token },
            orderBy: {
                amount: 'desc'
            },
            include: { user: true }
        });
        return holders
    },
    async getCountByFilter(token) {
        const count = await prisma.meme_token_holder.count({ where: { token } });
        return count;
    },
    async getBalance(token,account) {
        const balance = await prisma.meme_token_holder.findUnique({
            where: {
                token_address: {
                    token,
                    address: account
                }
            }
        })
        return balance;
    }
}

module.exports = tokenHolderDao;