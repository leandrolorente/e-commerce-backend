import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      const createProductDto = {
        name: 'Produto Teste',
        description: 'Descrição do produto',
        price: 99.9,
        stock: 10,
        category: 'AFTERCARE' as any,
      };

      const createdProduct = {
        id: '1',
        ...createProductDto,
        imageUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.create.mockResolvedValue(createdProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos ativos', async () => {
      const products = [
        {
          id: '1',
          name: 'Produto 1',
          price: 50,
          isActive: true,
          reviews: [],
        },
        {
          id: '2',
          name: 'Produto 2',
          price: 100,
          isActive: true,
          reviews: [],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
        },
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });
    });

    it('deve filtrar produtos por categoria', async () => {
      const category = 'AFTERCARE';
      const products = [
        {
          id: '1',
          name: 'Pomada',
          category: 'AFTERCARE',
          isActive: true,
          reviews: [],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(products);

      const result = await service.findAll(category);

      expect(result).toEqual(products);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          category: category,
        },
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto por ID', async () => {
      const productId = '1';
      const product = {
        id: productId,
        name: 'Produto Teste',
        price: 99.9,
        reviews: [],
      };

      mockPrismaService.product.findUnique.mockResolvedValue(product);

      const result = await service.findOne(productId);

      expect(result).toEqual(product);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: {
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    it('deve lançar NotFoundException se o produto não existir', async () => {
      const productId = 'nonexistent';

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(productId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um produto', async () => {
      const productId = '1';
      const updateProductDto = {
        name: 'Produto Atualizado',
        price: 149.9,
      };

      const existingProduct = {
        id: productId,
        name: 'Produto Antigo',
        price: 99.9,
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateProductDto,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(existingProduct);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: updateProductDto,
      });
    });
  });

  describe('remove', () => {
    it('deve desativar um produto (soft delete)', async () => {
      const productId = '1';
      const product = {
        id: productId,
        name: 'Produto',
        isActive: true,
      };

      const deactivatedProduct = {
        ...product,
        isActive: false,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(product);
      mockPrismaService.product.update.mockResolvedValue(deactivatedProduct);

      const result = await service.remove(productId);

      expect(result.isActive).toBe(false);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { isActive: false },
      });
    });
  });
});
