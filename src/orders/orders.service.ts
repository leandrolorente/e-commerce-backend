import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // Calcular total
    const total = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        userId,
        total,
        shippingAddress: createOrderDto.shippingAddress,
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, status?: string) {
    return this.prisma.order.findMany({
      where: {
        ...(userId && { userId }),
        ...(status && { status: status as OrderStatus }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async cancelOrder(userId: string, id: string) {
    const order = await this.findOne(id);

    if (order.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para cancelar este pedido');
    }

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.SHIPPED) {
      throw new ForbiddenException('Não é possível cancelar um pedido já enviado ou entregue');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async trackOrder(id: string) {
    const order = await this.findOne(id);
    return {
      orderId: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingAddress: order.shippingAddress,
      timeline: this.getOrderTimeline(order.status, order.createdAt, order.updatedAt),
    };
  }

  async getStats() {
    const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({
      where: { id },
    });
  }

  private getOrderTimeline(status: OrderStatus, createdAt: Date, updatedAt: Date) {
    const timeline = [
      { status: 'PENDING', completed: true, date: createdAt },
    ];

    if (status === OrderStatus.PROCESSING || status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED) {
      timeline.push({ status: 'PROCESSING', completed: true, date: updatedAt });
    }

    if (status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED) {
      timeline.push({ status: 'SHIPPED', completed: true, date: updatedAt });
    }

    if (status === OrderStatus.DELIVERED) {
      timeline.push({ status: 'DELIVERED', completed: true, date: updatedAt });
    }

    if (status === OrderStatus.CANCELLED) {
      timeline.push({ status: 'CANCELLED', completed: true, date: updatedAt });
    }

    return timeline;
  }
}
