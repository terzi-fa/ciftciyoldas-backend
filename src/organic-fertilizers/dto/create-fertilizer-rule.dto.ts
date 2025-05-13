// src/organic-fertilizers/dto/create-fertilizer-rule.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFertilizerRuleDto {
  @IsNumber()
  fertilizerId: number;

  @IsNumber()
  cropTypeId: number;

  @IsNumber()
  growthStageId: number;

  @IsString()
  nutrientType: string;

  @IsString()
  operator: string;

  @IsNumber()
  value: number;

  @IsString()
  @IsOptional()
  applicationMethod?: string;

  @IsNumber()
  @IsOptional()
  recommendedAmount?: number;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}