import { PartialType } from '@nestjs/mapped-types';
import { CreateCropGrowthDto } from './create-crop-growth.dto';

export class UpdateCropGrowthDto extends PartialType(CreateCropGrowthDto) {} 