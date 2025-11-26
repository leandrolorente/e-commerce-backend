import { Test, TestingModule } from '@nestjs/testing';
import { StudioService } from './studio.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StudioService', () => {
  let service: StudioService;

  const mockPrismaService = {
    booking: {
      count: jest.fn(),
    },
    tattoo: {
      findMany: jest.fn(),
    },
    artist: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudioService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StudioService>(StudioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('deve retornar estatísticas do estúdio', async () => {
      mockPrismaService.artist.count.mockResolvedValue(5);
      mockPrismaService.booking.count.mockResolvedValue(150);

      const result = await service.getStats();

      expect(result).toHaveProperty('yearsExperience', 6);
      expect(result).toHaveProperty('satisfiedClients', 150);
      expect(result).toHaveProperty('artistsCount', 5);
      expect(result).toHaveProperty('awardsCount', 10);
    });

    it('deve contar apenas bookings completados', async () => {
      mockPrismaService.artist.count.mockResolvedValue(3);
      mockPrismaService.booking.count.mockResolvedValue(75);

      await service.getStats();

      expect(mockPrismaService.booking.count).toHaveBeenCalledWith({
        where: { status: 'COMPLETED' },
      });
    });

    it('deve contar artistas ativos', async () => {
      mockPrismaService.artist.count.mockResolvedValue(3);
      mockPrismaService.booking.count.mockResolvedValue(100);

      const result = await service.getStats();

      expect(mockPrismaService.artist.count).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result.artistsCount).toBe(3);
    });

    it('deve retornar 0 clientes se não houver bookings completados', async () => {
      mockPrismaService.artist.count.mockResolvedValue(2);
      mockPrismaService.booking.count.mockResolvedValue(0);

      const result = await service.getStats();

      expect(result.satisfiedClients).toBe(0);
    });

    it('deve retornar valores fixos para yearsExperience e awardsCount', async () => {
      mockPrismaService.artist.count.mockResolvedValue(4);
      mockPrismaService.booking.count.mockResolvedValue(200);

      const result = await service.getStats();

      expect(result.yearsExperience).toBe(6);
      expect(result.awardsCount).toBe(10);
    });
  });
});
