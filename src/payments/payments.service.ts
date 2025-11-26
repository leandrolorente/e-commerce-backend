import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private client: MercadoPagoConfig;
  private preferenceClient: Preference;
  private paymentClient: Payment;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken:
        this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN') || '',
    });
    this.preferenceClient = new Preference(this.client);
    this.paymentClient = new Payment(this.client);
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

    if (!order) {
      throw new Error('Order not found');
    }

    const preference = {
      items: order.items.map((item) => ({
        id: item.productId,
        title: item.product.name,
        unit_price: Number(item.price),
        quantity: item.quantity,
      })),
      payer: {
        email: order.user.email,
        name: order.user.name || undefined,
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

    const response = await this.preferenceClient.create({ body: preference });

    await this.prisma.payment.create({
      data: {
        orderId,
        amount: order.total,
        mercadoPagoId: response.id || '',
      },
    });

    return {
      preferenceId: response.id,
      initPoint: response.init_point,
    };
  }

  async handleWebhook(data: any) {
    if (data.type === 'payment') {
      const payment = await this.paymentClient.get({ id: data.data.id });

      await this.prisma.payment.update({
        where: { mercadoPagoId: payment.id?.toString() || '' },
        data: {
          status: this.mapPaymentStatus(payment.status || ''),
          mercadoPagoStatus: payment.status || null,
          paymentMethod: payment.payment_method_id || null,
        },
      });

      if (payment.status === 'approved') {
        await this.prisma.order.update({
          where: { id: payment.external_reference || '' },
          data: { status: 'PROCESSING' },
        });
      }
    }
  }

  private mapPaymentStatus(mercadopagoStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      approved: PaymentStatus.APPROVED,
      pending: PaymentStatus.PENDING,
      rejected: PaymentStatus.REJECTED,
      cancelled: PaymentStatus.CANCELLED,
      refunded: PaymentStatus.REFUNDED,
    };
    return statusMap[mercadopagoStatus] || PaymentStatus.PENDING;
  }
}
