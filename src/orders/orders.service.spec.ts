import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um pedido com sucesso', async () => {
      const userId = 'user-1';
      const createOrderDto = {
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 50,
          },
          {
            productId: 'product-2',
            quantity: 1,
            price: 100,
          },
        ],
        shippingAddress: 'Rua Teste, 123',
      };

      const createdOrder = {
        id: '1',
        userId,
        total: 200,
        status: 'PENDING',
        shippingAddress: createOrderDto.shippingAddress,
        items: createOrderDto.items.map((item, index) => ({
          id: `item-${index}`,
          ...item,
          orderId: '1',
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.order.create.mockResolvedValue(createdOrder);

      const result = await service.create(userId, createOrderDto);

      expect(result).toBeDefined();
      expect(result.total).toBe(200);
      expect(mockPrismaService.order.create).toHaveBeenCalled();
    });

    it('deve calcular o total corretamente', async () => {
      const userId = 'user-1';
      const createOrderDto = {
        items: [
          {
            productId: 'product-1',
            quantity: 3,
            price: 45.9,
          },
        ],
      };

      const expectedTotal = 3 * 45.9;

      mockPrismaService.order.create.mockResolvedValue({
        id: '1',
        total: expectedTotal,
      });

      const result = await service.create(userId, createOrderDto);

      expect(result.total).toBe(expectedTotal);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pedidos', async () => {
      const orders = [
        {
          id: '1',
          userId: 'user-1',
          total: 100,
          status: 'PENDING',
        },
        {
          id: '2',
          userId: 'user-2',
          total: 200,
          status: 'PROCESSING',
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll();

      expect(result).toEqual(orders);
    });

    it('deve filtrar pedidos por usuário', async () => {
      const userId = 'user-1';
      const orders = [
        {
          id: '1',
          userId,
          total: 100,
        },
      ];

      mockPrismaService.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll(userId);

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um pedido por ID', async () => {
      const orderId = '1';
      const order = {
        id: orderId,
        userId: 'user-1',
        total: 100,
        items: [],
        payment: null,
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      mockPrismaService.order.findUnique.mockResolvedValue(order);

      const result = await service.findOne(orderId);

      expect(result).toEqual(order);
    });

    it('deve lançar NotFoundException se o pedido não existir', async () => {
      const orderId = 'nonexistent';

      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(orderId)).rejects.toThrow(NotFoundException);
    });
  });
});
