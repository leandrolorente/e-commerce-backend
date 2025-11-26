import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { BodyArea } from '@prisma/client';

export class CreateTattooDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  style: string;

  @IsEnum(BodyArea)
  bodyArea: BodyArea;

  @IsString()
  size: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  imageUrl: string;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
