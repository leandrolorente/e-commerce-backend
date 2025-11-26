import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';

@Injectable()
export class TransformCategoryPipe implements PipeTransform {
  private readonly categoryMap: Record<string, ProductCategory> = {
    // Mapeamento português -> enum
    'acessorios': ProductCategory.MERCHANDISE,
    'acessórios': ProductCategory.MERCHANDISE,
    'merchandise': ProductCategory.MERCHANDISE,
    'pos-tatuagem': ProductCategory.AFTERCARE,
    'pós-tatuagem': ProductCategory.AFTERCARE,
    'aftercare': ProductCategory.AFTERCARE,
    'vale-presente': ProductCategory.GIFT_CARD,
    'gift-card': ProductCategory.GIFT_CARD,
    'gift_card': ProductCategory.GIFT_CARD,
    'equipamento': ProductCategory.EQUIPMENT,
    'equipment': ProductCategory.EQUIPMENT,
    // Valores do enum em maiúsculas
    'AFTERCARE': ProductCategory.AFTERCARE,
    'MERCHANDISE': ProductCategory.MERCHANDISE,
    'GIFT_CARD': ProductCategory.GIFT_CARD,
    'EQUIPMENT': ProductCategory.EQUIPMENT,
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
          `Categoria inválida: "${value.category}". Valores aceitos: acessorios, pos-tatuagem, vale-presente, equipamento`,
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
