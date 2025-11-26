import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTattooDto } from './dto/create-tattoo.dto';
import { UpdateTattooDto } from './dto/update-tattoo.dto';

@Injectable()
export class TattoosService {
  constructor(private prisma: PrismaService) {}

  async create(createTattooDto: CreateTattooDto) {
    return this.prisma.tattoo.create({
      data: createTattooDto,
    });
  }

  async findAll(style?: string, bodyArea?: string) {
    return this.prisma.tattoo.findMany({
      where: {
        isActive: true,
        ...(style && { style: { contains: style, mode: 'insensitive' } }),
        ...(bodyArea && { bodyArea: bodyArea as any }),
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const tattoo = await this.prisma.tattoo.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!tattoo) {
      throw new NotFoundException('Tatuagem não encontrada');
    }

    return tattoo;
  }

  async update(id: string, updateTattooDto: UpdateTattooDto) {
    await this.findOne(id);
    return this.prisma.tattoo.update({
      where: { id },
      data: updateTattooDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tattoo.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
