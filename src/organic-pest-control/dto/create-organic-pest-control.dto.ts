import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ControlMethod, PestType } from '../entities/organic-pest-control.entity';

export class CreateOrganicPestControlDto {
  @IsNumber()
  field_id: number;

  @IsString()
  pest_name: string;

  @IsEnum(PestType)
  pest_type: string;

  @IsEnum(ControlMethod)
  control_method: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  beneficial_organisms?: string;

  @IsOptional()
  @IsString()
  companion_plants?: string;

  @IsOptional()
  @IsString()
  cultural_practices?: string;

  @IsNumber()
  effectiveness: number;

  @IsNumber()
  cost: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  is_preventive?: boolean;

  @IsOptional()
  @IsBoolean()
  is_curative?: boolean;
} 