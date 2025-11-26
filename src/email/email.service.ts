import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendBookingConfirmation(to: string, bookingData: any) {
    const msg = {
      to,
      from: this.configService.get('SENDGRID_FROM_EMAIL'),
      subject: '✅ Agendamento Confirmado - GuaranaTattoShop',
      html: `
        <h1>Agendamento Confirmado!</h1>
        <p>Olá ${bookingData.userName},</p>
        <p>Seu agendamento foi confirmado com sucesso!</p>
        
        <h2>Detalhes do Agendamento:</h2>
        <ul>
          <li><strong>Artista:</strong> ${bookingData.artistName}</li>
          <li><strong>Serviço:</strong> ${bookingData.service}</li>
          <li><strong>Data:</strong> ${bookingData.date}</li>
          <li><strong>Horário:</strong> ${bookingData.time}</li>
        </ul>
        
        <p>Nos vemos em breve!</p>
        <p><strong>GuaranaTattoShop</strong></p>
      `,
    };

    return sgMail.send(msg);
  }

  async sendOrderConfirmation(to: string, orderData: any) {
    const msg = {
      to,
      from: this.configService.get('SENDGRID_FROM_EMAIL'),
      subject: '🛒 Pedido Confirmado - GuaranaTattoShop',
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá ${orderData.userName},</p>
        <p>Recebemos seu pedido #${orderData.orderId}</p>
        
        <h2>Itens do Pedido:</h2>
        <ul>
          ${orderData.items.map((item: any) => `
            <li>${item.name} - Qtd: ${item.quantity} - R$ ${item.price}</li>
          `).join('')}
        </ul>
        
        <p><strong>Total:</strong> R$ ${orderData.total}</p>
        
        <p>Obrigado pela sua compra!</p>
        <p><strong>GuaranaTattoShop</strong></p>
      `,
    };

    return sgMail.send(msg);
  }

  async sendPasswordReset(to: string, resetToken: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const msg = {
      to,
      from: this.configService.get('SENDGRID_FROM_EMAIL'),
      subject: '🔑 Redefinir Senha - GuaranaTattoShop',
      html: `
        <h1>Redefinir Senha</h1>
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este link expira em 1 hora.</p>
        <p><strong>GuaranaTattoShop</strong></p>
      `,
    };

    return sgMail.send(msg);
  }
}
