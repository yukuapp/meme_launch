import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const setting1 = await prisma.system_setting.upsert({
    where: { setting_key: 'observer_nft_activity' },
    update: {},
    create: {
      setting_key: 'observer_nft_activity',
      setting_value: '0'
    },
  })
  const setting2 = await prisma.system_setting.upsert({
    where: { setting_key: 'observer_ogy_record_index' },
    update: {},
    create: {
      setting_key: 'observer_ogy_record_index',
      setting_value: '0'
    },
  })
  const setting3 = await prisma.system_setting.upsert({
    where: { setting_key: 'off_fiat_order_index' },
    update: {},
    create: {
      setting_key: 'off_fiat_order_index',
      setting_value: '0',
      call_index: 0,
      off_order_date: '20220606',
    },
  })
  console.log({ setting1 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })