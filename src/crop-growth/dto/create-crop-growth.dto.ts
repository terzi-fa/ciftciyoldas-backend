import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCropGrowthDto {
  @IsNumber()
  fieldId: number;

  @IsNumber()
  height: number;

  @IsNumber()
  healthScore: number;

  @IsNumber()
  diseaseIncidence: number;

  @IsString()
  @IsOptional()
  notes?: string;
} 