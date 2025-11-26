import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import mercadopago from 'mercadopago';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    mercadopago.configure({
      access_token: this.configService.get('MERCADOPAGO_ACCESS_TOKEN'),
    });
  }

  async createPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    const preference = {
      items: order.items.map((item) => ({
        title: item.product.name,
        unit_price: item.price,
        quantity: item.quantity,
      })),
      payer: {
        email: order.user.email,
        name: order.user.name,
      },
      back_urls: {
        success: `${this.configService.get('FRONTEND_URL')}/orders/${orderId}/success`,
        failure: `${this.configService.get('FRONTEND_URL')}/orders/${orderId}/failure`,
        pending: `${this.configService.get('FRONTEND_URL')}/orders/${orderId}/pending`,
      },
      auto_return: 'approved' as const,
      notification_url: `${this.configService.get('BACKEND_URL')}/payments/webhook`,
      external_reference: orderId,
    };

    const response = await mercadopago.preferences.create(preference);

    await this.prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        mercadoPagoId: response.body.id,
      },
    });

    return {
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
    };
  }

  async handleWebhook(data: any) {
    if (data.type === 'payment') {
      const payment = await mercadopago.payment.findById(data.data.id);

      await this.prisma.payment.update({
        where: { mercadoPagoId: payment.body.id.toString() },
        data: {
          status: this.mapPaymentStatus(payment.body.status),
          mercadoPagoStatus: payment.body.status,
          paymentMethod: payment.body.payment_method_id,
        },
      });

      if (payment.body.status === 'approved') {
        await this.prisma.order.update({
          where: { id: payment.body.external_reference },
          data: { status: 'PROCESSING' },
        });
      }
    }
  }

  private mapPaymentStatus(mercadopagoStatus: string): string {
    const statusMap: Record<string, string> = {
      approved: 'APPROVED',
      pending: 'PENDING',
      rejected: 'REJECTED',
      cancelled: 'CANCELLED',
      refunded: 'REFUNDED',
    };
    return statusMap[mercadopagoStatus] || 'PENDING';
  }
}
