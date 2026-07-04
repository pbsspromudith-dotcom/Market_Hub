import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.promotion_pricing.create({
      data: {
        promotion_type: 'test_create',
        duration_days: 999,
        price: 9.99,
        is_active: true
      }
    });
    console.log("Success:", res);
    await prisma.promotion_pricing.delete({ where: { id: res.id } });
    console.log("Deleted test record.");
  } catch (err) {
    console.error("Error creating record:", err);
  }
}

main().finally(() => prisma.$disconnect());
