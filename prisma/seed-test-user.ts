import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Test user already exists.');
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Test User',
      role: 'USER',
      status: 'ACTIVE',
    },
  });
  console.log('Test user created:', { email, password });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 