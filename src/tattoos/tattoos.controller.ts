import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TattoosService } from './tattoos.service';
import { CreateTattooDto } from './dto/create-tattoo.dto';
import { UpdateTattooDto } from './dto/update-tattoo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tattoos')
export class TattoosController {
  constructor(private readonly tattoosService: TattoosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createTattooDto: CreateTattooDto) {
    return this.tattoosService.create(createTattooDto);
  }

  @Get()
  findAll(
    @Query('style') style?: string,
    @Query('bodyArea') bodyArea?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tattoosService.findAll(
      style,
      bodyArea,
      featured === 'true',
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tattoosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTattooDto: UpdateTattooDto) {
    return this.tattoosService.update(id, updateTattooDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tattoosService.remove(id);
  }
}
