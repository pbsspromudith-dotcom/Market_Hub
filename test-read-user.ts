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

    const listingIds = [...new Set(messages.map(m => m.listing_id))];
    const userIds = [...new Set([
      ...messages.map(m => m.sender_id).filter(id => id > 0),
      ...messages.map(m => m.receiver_id).filter(id => id > 0)
    ])];

    const [listings, users] = await Promise.all([
      prisma.listings.findMany({
        where: { id: { in: listingIds } },
        select: { id: true, title: true, image: true }
      }),
      prisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true }
      })
    ]);

    console.log(`Found ${listings.length} listings`);
    console.log(`Found ${users.length} users`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
