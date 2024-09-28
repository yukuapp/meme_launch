const prisma = require("./prismacli");
const walletDao = {
    async create(uid, contract, private_key, mnemonic) {
        await prisma.wallet.create({uid, contract, private_key, mnemonic})
    },
}
module.exports = walletDao;