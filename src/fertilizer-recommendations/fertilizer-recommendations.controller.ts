// src/fertilizer-recommendations/fertilizer-recommendations.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { FertilizerRecommendationsService } from './fertilizer-recommendations.service';
import { CreateFertilizerRecommendationDto } from './dto/create-fertilizer-recommendation.dto';

@Controller('fertilizer-recommendations')
@UseGuards(JwtAuthGuard)
export class FertilizerRecommendationsController {
  constructor(
    private readonly fertilizerRecommendationsService: FertilizerRecommendationsService,
  ) {}

  @Post()
  getRecommendations(@Body() dto: CreateFertilizerRecommendationDto) {
    return this.fertilizerRecommendationsService.getRecommendations(dto);
  }
}