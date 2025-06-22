// src/fertilizer-recommendations/dto/create-fertilizer-recommendation.dto.ts
import { IsNumber, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFertilizerRecommendationDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  cropTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  growthStageId: number;

  @IsObject()
  @IsNotEmpty()
  nutrients: Record<string, any>;
}