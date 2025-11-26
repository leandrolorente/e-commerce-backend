import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Remover campos calculados que não existem no schema
    const { rating, reviewCount, ...productData } = createProductDto;
    
    return this.prisma.product.create({
      data: productData as any,
    });
  }

  async findAll(category?: string, featured?: boolean, limit?: number) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && { category: category as any }),
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: featured ? { createdAt: 'desc' } : undefined,
      take: limit,
    });

    // Adicionar rating e reviewCount calculados
    return products.map((product) => {
      const reviewCount = product.reviews.length;
      const rating =
        reviewCount > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      const { reviews, ...productData } = product;
      return {
        ...productData,
        rating: Math.round(rating * 10) / 10, // Arredondar para 1 casa decimal
        reviewCount,
      };
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Calcular rating e reviewCount
    const reviewCount = product.reviews.length;
    const rating =
      reviewCount > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    return {
      ...product,
      rating: Math.round(rating * 10) / 10,
      reviewCount,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    
    // Remover campos calculados que não existem no schema
    const { rating, reviewCount, ...productData } = updateProductDto;
    
    return this.prisma.product.update({
      where: { id },
      data: productData as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
