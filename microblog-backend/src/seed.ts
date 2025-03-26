import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  
  // Create test users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
  });
  
  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
    },
  });
  
  // Create sample posts
  await prisma.post.create({
    data: {
      content: 'Hello world! This is my first post.',
      userId: alice.id,
    },
  });
  
  await prisma.post.create({
    data: {
      content: 'I love coding with TypeScript and React!',
      userId: bob.id,
    },
  });
  
  await prisma.post.create({
    data: {
      content: 'Docker makes development so much easier.',
      userId: alice.id,
    },
  });
  
  // Useful indicator of successful seeding
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    // Important for seed script debugging
    console.error('Seed error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });