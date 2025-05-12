import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { FertilizerRulesService } from './fertilizer-rules.service';

@Controller('fertilizer-rules')
export class FertilizerRulesController {
  constructor(private readonly fertilizerRulesService: FertilizerRulesService) {}

  @Get('recommendations')
  async getRecommendations(
    @Query('cropTypeId') cropTypeId: number,
    @Query('growthStageId') growthStageId: number,
  ) {
    return this.fertilizerRulesService.getFertilizerRecommendations(
      Number(cropTypeId),
      Number(growthStageId),
    );
  }

  @Post()
  async createRule(@Body() data: {
    fertilizerId: number;
    cropTypeId: number;
    growthStageId: number;
    applicationMethod: string;
    recommendedAmount: number;
    frequency: string;
  }) {
    return this.fertilizerRulesService.createFertilizerRule(data);
  }

  @Put(':id')
  async updateRule(
    @Param('id') id: string,
    @Body() data: {
      applicationMethod?: string;
      recommendedAmount?: number;
      frequency?: string;
    },
  ) {
    return this.fertilizerRulesService.updateFertilizerRule(Number(id), data);
  }

  @Delete(':id')
  async deleteRule(@Param('id') id: string) {
    return this.fertilizerRulesService.deleteFertilizerRule(Number(id));
  }
} 