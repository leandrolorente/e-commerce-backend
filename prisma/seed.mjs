import { PrismaClient, UserRole, ProductCategory, BodyArea } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@guaranatatto.com' },
    update: {},
    create: {
      email: 'admin@guaranatatto.com',
      password: adminPassword,
      name: 'Administrador',
      phone: '(11) 99999-9999',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin criado:', admin.email);

  // Usuário teste
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      name: 'Usuário Teste',
      phone: '(11) 88888-8888',
      role: UserRole.USER,
    },
  });

  console.log('✅ Usuário teste criado:', user.email);

  console.log('✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
