import { prisma } from './src/lib/prisma';

async function main() {
  const userIdInt = 23;
  try {
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { receiver_id: userIdInt },
          { sender_id: userIdInt }
        ]
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    console.log(`Found ${messages.length} messages`);
    console.log(messages.map(m => ({ id: m.id, is_read: m.is_read, receiver_id: m.receiver_id })));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
