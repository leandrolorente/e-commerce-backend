import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    artist: {
      findUnique: jest.fn(),
    },
    tattoo: {
      findUnique: jest.fn(),
    },
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um agendamento com sucesso', async () => {
      const userId = 'user-1';
      const createBookingDto = {
        artistId: 'artist-1',
        service: 'NOVA_TATUAGEM',
        date: '2025-12-01',
        time: '14:00',
      };

      const user = {
        id: userId,
        name: 'Test User',
        email: 'test@test.com',
      };

      const artist = {
        id: 'artist-1',
        name: 'Carlos Silva',
        isActive: true,
      };

      const createdBooking = {
        id: '1',
        userId,
        ...createBookingDto,
        date: new Date(createBookingDto.date),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.artist.findUnique.mockResolvedValue(artist);
      mockPrismaService.booking.create.mockResolvedValue(createdBooking);

      const result = await service.create(userId, createBookingDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.artist.findUnique).toHaveBeenCalledWith({
        where: { id: createBookingDto.artistId },
      });
    });

    it('deve lançar NotFoundException se o artista não existir', async () => {
      const userId = 'user-1';
      const createBookingDto = {
        artistId: 'nonexistent',
        service: 'NOVA_TATUAGEM',
        date: '2025-12-01',
        time: '14:00',
      };

      const user = {
        id: userId,
        name: 'Test User',
        email: 'test@test.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.artist.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, createBookingDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve validar tatuagem se fornecida', async () => {
      const userId = 'user-1';
      const createBookingDto = {
        artistId: 'artist-1',
        tattooId: 'tattoo-1',
        service: 'NOVA_TATUAGEM',
        date: '2025-12-01',
        time: '14:00',
      };

      const user = {
        id: userId,
        name: 'Test User',
        email: 'test@test.com',
      };

      const artist = {
        id: 'artist-1',
        isActive: true,
      };

      const tattoo = {
        id: 'tattoo-1',
        isAvailable: true,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.artist.findUnique.mockResolvedValue(artist);
      mockPrismaService.tattoo.findUnique.mockResolvedValue(tattoo);
      mockPrismaService.booking.create.mockResolvedValue({
        id: '1',
        userId,
        ...createBookingDto,
      });

      await service.create(userId, createBookingDto);

      expect(mockPrismaService.tattoo.findUnique).toHaveBeenCalledWith({
        where: { id: createBookingDto.tattooId },
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os agendamentos', async () => {
      const bookings = [
        {
          id: '1',
          userId: 'user-1',
          artistId: 'artist-1',
          date: new Date(),
          time: '14:00',
        },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(bookings);

      const result = await service.findAll();

      expect(result).toEqual(bookings);
    });

    it('deve filtrar agendamentos por usuário', async () => {
      const userId = 'user-1';
      const bookings = [
        {
          id: '1',
          userId,
          artistId: 'artist-1',
        },
      ];

      mockPrismaService.booking.findMany.mockResolvedValue(bookings);

      const result = await service.findAll(userId);

      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um agendamento por ID', async () => {
      const bookingId = '1';
      const booking = {
        id: bookingId,
        userId: 'user-1',
        artistId: 'artist-1',
      };

      mockPrismaService.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne(bookingId);

      expect(result).toEqual(booking);
    });

    it('deve lançar NotFoundException se o agendamento não existir', async () => {
      const bookingId = 'nonexistent';

      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne(bookingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um agendamento', async () => {
      const bookingId = '1';
      const updateBookingDto = {
        status: 'CONFIRMED' as any,
      };

      const existingBooking = {
        id: bookingId,
        status: 'PENDING',
      };

      const updatedBooking = {
        ...existingBooking,
        ...updateBookingDto,
      };

      mockPrismaService.booking.findUnique.mockResolvedValue(existingBooking);
      mockPrismaService.booking.update.mockResolvedValue(updatedBooking);

      const result = await service.update(bookingId, updateBookingDto);

      expect(result).toEqual(updatedBooking);
    });
  });

  describe('remove', () => {
    it('deve deletar um agendamento', async () => {
      const bookingId = '1';
      const booking = {
        id: bookingId,
        userId: 'user-1',
      };

      mockPrismaService.booking.findUnique.mockResolvedValue(booking);
      mockPrismaService.booking.delete.mockResolvedValue(booking);

      const result = await service.remove(bookingId);

      expect(result).toEqual(booking);
      expect(mockPrismaService.booking.delete).toHaveBeenCalledWith({
        where: { id: bookingId },
      });
    });
  });
});
