// src/fertilizer-recommendations/dto/create-fertilizer-recommendation.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFertilizerRecommendationDto {
  @IsString()
  @IsNotEmpty()
  sensor_id: string;

  @IsString()
  @IsNotEmpty()
  crop_type_id: string;

  @IsString()
  @IsNotEmpty()
  growth_stage_id: string;
}