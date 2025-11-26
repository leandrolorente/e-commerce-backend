import { Module } from '@nestjs/common';
import { TattoosService } from './tattoos.service';
import { TattoosController } from './tattoos.controller';

@Module({
  controllers: [TattoosController],
  providers: [TattoosService],
  exports: [TattoosService],
})
export class TattoosModule {}
