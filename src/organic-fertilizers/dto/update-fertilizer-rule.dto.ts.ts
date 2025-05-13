// src/organic-fertilizers/dto/update-fertilizer-rule.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFertilizerRuleDto {
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