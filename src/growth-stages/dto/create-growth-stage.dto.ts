import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGrowthStageDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  duration_days: number;

  @IsNumber()
  @IsOptional()
  optimal_temperature: number;

  @IsNumber()
  @IsOptional()
  optimal_humidity: number;

  @IsString()
  @IsOptional()
  fertilizer_application_notes: string;

  @IsNumber()
  crop_type_id: number;

  @IsNumber()
  @IsOptional()
  fertilizer_id: number;
}