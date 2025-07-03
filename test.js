import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Nitin',
      email: 'nitin@example.com',
    }
  });
  console.log("User created:", user);
}

main();