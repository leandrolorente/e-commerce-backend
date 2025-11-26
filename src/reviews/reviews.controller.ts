import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get(':productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Public()
  @Get()
  findAll(@Query('featured') featured?: string, @Query('limit') limit?: string) {
    return this.reviewsService.findAll(
      featured === 'true',
      limit ? parseInt(limit) : undefined,
    );
  }
}
