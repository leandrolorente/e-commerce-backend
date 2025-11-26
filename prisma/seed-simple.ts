import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  try {
    // Limpar dados existentes
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.product.deleteMany();
    await prisma.tattoo.deleteMany();
    await prisma.artist.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Dados antigos limpos');

    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@tattoo.com',
        password: adminPassword,
        name: 'Admin Tattoo',
        phone: '(11) 99999-9999',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin criado:', admin.email);

    // Criar usuário normal
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'user@tattoo.com',
        password: userPassword,
        name: 'Cliente Teste',
        phone: '(11) 98888-8888',
        role: 'USER',
      },
    });

    console.log('✅ Usuário criado:', user.email);

    // Criar artista
    const artist = await prisma.artist.create({
      data: {
        name: 'João Silva',
        specialty: 'Realismo',
        bio: 'Tatuador especialista em realismo há 10 anos',
        imageUrl: 'https://via.placeholder.com/300',
        isActive: true,
      },
    });

    console.log('✅ Artista criado:', artist.name);

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name: 'Pomada para Tatuagem',
        description: 'Pomada cicatrizante profissional',
        price: 39.9,
        category: 'AFTERCARE',
        stock: 100,
        imageUrl: 'https://via.placeholder.com/300',
        isActive: true,
      },
    });

    console.log('✅ Produto criado:', product.name);

    // Criar tatuagem
    const tattoo = await prisma.tattoo.create({
      data: {
        title: 'Leão Realista',
        description: 'Tatuagem de leão em estilo realista',
        style: 'Realismo',
        bodyArea: 'BRACO',
        size: 'Grande',
        price: 500.0,
        duration: 180,
        imageUrl: 'https://via.placeholder.com/300',
        isActive: true,
      },
    });

    console.log('✅ Tatuagem criada:', tattoo.title);

    console.log('');
    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📧 Credenciais:');
    console.log('   Admin: admin@tattoo.com / admin123');
    console.log('   User:  user@tattoo.com / user123');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
