import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @Get('my-orders')
  getMyOrders(@Request() req: RequestWithUser) {
    return this.ordersService.findAll(req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats')
  getStats() {
    return this.ordersService.getStats();
  }

  @Get(':id/track')
  trackOrder(@Param('id') id: string) {
    return this.ordersService.trackOrder(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get()
  findAll(@Request() req: RequestWithUser, @Query('status') status?: string) {
    const userId: string | undefined =
      req.user.role === UserRole.ADMIN ? undefined : req.user.userId;
    return this.ordersService.findAll(userId, status);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Put(':id/cancel')
  cancelOrder(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.userId, id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
