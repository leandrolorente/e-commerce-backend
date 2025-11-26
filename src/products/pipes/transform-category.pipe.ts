import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';

@Injectable()
export class TransformCategoryPipe implements PipeTransform {
  private readonly categoryMap: Record<string, ProductCategory> = {
    // Mapeamento português -> enum
    'acessorios': ProductCategory.ACCESSORIES,
    'acessórios': ProductCategory.ACCESSORIES,
    'accessories': ProductCategory.ACCESSORIES,
    'vestuario': ProductCategory.CLOTHING,
    'vestuário': ProductCategory.CLOTHING,
    'clothing': ProductCategory.CLOTHING,
    'pos-tatuagem': ProductCategory.AFTERCARE,
    'pós-tatuagem': ProductCategory.AFTERCARE,
    'cuidados': ProductCategory.AFTERCARE,
    'aftercare': ProductCategory.AFTERCARE,
    'vale-presente': ProductCategory.GIFT_CARD,
    'gift-card': ProductCategory.GIFT_CARD,
    'gift_card': ProductCategory.GIFT_CARD,
    'equipamento': ProductCategory.EQUIPMENT,
    'equipamentos': ProductCategory.EQUIPMENT,
    'equipment': ProductCategory.EQUIPMENT,
    'arte': ProductCategory.ART,
    'art': ProductCategory.ART,
    // Valores do enum em maiúsculas
    'AFTERCARE': ProductCategory.AFTERCARE,
    'CLOTHING': ProductCategory.CLOTHING,
    'ACCESSORIES': ProductCategory.ACCESSORIES,
    'MERCHANDISE': ProductCategory.ACCESSORIES, // Backward compatibility
    'GIFT_CARD': ProductCategory.GIFT_CARD,
    'EQUIPMENT': ProductCategory.EQUIPMENT,
    'ART': ProductCategory.ART,
  };

  transform(value: any) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    // Se tem category, faz a transformação
    if (value.category) {
      const normalizedCategory = value.category.toLowerCase().trim();
      const mappedCategory = this.categoryMap[normalizedCategory];

      if (!mappedCategory) {
        throw new BadRequestException(
          `Categoria inválida: "${value.category}". Valores aceitos: acessorios, vestuario, pos-tatuagem, vale-presente, equipamento, arte`,
        );
      }

      return {
        ...value,
        category: mappedCategory,
      };
    }

    return value;
  }
}
