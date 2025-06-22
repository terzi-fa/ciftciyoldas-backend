import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { RotationType, Season } from '../entities/crop-rotation-plan.entity';

export class CreateCropRotationPlanDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  duration_years: number;

  @IsEnum(RotationType)
  rotation_type: string;

  @IsArray()
  rotation_sequence: CropRotationYearDto[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  expected_yield_increase?: number;

  @IsOptional()
  @IsNumber()
  estimated_cost_savings?: number;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  challenges?: string;

  @IsNumber()
  field_id: number;
}

export class CropRotationYearDto {
  @IsNumber()
  year: number;

  @IsEnum(Season)
  season: string;

  @IsNumber()
  crop_type_id: number;

  @IsString()
  crop_name: string;

  @IsString()
  crop_family: string;

  @IsBoolean()
  nitrogen_fixation: boolean;

  @IsBoolean()
  pest_repellent: boolean;

  @IsBoolean()
  soil_improvement: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  companion_plants?: string[];
} 