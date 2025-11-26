import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  artistId: string;

  @IsOptional()
  @IsString()
  tattooId?: string;

  @IsString()
  service: string; // "NOVA_TATUAGEM" | "RETOQUE" | "CONSULTA" | "COVER_UP"

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
