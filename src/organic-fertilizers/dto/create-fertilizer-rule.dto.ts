import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateFertilizerRuleDto {
  @IsNumber()
  crop_type_id: number;

  @IsNumber()
  growth_stage_id: number;

  @IsString()
  nutrient_type: string;

  @IsString()
  operator: string;

  @IsNumber()
  value: number;

  @IsNumber()
  fertilizer_id: number;

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  application_method?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}