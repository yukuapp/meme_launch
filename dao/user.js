const prisma = require("./prismacli");
const userDao = {
    async register(id, name, first_name, last_name, avatar, address) {
        let user = await prisma.user.create({
            data: {
                telegram_id: id +"", name, first_name, last_name, avatar, address
            }
        })
        return user;
    },
    async findUser(tid) {
        let user = await prisma.user.findUnique({
            where: { telegram_id: tid+"" }
        })
        return user
    }
}
module.exports = userDao;