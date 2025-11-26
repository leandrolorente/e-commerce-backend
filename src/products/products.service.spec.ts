import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockProduct = {
    id: 'product-1',
    name: 'Produto Teste',
    description: 'Descrição do produto',
    price: 99.99,
    category: 'CLOTHING',
    stock: 10,
    images: ['image1.jpg'],
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductWithReviews = {
    ...mockProduct,
    reviews: [
      { id: 'review-1', rating: 5, comment: 'Ótimo', userId: 'user-1', productId: 'product-1', user: { name: 'João', email: 'joao@email.com' }, createdAt: new Date() },
      { id: 'review-2', rating: 4, comment: 'Bom', userId: 'user-2', productId: 'product-1', user: { name: 'Maria', email: 'maria@email.com' }, createdAt: new Date() },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      const createProductDto = {
        name: 'Produto Teste',
        description: 'Descrição',
        price: 99.99,
        category: 'CLOTHING' as any,
        stock: 10,
        images: ['image1.jpg'],
      };

      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos com rating calculado', async () => {
      const productsWithReviews = [
        {
          ...mockProduct,
          reviews: [{ rating: 5 }, { rating: 4 }],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(productsWithReviews);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('rating', 4.5);
      expect(result[0]).toHaveProperty('reviewCount', 2);
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto específico', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithReviews);

      const result = await service.findOne('product-1');

      expect(result).toBeDefined();
      expect(result.rating).toBe(4.5);
      expect(result.reviewCount).toBe(2);
    });

    it('deve lançar NotFoundException quando produto não existir', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um produto', async () => {
      const updateDto = { name: 'Produto Atualizado' };
      
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithReviews);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        ...updateDto,
      });

      const result = await service.update('product-1', updateDto);

      expect(result.name).toBe('Produto Atualizado');
    });
  });

  describe('remove', () => {
    it('deve desativar um produto', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductWithReviews);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        isActive: false,
      });

      const result = await service.remove('product-1');

      expect(result.isActive).toBe(false);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { isActive: false },
      });
    });
  });
});
