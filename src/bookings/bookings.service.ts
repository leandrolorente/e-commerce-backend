import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // Verificar se usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException(
        'Usuário não encontrado. Por favor, faça login novamente.',
      );
    }

    // Verificar se artista existe
    const artist = await this.prisma.artist.findUnique({
      where: { id: createBookingDto.artistId },
    });

    if (!artist) {
      throw new NotFoundException(
        `Artista com ID "${createBookingDto.artistId}" não encontrado`,
      );
    }

    if (!artist.isActive) {
      throw new BadRequestException('Este artista não está mais ativo');
    }

    // Verificar se tatuagem existe (se fornecida)
    if (createBookingDto.tattooId) {
      const tattoo = await this.prisma.tattoo.findUnique({
        where: { id: createBookingDto.tattooId },
      });

      if (!tattoo) {
        throw new NotFoundException(
          `Tatuagem com ID "${createBookingDto.tattooId}" não encontrada`,
        );
      }

      if (!tattoo.isAvailable) {
        throw new BadRequestException('Esta tatuagem não está mais disponível');
      }
    }

    try {
      return await this.prisma.booking.create({
        data: {
          ...createBookingDto,
          userId,
          date: new Date(createBookingDto.date),
        },
        include: {
          artist: true,
          tattoo: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Erro ao criar agendamento: um ou mais IDs fornecidos são inválidos. Verifique o artistId e tattooId.',
        );
      }
      throw error;
    }
  }

  async findAll(userId?: string) {
    return this.prisma.booking.findMany({
      where: userId ? { userId } : {},
      include: {
        artist: true,
        tattoo: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        artist: true,
        tattoo: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        artist: true,
        tattoo: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({
      where: { id },
    });
  }

  async findAllArtists() {
    return this.prisma.artist.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getAvailableSlots(artistId: string, date: string) {
    if (!artistId || !date) {
      throw new BadRequestException('artistId e date são obrigatórios');
    }

    // Verificar se artista existe
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist || !artist.isActive) {
      throw new NotFoundException('Artista não encontrado');
    }

    // Buscar agendamentos existentes para o dia
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        artistId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        date: true,
      },
    });

    // Horários de trabalho: 9h às 18h
    const workingHours = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];

    const bookedHours = existingBookings.map((booking) => {
      const hour = booking.date.getHours();
      const minutes = booking.date.getMinutes();
      return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    });

    const availableSlots = workingHours.filter(
      (slot) => !bookedHours.includes(slot),
    );

    return {
      artistId,
      date,
      availableSlots,
      bookedSlots: bookedHours,
    };
  }
}
