import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudioService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [artistsCount, satisfiedClients] = await Promise.all([
      this.prisma.artist.count({ where: { isActive: true } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      yearsExperience: 6, // Fixo conforme requisito do frontend
      satisfiedClients,
      artistsCount,
      awardsCount: 10, // Fixo conforme requisito do frontend
    };
  }
}
