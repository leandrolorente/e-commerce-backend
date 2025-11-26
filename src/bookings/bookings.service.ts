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
    // Verificar se artista existe
    const artist = await this.prisma.artist.findUnique({
      where: { id: createBookingDto.artistId },
    });

    if (!artist || !artist.isActive) {
      throw new NotFoundException('Artista não encontrado');
    }

    // Verificar se tatuagem existe (se fornecida)
    if (createBookingDto.tattooId) {
      const tattoo = await this.prisma.tattoo.findUnique({
        where: { id: createBookingDto.tattooId },
      });

      if (!tattoo || !tattoo.isActive) {
        throw new NotFoundException('Tatuagem não encontrada');
      }
    }

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        userId,
        date: new Date(createBookingDto.date),
      },
      include: {
        artist: true,
        tattoo: true,
      },
    });
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
}
