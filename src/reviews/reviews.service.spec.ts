import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockPrismaService = {
    review: {
      findMany: jest.fn(),
    },
  };

  const mockReview = {
    id: 'review-1',
    userId: 'user-1',
    productId: 'product-1',
    tattooId: null,
    rating: 5,
    comment: 'Trabalho impecável!',
    service: 'Tatuagem Leão Realista',
    createdAt: new Date('2025-11-26T10:00:00'),
    updatedAt: new Date(),
  };

  const mockReviewWithUser = {
    ...mockReview,
    user: {
      id: 'user-1',
      name: 'João Silva',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    product: { id: 'product-1', name: 'Camiseta Tattoo Art' },
    tattoo: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todas as reviews em formato Testimonial', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([
        mockReviewWithUser,
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('customerName', 'João Silva');
      expect(result[0]).toHaveProperty('customerPhoto');
      expect(result[0]).toHaveProperty('rating', 5);
      expect(result[0]).toHaveProperty('comment');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('service');
    });

    it('deve incluir todas as relações necessárias', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([
        mockReviewWithUser,
      ]);

      await service.findAll();

      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          tattoo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: undefined,
      });
    });

    it('deve usar fallback para avatar quando usuário não tiver foto', async () => {
      const reviewNoAvatar = {
        ...mockReviewWithUser,
        user: { id: 'user-2', name: 'Maria', avatar: null },
      };

      mockPrismaService.review.findMany.mockResolvedValue([reviewNoAvatar]);

      const result = await service.findAll();

      expect(result[0].customerPhoto).toBe('https://i.pravatar.cc/150');
    });

    it('deve usar nome do serviço de product ou tattoo', async () => {
      const reviewWithTattoo = {
        ...mockReview,
        user: { id: 'user-1', name: 'João', avatar: null },
        product: null,
        tattoo: { id: 'tattoo-1', name: 'Dragão Colorido' },
        service: null,
      };

      mockPrismaService.review.findMany.mockResolvedValue([reviewWithTattoo]);

      const result = await service.findAll();

      expect(result[0].service).toBe('Dragão Colorido');
    });

    it('deve usar campo service se disponível', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([
        mockReviewWithUser,
      ]);

      const result = await service.findAll();

      expect(result[0].service).toBe('Tatuagem Leão Realista');
    });
  });

  describe('findByProduct', () => {
    it('deve retornar reviews de um produto específico', async () => {
      mockPrismaService.review.findMany.mockResolvedValue([
        mockReviewWithUser,
      ]);

      const result = await service.findByProduct('product-1');

      expect(result).toHaveLength(1);
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { productId: 'product-1' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
