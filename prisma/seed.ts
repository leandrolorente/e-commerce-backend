import { PrismaClient, UserRole, ProductCategory, BodyArea } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
      phone: '(11) 98888-8888',
      role: UserRole.USER,
    },
  });

  console.log('✅ Usuário teste criado:', user.email);

  // Artistas
  const artist1 = await prisma.artist.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Carlos Silva',
      bio: 'Especialista em realismo com mais de 10 anos de experiência',
      specialty: 'Realismo',
      imageUrl: 'https://i.pravatar.cc/300?img=12',
    },
  });

  const artist2 = await prisma.artist.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Ana Costa',
      bio: 'Expert em old school e tatuagens coloridas',
      specialty: 'Old School',
      imageUrl: 'https://i.pravatar.cc/300?img=45',
    },
  });

  console.log('✅ Artistas criados');

  // Produtos
  await prisma.product.deleteMany({});
  
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Pomada Cicatrizante Premium',
        description: 'Pomada especial para cicatrização de tatuagens com vitamina E',
        price: 45.90,
        stock: 50,
        category: ProductCategory.AFTERCARE,
        imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
      },
      {
        name: 'Camiseta GuaranaTatto Preta',
        description: 'Camiseta 100% algodão com logo exclusivo',
        price: 79.90,
        stock: 30,
        category: ProductCategory.MERCHANDISE,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      },
      {
        name: 'Kit Cuidados Completo',
        description: 'Kit com pomada, sabonete neutro e protetor solar',
        price: 120.00,
        stock: 20,
        category: ProductCategory.AFTERCARE,
        imageUrl: 'https://images.unsplash.com/photo-1556228841-b8e5c3e1f0b6?w=500',
      },
      {
        name: 'Vale Presente R$ 500',
        description: 'Vale para serviços ou produtos da loja',
        price: 500.00,
        stock: 100,
        category: ProductCategory.GIFT_CARD,
        imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
      },
    ],
  });

  console.log('✅ Produtos criados');

  // Tatuagens
  await prisma.tattoo.deleteMany({});

  const tattoos = await prisma.tattoo.createMany({
    data: [
      {
        title: 'Leão Realista',
        description: 'Tatuagem de leão em estilo realista',
        style: 'Realismo',
        bodyArea: BodyArea.BRACO,
        size: 'Grande (15-20cm)',
        price: 800.00,
        imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=500',
        duration: 240,
      },
      {
        title: 'Rosa Old School',
        description: 'Rosa tradicional estilo old school',
        style: 'Old School',
        bodyArea: BodyArea.ANTEBRACO,
        size: 'Média (10-15cm)',
        price: 450.00,
        imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e3d?w=500',
        duration: 120,
      },
      {
        title: 'Mandala Geométrica',
        description: 'Mandala com padrões geométricos',
        style: 'Geométrico',
        bodyArea: BodyArea.COSTAS,
        size: 'Grande (20-30cm)',
        price: 1200.00,
        imageUrl: 'https://images.unsplash.com/photo-1590246814883-57c511eecaa7?w=500',
        duration: 300,
      },
      {
        title: 'Flor de Lótus Minimalista',
        description: 'Flor de lótus em linhas finas',
        style: 'Minimalista',
        bodyArea: BodyArea.PE,
        size: 'Pequena (5-10cm)',
        price: 250.00,
        imageUrl: 'https://images.unsplash.com/photo-1565058505949-e353d6fab1b1?w=500',
        duration: 60,
      },
      {
        title: 'Dragão Oriental',
        description: 'Dragão japonês colorido',
        style: 'Oriental',
        bodyArea: BodyArea.COXA,
        size: 'Extra Grande (30cm+)',
        price: 2000.00,
        imageUrl: 'https://images.unsplash.com/photo-1568515387631-8d5e4bf3c3b6?w=500',
        duration: 480,
      },
    ],
  });

  console.log('✅ Tatuagens criadas');
  console.log('');
  console.log('🎉 Seed executado com sucesso!');
  console.log('');
  console.log('📝 Credenciais de acesso:');
  console.log('   Admin: admin@guaranatatto.com / admin123');
  console.log('   User:  user@test.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
