import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TattoosService } from './tattoos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TattoosService', () => {
  let service: TattoosService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    tattoo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TattoosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TattoosService>(TattoosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma tatuagem com sucesso', async () => {
      const createTattooDto = {
        title: 'Leão Realista',
        description: 'Tatuagem de leão',
        style: 'Realismo',
        bodyArea: 'BRACO' as any,
        size: 'Grande',
        price: 800,
        imageUrl: 'https://example.com/image.jpg',
        duration: 240,
      };

      const createdTattoo = {
        id: '1',
        ...createTattooDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.tattoo.create.mockResolvedValue(createdTattoo);

      const result = await service.create(createTattooDto);

      expect(result).toEqual(createdTattoo);
      expect(mockPrismaService.tattoo.create).toHaveBeenCalledWith({
        data: createTattooDto,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as tatuagens ativas', async () => {
      const tattoos = [
        {
          id: '1',
          title: 'Leão',
          style: 'Realismo',
          isActive: true,
          reviews: [],
        },
        {
          id: '2',
          title: 'Rosa',
          style: 'Old School',
          isActive: true,
          reviews: [],
        },
      ];

      mockPrismaService.tattoo.findMany.mockResolvedValue(tattoos);

      const result = await service.findAll();

      expect(result).toEqual(tattoos);
      expect(mockPrismaService.tattoo.findMany).toHaveBeenCalled();
    });

    it('deve filtrar tatuagens por estilo', async () => {
      const style = 'Realismo';
      const tattoos = [
        {
          id: '1',
          title: 'Leão',
          style: 'Realismo',
          isActive: true,
          reviews: [],
        },
      ];

      mockPrismaService.tattoo.findMany.mockResolvedValue(tattoos);

      const result = await service.findAll(style);

      expect(result).toEqual(tattoos);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma tatuagem por ID', async () => {
      const tattooId = '1';
      const tattoo = {
        id: tattooId,
        title: 'Leão Realista',
        style: 'Realismo',
        reviews: [],
      };

      mockPrismaService.tattoo.findUnique.mockResolvedValue(tattoo);

      const result = await service.findOne(tattooId);

      expect(result).toEqual(tattoo);
    });

    it('deve lançar NotFoundException se a tatuagem não existir', async () => {
      const tattooId = 'nonexistent';

      mockPrismaService.tattoo.findUnique.mockResolvedValue(null);

      await expect(service.findOne(tattooId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar uma tatuagem', async () => {
      const tattooId = '1';
      const updateTattooDto = {
        title: 'Título Atualizado',
        price: 900,
      };

      const existingTattoo = {
        id: tattooId,
        title: 'Título Antigo',
        price: 800,
      };

      const updatedTattoo = {
        ...existingTattoo,
        ...updateTattooDto,
      };

      mockPrismaService.tattoo.findUnique.mockResolvedValue(existingTattoo);
      mockPrismaService.tattoo.update.mockResolvedValue(updatedTattoo);

      const result = await service.update(tattooId, updateTattooDto);

      expect(result).toEqual(updatedTattoo);
    });
  });

  describe('remove', () => {
    it('deve desativar uma tatuagem (soft delete)', async () => {
      const tattooId = '1';
      const tattoo = {
        id: tattooId,
        title: 'Leão',
        isActive: true,
      };

      const deactivatedTattoo = {
        ...tattoo,
        isActive: false,
      };

      mockPrismaService.tattoo.findUnique.mockResolvedValue(tattoo);
      mockPrismaService.tattoo.update.mockResolvedValue(deactivatedTattoo);

      const result = await service.remove(tattooId);

      expect(result.isActive).toBe(false);
    });
  });
});
