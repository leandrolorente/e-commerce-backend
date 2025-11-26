import { PrismaClient, UserRole, ProductCategory, BodyArea } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

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
      avatar: 'https://i.pravatar.cc/300?img=33',
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
  
  await prisma.product.createMany({
    data: [
      {
        name: 'Pomada Cicatrizante Premium',
        description: 'Pomada especial para cicatrização de tatuagens com vitamina E',
        price: 45.90,
        discountPrice: 39.90,
        stock: 50,
        category: ProductCategory.AFTERCARE,
        images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'],
        specifications: {
          peso: '50g',
          ingredientes: 'Vitamina E, Aloe Vera, Manteiga de Karité',
          validade: '24 meses',
        },
      },
      {
        name: 'Camiseta GuaranaTatto Preta',
        description: 'Camiseta 100% algodão com logo exclusivo',
        price: 79.90,
        stock: 30,
        category: ProductCategory.CLOTHING,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        specifications: {
          material: '100% Algodão',
          tamanhos: 'P, M, G, GG',
          cor: 'Preta',
        },
      },
      {
        name: 'Kit Cuidados Completo',
        description: 'Kit com pomada, sabonete neutro e protetor solar',
        price: 120.00,
        discountPrice: 99.90,
        stock: 20,
        category: ProductCategory.AFTERCARE,
        images: ['https://images.unsplash.com/photo-1556228841-b8e5c3e1f0b6?w=500'],
      },
      {
        name: 'Vale Presente R$ 500',
        description: 'Vale para serviços ou produtos da loja',
        price: 500.00,
        stock: 100,
        category: ProductCategory.GIFT_CARD,
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500'],
      },
    ],
  });

  console.log('✅ Produtos criados');

  // Tatuagens
  await prisma.tattoo.deleteMany({});

  await prisma.tattoo.createMany({
    data: [
      {
        name: 'Leão Realista',
        description: 'Tatuagem de leão em estilo realista',
        style: 'REALISTIC',
        bodyArea: BodyArea.BRACO,
        size: 'LARGE',
        estimatedTime: '4h',
        estimatedPrice: 800.00,
        images: ['https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=500'],
        artist: 'Carlos Silva',
        difficulty: 'Expert',
        tags: ['leão', 'realista', 'animal'],
        colors: ['preto', 'cinza'],
        isAvailable: true,
      },
      {
        name: 'Rosa Old School',
        description: 'Rosa tradicional estilo old school',
        style: 'TRADITIONAL',
        bodyArea: BodyArea.ANTEBRACO,
        size: 'MEDIUM',
        estimatedTime: '2h',
        estimatedPrice: 450.00,
        images: ['https://images.unsplash.com/photo-1611501275019-9b5cda994e3d?w=500'],
        artist: 'Ana Costa',
        difficulty: 'Intermediate',
        tags: ['rosa', 'old school', 'flor'],
        colors: ['vermelho', 'verde', 'preto'],
        isAvailable: true,
      },
      {
        name: 'Mandala Geométrica',
        description: 'Mandala com padrões geométricos',
        style: 'GEOMETRIC',
        bodyArea: BodyArea.COSTAS,
        size: 'LARGE',
        estimatedTime: '5h',
        estimatedPrice: 1200.00,
        images: ['https://images.unsplash.com/photo-1590246814883-57c511eecaa7?w=500'],
        artist: 'Carlos Silva',
        difficulty: 'Expert',
        tags: ['mandala', 'geométrico', 'simetria'],
        colors: ['preto'],
        isAvailable: true,
      },
      {
        name: 'Flor de Lótus Minimalista',
        description: 'Flor de lótus em linhas finas',
        style: 'MINIMALIST',
        bodyArea: BodyArea.PE,
        size: 'SMALL',
        estimatedTime: '1h',
        estimatedPrice: 250.00,
        images: ['https://images.unsplash.com/photo-1565058505949-e353d6fab1b1?w=500'],
        artist: 'Ana Costa',
        difficulty: 'Beginner',
        tags: ['lótus', 'minimalista', 'flor', 'delicada'],
        colors: ['preto'],
        isAvailable: true,
      },
      {
        name: 'Dragão Oriental',
        description: 'Dragão japonês colorido',
        style: 'ORIENTAL',
        bodyArea: BodyArea.COXA,
        size: 'XLARGE',
        estimatedTime: '8h',
        estimatedPrice: 2000.00,
        images: ['https://images.unsplash.com/photo-1568515387631-8d5e4bf3c3b6?w=500'],
        artist: 'Carlos Silva',
        difficulty: 'Expert',
        tags: ['dragão', 'oriental', 'japonês', 'colorido'],
        colors: ['vermelho', 'preto', 'dourado', 'verde'],
        isAvailable: true,
      },
    ],
  });

  console.log('✅ Tatuagens criadas');

  // Reviews
  await prisma.review.deleteMany({});

  const [products, tattoos] = await Promise.all([
    prisma.product.findMany({ take: 2 }),
    prisma.tattoo.findMany({ take: 2 }),
  ]);

  if (products.length > 0 && tattoos.length > 0) {
    await prisma.review.createMany({
      data: [
        {
          userId: user.id,
          productId: products[0].id,
          rating: 5,
          comment: 'Produto excelente! Ajudou muito na cicatrização da minha tattoo.',
          service: 'Pomada Cicatrizante',
        },
        {
          userId: user.id,
          tattooId: tattoos[0].id,
          rating: 5,
          comment: 'Trabalho incrível! O Carlos é um artista de verdade, super recomendo!',
          service: 'Tatuagem Realista',
        },
        {
          userId: user.id,
          productId: products[1]?.id,
          rating: 4,
          comment: 'Ótima qualidade, entrega rápida!',
          service: 'Camiseta',
        },
      ],
    });

    console.log('✅ Reviews criadas');
  }

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
