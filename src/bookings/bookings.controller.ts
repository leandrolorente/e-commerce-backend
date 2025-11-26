import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Get('artists')
  findAllArtists() {
    return this.bookingsService.findAllArtists();
  }

  @Public()
  @Get('available-slots')
  getAvailableSlots(
    @Query('artistId') artistId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailableSlots(artistId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  findMyBookings(@Request() req: RequestWithUser) {
    return this.bookingsService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: RequestWithUser, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, createBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: RequestWithUser) {
    // Admin vê todos, usuário comum vê apenas seus agendamentos
    const userId: string | undefined =
      req.user.role === UserRole.ADMIN ? undefined : req.user.userId;
    return this.bookingsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
