import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':orderId')
  createPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.createPayment(orderId);
  }

  @Post('webhook')
  handleWebhook(@Body() data: any) {
    return this.paymentsService.handleWebhook(data);
  }
}
