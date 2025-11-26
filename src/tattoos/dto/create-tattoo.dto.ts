import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { BodyArea } from '@prisma/client';

export class CreateTattooDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsEnum(BodyArea)
  bodyArea: BodyArea;

  @IsString()
  style: string;

  @IsString()
  size: string;

  @IsString()
  estimatedTime: string;

  @IsNumber()
  @Min(0)
  estimatedPrice: number;

  @IsString()
  artist: string;

  @IsString()
  difficulty: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
