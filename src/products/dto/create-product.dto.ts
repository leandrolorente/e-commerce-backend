import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  Min,
} from 'class-validator';
import { ProductCategory } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
