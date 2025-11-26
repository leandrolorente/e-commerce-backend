import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
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
  }

  async findAll(featured?: boolean, limit?: number) {
    const where = {};
    const orderBy: any = featured ? { createdAt: 'desc' } : { createdAt: 'desc' };
    const take = limit || undefined;

    const reviews = await this.prisma.review.findMany({
      where,
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
      orderBy,
      take,
    });

    // Formatar para o padrão de Testimonials do frontend
    return reviews.map((review) => ({
      id: review.id,
      customerName: review.user.name,
      customerPhoto: review.user.avatar || 'https://i.pravatar.cc/150',
      rating: review.rating,
      comment: review.comment || '',
      date: review.createdAt,
      service: review.service || review.product?.name || review.tattoo?.name || 'Serviço',
    }));
  }
}
