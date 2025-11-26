import { PartialType } from '@nestjs/mapped-types';
import { CreateTattooDto } from './create-tattoo.dto';

export class UpdateTattooDto extends PartialType(CreateTattooDto) {}
